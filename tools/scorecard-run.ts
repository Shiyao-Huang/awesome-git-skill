#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, relative, sep } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

type Domain = 'facade' | 'docs' | 'community' | 'quality' | 'caselib' | 'tooling';
type SourceType = 'github_repo' | 'url_fetch' | 'npm' | 'crates' | 'pypi' | 'lighthouse' | 'manual_review';

type Threshold = {
  gte?: number;
  lte?: number;
  score: number;
};

type SignalInput = {
  value?: number;
  score?: number;
  captured_at: string;
  evidence_paths: string[];
  note?: string;
};

type ScorecardRunConfig = {
  project: string;
  repo_url: string;
  case_study_path: string;
  dimensions: Domain[];
  scorecard_version?: string;
  allow_partial_dimensions?: boolean;
  strict?: boolean;
  skipped_subitems?: Array<{ subitem: string; reason: string }>;
  signal_values: Record<string, SignalInput>;
  output?: {
    json_path?: string;
    markdown_path?: string;
  };
};

type BenchmarkFrontmatter = {
  id: string;
  dimension: Domain;
  version?: string;
  status?: string;
  weight: number;
  last_verified_at?: string;
};

type CaseStudyFrontmatter = {
  id: string;
  project: string;
  repo_url: string;
  star_count: number | string;
  star_count_at: string;
  star_source: string;
  category: string;
  dimensions_covered: Domain[];
  status: string;
  last_verified_at: string;
  sources: Array<{ id: string; url: string; captured_at: string; type?: string; note?: string }>;
};

type ParsedSubitem = {
  name: string;
  leafTag: string;
  aggregation: 'mean' | 'max' | 'weighted';
  weights: Record<string, number>;
  signals: ParsedSignal[];
};

type ParsedSignal = {
  signalId: string;
  source: SourceType;
  query?: string;
  collector: string;
  thresholds: Threshold[];
  manualRubric?: string;
};

type ParsedBenchmark = {
  filePath: string;
  frontmatter: BenchmarkFrontmatter;
  subitems: ParsedSubitem[];
};

type SignalScore = {
  signal_id: string;
  source: SourceType;
  collector: string;
  input?: number;
  score: number;
  captured_at: string;
  evidence_paths: string[];
  note?: string;
};

type SubitemScore = {
  leaf_tag: string;
  name: string;
  aggregation: 'mean' | 'max' | 'weighted';
  score: number;
  signals: SignalScore[];
};

type DimensionScore = {
  weight: number;
  score: number;
  benchmark_status?: string;
  benchmark_file: string;
  subitems: Record<string, SubitemScore>;
  evidence_paths: string[];
};

type ScorecardOutput = {
  project: string;
  repo_url: string;
  ran_at: string;
  scorecard_version: string;
  strict: boolean;
  overall: number | null;
  overall_mode: 'full' | 'partial-normalized';
  requested_dimensions: Domain[];
  skipped: Array<{ subitem: string; reason: string }>;
  dimensions: Record<string, DimensionScore>;
  failures: string[];
};

const DOMAINS: Domain[] = ['facade', 'docs', 'community', 'quality', 'caselib', 'tooling'];
const SOURCE_WHITELIST = new Set<SourceType>([
  'github_repo',
  'url_fetch',
  'npm',
  'crates',
  'pypi',
  'lighthouse',
  'manual_review',
]);
const DEPRECATED_DIMENSION_NAMES = new Set(['release', 'growth', 'seo', 'case-library']);
const ROOT = process.cwd();

class ScorecardRunError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScorecardRunError';
  }
}

function main(): void {
  const cli = parseArgs(process.argv.slice(2));
  const configPath = resolve(ROOT, cli.configPath ?? 'tools/scorecard-run.config.json');
  const config = loadConfig(configPath);
  const strict = cli.strict ?? config.strict ?? true;
  const leaves = loadLeafWhitelist(resolve(ROOT, 'plans/01-taxonomy.md'));

  logInfo(`LOADED ${leaves.size} leaves whitelist from plans/01-taxonomy.md`);

  const caseStudy = loadCaseStudy(resolve(ROOT, config.case_study_path), config.repo_url, strict);
  const requestedDimensions = normalizeRequestedDimensions(config.dimensions);
  validateRequestedDimensionsAgainstCaseStudy(requestedDimensions, caseStudy, strict);

  if (!config.allow_partial_dimensions && requestedDimensions.length !== DOMAINS.length) {
    throw new ScorecardRunError(
      `config.dimensions requests ${requestedDimensions.length} domains; set allow_partial_dimensions=true or provide all 6 domains`,
    );
  }

  const benchmarks = requestedDimensions.map((dimension) =>
    loadBenchmark(resolve(ROOT, `benchmarks/${dimension}.md`), leaves, strict),
  );

  const result = runScorecard({
    config,
    caseStudy,
    strict,
    benchmarks,
    requestedDimensions,
  });

  const jsonText = JSON.stringify(result, null, 2);
  if (config.output?.json_path) {
    writeText(resolve(ROOT, config.output.json_path), jsonText);
  }

  const markdown = renderMarkdownReport(result);
  if (config.output?.markdown_path) {
    writeText(resolve(ROOT, config.output.markdown_path), markdown);
  }

  process.stdout.write(`${jsonText}\n`);
}

function parseArgs(argv: string[]): { configPath?: string; strict?: boolean } {
  const cli: { configPath?: string; strict?: boolean } = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--config') {
      cli.configPath = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--strict') {
      cli.strict = true;
      continue;
    }
    if (arg.startsWith('--strict=')) {
      const value = arg.split('=')[1];
      cli.strict = value !== 'false';
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(
        [
          'Usage: node --experimental-strip-types tools/scorecard-run.ts [--config <path>] [--strict|--strict=false]',
          '',
          'Reads tools/scorecard-run.config.json by default and emits JSON to stdout.',
        ].join('\n') + '\n',
      );
      process.exit(0);
    }
    throw new ScorecardRunError(`Unknown argument: ${arg}`);
  }
  return cli;
}

function loadConfig(filePath: string): ScorecardRunConfig {
  const raw = readText(filePath, 'config');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new ScorecardRunError(`config JSON parse failed: ${filePath}: ${(error as Error).message}`);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new ScorecardRunError(`config must be a JSON object: ${filePath}`);
  }
  const config = parsed as Partial<ScorecardRunConfig>;
  if (!config.project || !config.repo_url || !config.case_study_path) {
    throw new ScorecardRunError(`config requires project, repo_url, case_study_path: ${filePath}`);
  }
  if (!Array.isArray(config.dimensions) || config.dimensions.length === 0) {
    throw new ScorecardRunError(`config.dimensions must be a non-empty array: ${filePath}`);
  }
  if (!config.signal_values || typeof config.signal_values !== 'object') {
    throw new ScorecardRunError(`config.signal_values must be an object: ${filePath}`);
  }
  return {
    project: config.project,
    repo_url: config.repo_url,
    case_study_path: config.case_study_path,
    dimensions: config.dimensions as Domain[],
    scorecard_version: config.scorecard_version ?? '0.1.0',
    allow_partial_dimensions: Boolean(config.allow_partial_dimensions),
    strict: config.strict,
    skipped_subitems: config.skipped_subitems ?? [],
    signal_values: config.signal_values as Record<string, SignalInput>,
    output: config.output,
  };
}

function loadLeafWhitelist(filePath: string): Set<string> {
  const text = readText(filePath, 'taxonomy whitelist');
  const matches = text.matchAll(/\[([a-z]+:[a-z0-9-]+)\]/g);
  const set = new Set<string>();
  for (const match of matches) {
    const value = match[1];
    if (value.split(':').length === 2 && DOMAINS.includes(value.split(':')[0] as Domain)) {
      set.add(value);
    }
  }
  if (set.size === 0) {
    throw new ScorecardRunError(`no taxonomy leaves found in ${filePath}`);
  }
  return set;
}

function loadCaseStudy(filePath: string, expectedRepoUrl: string, strict: boolean): CaseStudyFrontmatter {
  const text = readText(filePath, 'case-study');
  const frontmatter = extractFrontmatter(text, filePath) as Partial<CaseStudyFrontmatter>;

  requireString(filePath, frontmatter.id, 'id');
  if (!String(frontmatter.id).startsWith('case-')) {
    throw new ScorecardRunError(`${relativePath(filePath)}: id must start with case-`);
  }
  requireString(filePath, frontmatter.project, 'project');
  requireString(filePath, frontmatter.repo_url, 'repo_url');
  if (frontmatter.repo_url !== expectedRepoUrl) {
    throw new ScorecardRunError(
      `${relativePath(filePath)}: repo_url mismatch (config=${expectedRepoUrl}, case-study=${frontmatter.repo_url})`,
    );
  }
  requireString(filePath, frontmatter.star_count_at, 'star_count_at');
  requireString(filePath, frontmatter.last_verified_at, 'last_verified_at');
  requireString(filePath, frontmatter.category, 'category');
  requireString(filePath, frontmatter.status, 'status');
  if (!Array.isArray(frontmatter.dimensions_covered) || frontmatter.dimensions_covered.length < 3) {
    throw new ScorecardRunError(`${relativePath(filePath)}: dimensions_covered[] must contain at least 3 top-level domains`);
  }
  for (const value of frontmatter.dimensions_covered) {
    if (typeof value !== 'string') {
      throw new ScorecardRunError(`${relativePath(filePath)}: dimensions_covered[] entries must be strings`);
    }
    if (value.includes(':')) {
      throw new ScorecardRunError(`${relativePath(filePath)}: dimensions_covered[] only accepts top-level domains, got ${value}`);
    }
    if (!DOMAINS.includes(value as Domain)) {
      if (!strict && DEPRECATED_DIMENSION_NAMES.has(value)) {
        logWarn(`${relativePath(filePath)}: deprecated dimension ${value} observed under --strict=false`);
      } else {
        throw new ScorecardRunError(`${relativePath(filePath)}: invalid dimensions_covered[] value ${value}`);
      }
    }
  }
  if (!Array.isArray(frontmatter.sources) || frontmatter.sources.length < 3) {
    throw new ScorecardRunError(`${relativePath(filePath)}: sources[] must contain at least 3 entries`);
  }
  for (const source of frontmatter.sources) {
    if (!source || typeof source !== 'object') {
      throw new ScorecardRunError(`${relativePath(filePath)}: sources[] entries must be objects`);
    }
    requireString(filePath, source.id, 'sources[].id');
    requireString(filePath, source.url, 'sources[].url');
    requireString(filePath, source.captured_at, 'sources[].captured_at');
  }
  return frontmatter as CaseStudyFrontmatter;
}

function validateRequestedDimensionsAgainstCaseStudy(dimensions: Domain[], caseStudy: CaseStudyFrontmatter, strict: boolean): void {
  const covered = new Set(caseStudy.dimensions_covered);
  const missing = dimensions.filter((dimension) => !covered.has(dimension));
  if (missing.length === 0) {
    return;
  }
  const message = `${relativePath(caseStudy.repo_url)}: case-study dimensions_covered[] missing requested domains ${missing.join(', ')}`;
  if (strict) {
    throw new ScorecardRunError(message);
  }
  logWarn(message);
}

function loadBenchmark(filePath: string, leafWhitelist: Set<string>, strict: boolean): ParsedBenchmark {
  const text = readText(filePath, 'benchmark');
  const frontmatter = extractFrontmatter(text, filePath) as Partial<BenchmarkFrontmatter>;
  requireString(filePath, frontmatter.id, 'id');
  if (!String(frontmatter.id).startsWith('bench-')) {
    throw new ScorecardRunError(`${relativePath(filePath)}: benchmark id must start with bench-`);
  }
  requireString(filePath, frontmatter.dimension, 'dimension');
  if (!DOMAINS.includes(frontmatter.dimension as Domain)) {
    if (!strict && DEPRECATED_DIMENSION_NAMES.has(String(frontmatter.dimension))) {
      logWarn(`${relativePath(filePath)}: deprecated benchmark dimension ${frontmatter.dimension} under --strict=false`);
    } else {
      throw new ScorecardRunError(`${relativePath(filePath)}: invalid benchmark dimension ${frontmatter.dimension}`);
    }
  }
  const weight = Number(frontmatter.weight);
  if (Number.isNaN(weight)) {
    throw new ScorecardRunError(`${relativePath(filePath)}: weight must be numeric`);
  }

  const body = removeFrontmatter(text);
  const subitems = parseBenchmarkSubitems(body, filePath, leafWhitelist);
  if (subitems.length === 0) {
    throw new ScorecardRunError(`${relativePath(filePath)}: no parsed subitems found; benchmark is still stub/incomplete`);
  }

  return {
    filePath,
    frontmatter: {
      id: String(frontmatter.id),
      dimension: frontmatter.dimension as Domain,
      version: frontmatter.version,
      status: frontmatter.status,
      weight,
      last_verified_at: frontmatter.last_verified_at,
    },
    subitems,
  };
}

function parseBenchmarkSubitems(body: string, filePath: string, leafWhitelist: Set<string>): ParsedSubitem[] {
  const lines = normalizeNewlines(body).split('\n');
  const subitems: ParsedSubitem[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^##\s+(.+?)\s+`?\[([^\]]+)\]`?\s*$/);
    if (!heading) {
      continue;
    }
    const name = heading[1].trim();
    const leafTag = heading[2].trim();
    if (!leafWhitelist.has(leafTag)) {
      throw new ScorecardRunError(`${relativePath(filePath)}: subitem heading references unknown leaf ${leafTag}`);
    }
    let yamlStart = -1;
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^##\s+/.test(lines[cursor])) {
        break;
      }
      if (lines[cursor].trim() === '```yaml') {
        yamlStart = cursor;
        break;
      }
    }
    if (yamlStart === -1) {
      continue;
    }
    const yamlLines: string[] = [];
    let yamlEnd = -1;
    for (let cursor = yamlStart + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].trim() === '```') {
        yamlEnd = cursor;
        break;
      }
      yamlLines.push(lines[cursor]);
    }
    if (yamlEnd === -1) {
      throw new ScorecardRunError(`${relativePath(filePath)}: unclosed YAML fence for ${leafTag}`);
    }
    const parsed = parseYamlLike(yamlLines.join('\n')) as {
      subitem_aggregation?: string;
      weights?: Record<string, number>;
      signals?: Array<Record<string, unknown>>;
    };
    const aggregation = parsed.subitem_aggregation;
    if (aggregation !== 'mean' && aggregation !== 'max' && aggregation !== 'weighted') {
      throw new ScorecardRunError(`${relativePath(filePath)}: ${leafTag} missing valid subitem_aggregation`);
    }
    if (!Array.isArray(parsed.signals) || parsed.signals.length === 0) {
      throw new ScorecardRunError(`${relativePath(filePath)}: ${leafTag} has no signals`);
    }
    const signals = parsed.signals.map((signal, signalIndex) => parseSignal(signal, filePath, leafTag, signalIndex));
    subitems.push({
      name,
      leafTag,
      aggregation,
      weights: normalizeWeights(parsed.weights ?? {}),
      signals,
    });
    index = yamlEnd;
  }

  return subitems;
}

function parseSignal(raw: Record<string, unknown>, filePath: string, leafTag: string, signalIndex: number): ParsedSignal {
  const signalId = String(raw.signal_id ?? '');
  const source = String(raw.source ?? '') as SourceType;
  const collector = String(raw.collector ?? '');
  if (!signalId) {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${leafTag} signal[${signalIndex}] missing signal_id`);
  }
  if (!SOURCE_WHITELIST.has(source)) {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${signalId} has unsupported source ${source}`);
  }
  if (!collector) {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${signalId} missing collector`);
  }
  const thresholds = Array.isArray(raw.thresholds)
    ? raw.thresholds.map((item) => normalizeThreshold(item, filePath, signalId))
    : [];
  const manualRubric = typeof raw.manual_rubric === 'string' ? raw.manual_rubric : undefined;
  if (thresholds.length === 0 && !manualRubric && !isAliasSignal(raw)) {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${signalId} requires thresholds or manual_rubric`);
  }
  return {
    signalId,
    source,
    query: typeof raw.query === 'string' ? raw.query : undefined,
    collector,
    thresholds,
    manualRubric,
  };
}

function normalizeThreshold(raw: unknown, filePath: string, signalId: string): Threshold {
  if (!raw || typeof raw !== 'object') {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${signalId} threshold must be an object`);
  }
  const threshold = raw as Record<string, unknown>;
  const score = Number(threshold.score);
  if (Number.isNaN(score)) {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${signalId} threshold missing numeric score`);
  }
  const result: Threshold = { score };
  if (threshold.gte !== undefined) {
    result.gte = Number(threshold.gte);
  }
  if (threshold.lte !== undefined) {
    result.lte = Number(threshold.lte);
  }
  return result;
}

function runScorecard(args: {
  config: ScorecardRunConfig;
  caseStudy: CaseStudyFrontmatter;
  strict: boolean;
  benchmarks: ParsedBenchmark[];
  requestedDimensions: Domain[];
}): ScorecardOutput {
  const { config, caseStudy, strict, benchmarks, requestedDimensions } = args;
  const skippedMap = new Map<string, string>();
  for (const skipped of config.skipped_subitems ?? []) {
    skippedMap.set(skipped.subitem, skipped.reason);
  }

  const dimensions: Record<string, DimensionScore> = {};
  const skipped: Array<{ subitem: string; reason: string }> = [];
  let weightedScoreSum = 0;
  let weightSum = 0;

  for (const benchmark of benchmarks) {
    const subitems: Record<string, SubitemScore> = {};
    const dimensionEvidence = new Set<string>();
    let subitemScoreSum = 0;
    let subitemCount = 0;

    for (const subitem of benchmark.subitems) {
      const skipReason = skippedMap.get(subitem.leafTag.replace(':', '.')) ?? skippedMap.get(subitem.leafTag);
      if (skipReason) {
        skipped.push({ subitem: subitem.leafTag, reason: skipReason });
        continue;
      }
      const signalScores = subitem.signals.map((signal) =>
        resolveSignalScore(signal, config.signal_values, strict, benchmark.filePath),
      );
      signalScores.forEach((signalScore) => signalScore.evidence_paths.forEach((path) => dimensionEvidence.add(path)));
      const score = aggregateSubitemScore(subitem, signalScores, benchmark.filePath);
      subitems[subitem.leafTag] = {
        leaf_tag: subitem.leafTag,
        name: subitem.name,
        aggregation: subitem.aggregation,
        score,
        signals: signalScores,
      };
      subitemScoreSum += score;
      subitemCount += 1;
    }

    if (subitemCount === 0) {
      throw new ScorecardRunError(`${relativePath(benchmark.filePath)}: all subitems skipped; nothing to score`);
    }

    const dimensionScore = round1((subitemScoreSum / (subitemCount * 5)) * 100);
    dimensions[benchmark.frontmatter.dimension] = {
      weight: benchmark.frontmatter.weight,
      score: dimensionScore,
      benchmark_status: benchmark.frontmatter.status,
      benchmark_file: relativePath(benchmark.filePath),
      subitems,
      evidence_paths: Array.from(dimensionEvidence).sort(),
    };
    weightedScoreSum += dimensionScore * benchmark.frontmatter.weight;
    weightSum += benchmark.frontmatter.weight;
  }

  const overallMode = requestedDimensions.length === DOMAINS.length ? 'full' : 'partial-normalized';
  const overall = weightSum > 0 ? round1(weightedScoreSum / weightSum) : null;

  return {
    project: config.project,
    repo_url: caseStudy.repo_url,
    ran_at: new Date().toISOString(),
    scorecard_version: config.scorecard_version ?? '0.1.0',
    strict,
    overall,
    overall_mode: overallMode,
    requested_dimensions: requestedDimensions,
    skipped,
    dimensions,
    failures: [],
  };
}

function resolveSignalScore(
  signal: ParsedSignal,
  signalValues: Record<string, SignalInput>,
  strict: boolean,
  benchmarkFile: string,
): SignalScore {
  const aliasTarget = extractAliasTarget(signal.query);
  if (aliasTarget) {
    const aliasInput = signalValues[aliasTarget];
    if (!aliasInput) {
      throw new ScorecardRunError(`${relativePath(benchmarkFile)}: ${signal.signalId} aliases ${aliasTarget}, but ${aliasTarget} has no signal_values entry`);
    }
    if (typeof aliasInput.score !== 'number') {
      throw new ScorecardRunError(`${relativePath(benchmarkFile)}: alias target ${aliasTarget} must provide score for reuse by ${signal.signalId}`);
    }
    validateSignalInput(aliasInput, aliasTarget, benchmarkFile, strict);
    return {
      signal_id: signal.signalId,
      source: signal.source,
      collector: signal.collector,
      score: aliasInput.score,
      captured_at: aliasInput.captured_at,
      evidence_paths: aliasInput.evidence_paths,
      note: aliasInput.note ?? `aliased from ${aliasTarget}`,
    };
  }

  const input = signalValues[signal.signalId];
  if (!input) {
    throw new ScorecardRunError(`${relativePath(benchmarkFile)}: missing signal_values entry for ${signal.signalId}`);
  }
  validateSignalInput(input, signal.signalId, benchmarkFile, strict);

  if (signal.manualRubric) {
    if (typeof input.score !== 'number') {
      throw new ScorecardRunError(`${relativePath(benchmarkFile)}: ${signal.signalId} requires signal_values.<id>.score for manual rubric scoring`);
    }
    return {
      signal_id: signal.signalId,
      source: signal.source,
      collector: signal.collector,
      score: input.score,
      captured_at: input.captured_at,
      evidence_paths: input.evidence_paths,
      note: input.note,
    };
  }

  if (typeof input.value !== 'number') {
    throw new ScorecardRunError(`${relativePath(benchmarkFile)}: ${signal.signalId} requires signal_values.<id>.value`);
  }

  const threshold = scoreThreshold(signal.thresholds, input.value, signal.signalId, benchmarkFile);
  return {
    signal_id: signal.signalId,
    source: signal.source,
    collector: signal.collector,
    input: input.value,
    score: threshold.score,
    captured_at: input.captured_at,
    evidence_paths: input.evidence_paths,
    note: input.note,
  };
}

function validateSignalInput(input: SignalInput, signalId: string, benchmarkFile: string, strict: boolean): void {
  if (!input || typeof input !== 'object') {
    throw new ScorecardRunError(`${relativePath(benchmarkFile)}: signal_values.${signalId} must be an object`);
  }
  requireString(benchmarkFile, input.captured_at, `signal_values.${signalId}.captured_at`);
  if (!Array.isArray(input.evidence_paths) || input.evidence_paths.length === 0) {
    throw new ScorecardRunError(`${relativePath(benchmarkFile)}: signal_values.${signalId}.evidence_paths must be a non-empty array`);
  }
  if (!strict && input.note?.includes('deprecated')) {
    logWarn(`${relativePath(benchmarkFile)}: ${signalId} note=${input.note}`);
  }
}

function aggregateSubitemScore(subitem: ParsedSubitem, signalScores: SignalScore[], filePath: string): number {
  if (subitem.aggregation === 'max') {
    return round1(Math.max(...signalScores.map((signal) => signal.score)));
  }
  if (subitem.aggregation === 'mean') {
    return round1(signalScores.reduce((sum, signal) => sum + signal.score, 0) / signalScores.length);
  }

  let weightedTotal = 0;
  let weightTotal = 0;
  for (const signal of signalScores) {
    const weightKey = getWeightedSignalKey(signal.signal_id);
    const weight = subitem.weights[weightKey];
    if (typeof weight !== 'number') {
      throw new ScorecardRunError(`${relativePath(filePath)}: missing weight for ${signal.signal_id} (expected key ${weightKey})`);
    }
    weightedTotal += signal.score * weight;
    weightTotal += weight;
  }
  if (weightTotal <= 0) {
    throw new ScorecardRunError(`${relativePath(filePath)}: weighted aggregation requires positive weight total`);
  }
  return round1(weightedTotal / weightTotal);
}

function scoreThreshold(thresholds: Threshold[], input: number, signalId: string, benchmarkFile: string): Threshold {
  const matches = thresholds.filter((threshold) => {
    if (threshold.gte !== undefined && input < threshold.gte) {
      return false;
    }
    if (threshold.lte !== undefined && input > threshold.lte) {
      return false;
    }
    return true;
  });
  if (matches.length === 0) {
    throw new ScorecardRunError(`${relativePath(benchmarkFile)}: no threshold matched ${signalId} input=${input}`);
  }
  return matches.reduce((best, candidate) => (candidate.score > best.score ? candidate : best), matches[0]);
}

function renderMarkdownReport(result: ScorecardOutput): string {
  const lines: string[] = [];
  lines.push(`# Scorecard Report — ${result.project}`);
  lines.push('');
  lines.push(`- Repo: ${result.repo_url}`);
  lines.push(`- Ran at: ${result.ran_at}`);
  lines.push(`- Strict: ${result.strict}`);
  lines.push(`- Overall (${result.overall_mode}): ${result.overall ?? 'N/A'}`);
  lines.push(`- Requested dimensions: ${result.requested_dimensions.join(', ')}`);
  lines.push('');
  lines.push('## Dimension Scores');
  lines.push('');
  lines.push('| Dimension | Weight | Score | Benchmark | Evidence paths |');
  lines.push('|---|---:|---:|---|---|');
  for (const [dimension, data] of Object.entries(result.dimensions)) {
    lines.push(
      `| ${dimension} | ${data.weight.toFixed(2)} | ${data.score.toFixed(1)} | ${data.benchmark_file} | ${data.evidence_paths.join('<br>')} |`,
    );
  }
  lines.push('');
  for (const [dimension, data] of Object.entries(result.dimensions)) {
    lines.push(`## ${dimension}`);
    lines.push('');
    for (const subitem of Object.values(data.subitems)) {
      lines.push(`### ${subitem.leaf_tag} — ${subitem.score.toFixed(1)}`);
      lines.push('');
      lines.push('| Signal | Input | Score | Evidence |');
      lines.push('|---|---:|---:|---|');
      for (const signal of subitem.signals) {
        lines.push(
          `| ${signal.signal_id} | ${signal.input ?? 'manual'} | ${signal.score.toFixed(1)} | ${signal.evidence_paths.join('<br>')} |`,
        );
      }
      lines.push('');
    }
  }
  if (result.skipped.length > 0) {
    lines.push('## Skipped');
    lines.push('');
    for (const skipped of result.skipped) {
      lines.push(`- ${skipped.subitem}: ${skipped.reason}`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trim()}\n`;
}

function extractFrontmatter(text: string, filePath: string): Record<string, unknown> {
  const match = normalizeNewlines(text).match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new ScorecardRunError(`${relativePath(filePath)}: missing front-matter block`);
  }
  const parsed = parseYamlLike(match[1]);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new ScorecardRunError(`${relativePath(filePath)}: front-matter must parse to an object`);
  }
  return parsed as Record<string, unknown>;
}

function removeFrontmatter(text: string): string {
  return normalizeNewlines(text).replace(/^---\n[\s\S]*?\n---\n?/, '');
}

function parseYamlLike(text: string): unknown {
  const lines = normalizeNewlines(text).split('\n');
  let index = 0;

  function parseBlock(indent: number): unknown {
    let mode: 'map' | 'list' | null = null;
    const map: Record<string, unknown> = {};
    const list: unknown[] = [];

    while (index < lines.length) {
      const raw = lines[index];
      if (raw.trim() === '' || raw.trim().startsWith('#')) {
        index += 1;
        continue;
      }
      const currentIndent = countIndent(raw);
      if (currentIndent < indent) {
        break;
      }
      if (currentIndent > indent) {
        throw new ScorecardRunError(`YAML parse error near line ${index + 1}: unexpected indent`);
      }
      const line = raw.slice(indent);
      if (line.startsWith('- ')) {
        if (mode === null) {
          mode = 'list';
        } else if (mode !== 'list') {
          throw new ScorecardRunError(`YAML parse error near line ${index + 1}: mixed list/map at same indentation`);
        }
        const payload = line.slice(2);
        if (payload.trim() === '') {
          index += 1;
          list.push(parseBlock(indent + 2));
          continue;
        }
        const keyMatch = payload.trim().startsWith('{')
          ? null
          : payload.match(/^([^:#][^:]*)\s*:\s*(.*)$/);
        if (keyMatch) {
          const item: Record<string, unknown> = {};
          const key = keyMatch[1].trim();
          const rest = keyMatch[2];
          item[key] = parseValueOrNested(rest, indent + 2);
          mergeObjectContinuation(item, indent + 2);
          list.push(item);
          continue;
        }
        list.push(parseScalar(payload.trim()));
        index += 1;
        continue;
      }

      if (mode === null) {
        mode = 'map';
      } else if (mode !== 'map') {
        throw new ScorecardRunError(`YAML parse error near line ${index + 1}: mixed list/map at same indentation`);
      }

      const match = line.match(/^([^:#][^:]*)\s*:\s*(.*)$/);
      if (!match) {
        throw new ScorecardRunError(`YAML parse error near line ${index + 1}: expected key: value`);
      }
      const key = match[1].trim();
      const rest = match[2];
      map[key] = parseValueOrNested(rest, indent + 2);
    }

    return mode === 'list' ? list : map;
  }

  function mergeObjectContinuation(target: Record<string, unknown>, indent: number): void {
    while (index < lines.length) {
      const raw = lines[index];
      if (raw.trim() === '' || raw.trim().startsWith('#')) {
        index += 1;
        continue;
      }
      const currentIndent = countIndent(raw);
      if (currentIndent < indent) {
        break;
      }
      if (currentIndent > indent) {
        throw new ScorecardRunError(`YAML parse error near line ${index + 1}: unexpected nested indent`);
      }
      const line = raw.slice(indent);
      const match = line.match(/^([^:#][^:]*)\s*:\s*(.*)$/);
      if (!match) {
        throw new ScorecardRunError(`YAML parse error near line ${index + 1}: expected key: value`);
      }
      const key = match[1].trim();
      const rest = match[2];
      target[key] = parseValueOrNested(rest, indent + 2);
    }
  }

  function parseValueOrNested(rest: string, childIndent: number): unknown {
    const cleaned = stripInlineComment(rest);
    if (cleaned === '|') {
      index += 1;
      const blockLines: string[] = [];
      while (index < lines.length) {
        const candidate = lines[index];
        if (candidate.trim() === '') {
          blockLines.push('');
          index += 1;
          continue;
        }
        const candidateIndent = countIndent(candidate);
        if (candidateIndent < childIndent) {
          break;
        }
        blockLines.push(candidate.slice(childIndent));
        index += 1;
      }
      return blockLines.join('\n').replace(/\n+$/, '');
    }
    if (cleaned === '') {
      index += 1;
      return parseBlock(childIndent);
    }
    index += 1;
    return parseScalar(cleaned.trim());
  }

  return parseBlock(0);
}

function parseScalar(value: string): unknown {
  const cleaned = stripInlineComment(value.trim());
  if (cleaned === '[]') {
    return [];
  }
  if (cleaned === '{}') {
    return {};
  }
  if (cleaned === 'true') {
    return true;
  }
  if (cleaned === 'false') {
    return false;
  }
  if (cleaned === 'null') {
    return null;
  }
  if (/^[-+]?\d+(\.\d+)?$/.test(cleaned)) {
    return Number(cleaned);
  }
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    return cleaned.slice(1, -1);
  }
  if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
    return parseInlineMap(cleaned.slice(1, -1));
  }
  return cleaned;
}

function stripInlineComment(value: string): string {
  if (value.includes('://')) {
    return value.trim();
  }
  return value.replace(/\s+#.*$/, '').trim();
}

function parseInlineMap(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const parts = splitTopLevel(text, ',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) {
      continue;
    }
    const separatorIndex = trimmed.indexOf(':');
    if (separatorIndex === -1) {
      throw new ScorecardRunError(`inline map parse failed: {${text}}`);
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || rawValue === '') {
      throw new ScorecardRunError(`inline map parse failed: {${text}}`);
    }
    result[key] = parseScalar(rawValue);
  }
  return result;
}

function splitTopLevel(text: string, delimiter: string): string[] {
  const items: string[] = [];
  let current = '';
  let depth = 0;
  let quote: 'single' | 'double' | null = null;
  for (const char of text) {
    if (quote) {
      current += char;
      if ((quote === 'single' && char === "'") || (quote === 'double' && char === '"')) {
        quote = null;
      }
      continue;
    }
    if (char === "'") {
      quote = 'single';
      current += char;
      continue;
    }
    if (char === '"') {
      quote = 'double';
      current += char;
      continue;
    }
    if (char === '{' || char === '[') {
      depth += 1;
      current += char;
      continue;
    }
    if (char === '}' || char === ']') {
      depth -= 1;
      current += char;
      continue;
    }
    if (char === delimiter && depth === 0) {
      items.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) {
    items.push(current.trim());
  }
  return items;
}

function extractAliasTarget(query?: string): string | null {
  if (!query) {
    return null;
  }
  const match = query.match(/^alias to ([a-z0-9_.:-]+)$/i);
  return match ? match[1] : null;
}

function isAliasSignal(raw: Record<string, unknown>): boolean {
  return extractAliasTarget(typeof raw.query === 'string' ? raw.query : undefined) !== null;
}

function normalizeWeights(input: Record<string, number>): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(input)) {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      throw new ScorecardRunError(`weights.${key} must be numeric`);
    }
    result[key] = numeric;
  }
  return result;
}

function getWeightedSignalKey(signalId: string): string {
  const parts = signalId.split('.');
  const tail = parts.slice(2).join('_');
  return tail.replace(/_(rubric|score|value)$/i, '');
}

function normalizeRequestedDimensions(dimensions: Domain[]): Domain[] {
  const unique = [...new Set(dimensions)];
  for (const dimension of unique) {
    if (!DOMAINS.includes(dimension)) {
      throw new ScorecardRunError(`config.dimensions contains unsupported value ${dimension}`);
    }
  }
  return unique;
}

function requireString(filePath: string, value: unknown, field: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ScorecardRunError(`${relativePath(filePath)}: ${field} is required`);
  }
}

function countIndent(line: string): number {
  let count = 0;
  while (count < line.length && line[count] === ' ') {
    count += 1;
  }
  return count;
}

function normalizeNewlines(value: string): string {
  return value.replace(/\r\n/g, '\n');
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function readText(filePath: string, label: string): string {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new ScorecardRunError(`${label} read failed: ${relativePath(filePath)}: ${(error as Error).message}`);
  }
}

function writeText(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function relativePath(filePath: string): string {
  if (filePath.startsWith(ROOT)) {
    return relative(ROOT, filePath) || '.';
  }
  return filePath.split(sep).join('/');
}

function logInfo(message: string): void {
  process.stderr.write(`INFO ${message}\n`);
}

function logWarn(message: string): void {
  process.stderr.write(`WARN ${message}\n`);
}

const isMain = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return import.meta.url === pathToFileURL(resolve(entry)).href;
})();

if (isMain) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`ERROR ${message}\n`);
    process.exitCode = 1;
  }
}

export {
  aggregateSubitemScore,
  extractFrontmatter,
  loadBenchmark,
  loadCaseStudy,
  loadConfig,
  loadLeafWhitelist,
  parseArgs,
  parseBenchmarkSubitems,
  parseYamlLike,
  renderMarkdownReport,
  runScorecard,
  ScorecardRunError,
};
