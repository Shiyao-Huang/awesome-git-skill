import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

type IndexedDocument = IndexedPlaybookEntry | IndexedPlaybookLeaf | IndexedCaseStudy;

type IndexedPlaybookEntry = {
  kind: 'playbook-entry';
  path: string;
  id: string;
  dimension: string;
  covers: string[];
  version: string;
  status: string;
  lastVerifiedAt: string;
  ownerRole: string;
  sources: unknown[];
};

type IndexedPlaybookLeaf = {
  kind: 'playbook-leaf';
  path: string;
  id: string;
  dimension: string;
  subitem: string;
  subitemTag: string;
  version: string;
  status: string;
  lastVerifiedAt: string;
};

type IndexedCaseStudy = {
  kind: 'case-study';
  path: string;
  id: string;
  project: string;
  repoUrl: string;
  starCount: number | string;
  starCountAt: string;
  starSource: string;
  forksCount: number | string;
  openIssuesCount: number | string;
  licenseSpdx: string;
  lastPushAt: string;
  category: string;
  dimensionsCovered: string[];
  status: string;
  lastVerifiedAt: string;
  sources: SourceRecord[];
};

type SourceRecord = {
  id: string;
  url: string;
  captured_at: string;
  type: string;
  note?: string;
};

type ValidationIssue = {
  file: string;
  line: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
};

type ValidationContext = {
  strict: boolean;
  leafTags: Set<string>;
};

type BuildIndexOptions = {
  root?: string;
  strict?: boolean;
};

type BuildIndexResult = {
  generatedAt: string;
  strict: boolean;
  scanRoot: string;
  canonicalRoot: string;
  whitelist: {
    topLevelDimensions: string[];
    leafCount: number;
  };
  entries: IndexedDocument[];
  skipped: Array<{ path: string; reason: string }>;
  warnings: ValidationIssue[];
};

type ParsedArgs = {
  root: string;
  strict: boolean;
};

type FrontmatterData = {
  data: Record<string, unknown>;
  lineMap: Map<string, number>;
};

const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TOOLS_DIR, '..');
const TOP_LEVEL_DIMENSIONS = ['facade', 'docs', 'community', 'quality', 'caselib', 'tooling'] as const;
const DEPRECATED_DIMENSIONS = ['release', 'growth', 'seo', 'case-library'] as const;
const PLAYBOOK_ENTRY_REQUIRED_FIELDS = ['id', 'dimension', 'version', 'status', 'last_verified_at', 'owner_role', 'sources'] as const;
const PLAYBOOK_LEAF_REQUIRED_FIELDS = ['id', 'dimension', 'subitem', 'version', 'status', 'last_verified_at'] as const;
const CASE_STUDY_REQUIRED_FIELDS = [
  'id',
  'project',
  'repo_url',
  'star_count',
  'star_count_at',
  'star_source',
  'forks_count',
  'open_issues_count',
  'license_spdx',
  'last_push_at',
  'category',
  'dimensions_covered',
  'status',
  'last_verified_at',
  'sources',
] as const;
const CASE_STUDY_CATEGORIES = [
  'dev-tool',
  'ai-runtime',
  'ai-app',
  'ai-sdk',
  'ai-ui',
  'ai-visual',
  'framework',
  'infra',
  'ide',
  'ui-kit',
  'ui-visual',
  'productivity',
] as const;
const CASE_STUDY_SOURCE_TYPES = ['github', 'hn', 'ph', 'x', 'reddit', 'blog', 'wayback', 'star-history', 'docs-site', 'video'] as const;
const PLAYBOOK_STATUSES = ['draft', 'ratified', 'deprecated', 'review', 'stable'] as const;
const CASE_STUDY_STATUSES = ['draft', 'review', 'stable'] as const;
const CASE_STUDY_STAR_SOURCES = ['gh-api', 'star-history', 'unverified'] as const;
const SUBITEM_CACHE = new Map<string, Set<string>>();

export async function buildIndex(options: BuildIndexOptions = {}): Promise<BuildIndexResult> {
  const scanRoot = path.resolve(options.root ?? REPO_ROOT);
  const strict = options.strict ?? true;
  const { leafTags } = await loadTaxonomyWhitelist(REPO_ROOT);
  const validationContext: ValidationContext = { strict, leafTags };

  const issues: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const skipped: Array<{ path: string; reason: string }> = [];
  const entries: IndexedDocument[] = [];

  const playbookFiles = await listMarkdownFiles(path.join(scanRoot, 'playbooks'));
  for (const filePath of playbookFiles) {
    const relativePath = toPosixPath(path.relative(scanRoot, filePath));
    const parsed = await readFrontmatter(filePath, relativePath, issues);
    if (!parsed) {
      skipped.push({ path: relativePath, reason: 'missing_frontmatter' });
      continue;
    }

    const isLeaf = Object.prototype.hasOwnProperty.call(parsed.data, 'subitem');
    const result = isLeaf
      ? validatePlaybookLeaf(relativePath, parsed, validationContext)
      : validatePlaybookEntry(relativePath, parsed, validationContext);

    issues.push(...result.errors);
    warnings.push(...result.warnings);
    if (result.entry) {
      entries.push(result.entry);
    }
  }

  const caseStudyFiles = await listMarkdownFiles(path.join(scanRoot, 'case-studies'));
  for (const filePath of caseStudyFiles) {
    const relativePath = toPosixPath(path.relative(scanRoot, filePath));
    const parsed = await readFrontmatter(filePath, relativePath, issues);
    if (!parsed) {
      skipped.push({ path: relativePath, reason: 'missing_frontmatter' });
      continue;
    }

    const result = validateCaseStudy(relativePath, parsed, validationContext);
    issues.push(...result.errors);
    warnings.push(...result.warnings);
    if (result.entry) {
      entries.push(result.entry);
    }
  }

  if (issues.length > 0) {
    const formatted = issues.sort(sortIssues).map(formatIssue).join('\n');
    throw new Error(formatted);
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));
  skipped.sort((a, b) => a.path.localeCompare(b.path));
  warnings.sort(sortIssues);

  return {
    generatedAt: new Date().toISOString(),
    strict,
    scanRoot,
    canonicalRoot: REPO_ROOT,
    whitelist: {
      topLevelDimensions: [...TOP_LEVEL_DIMENSIONS],
      leafCount: leafTags.size,
    },
    entries,
    skipped,
    warnings,
  };
}

function validatePlaybookEntry(
  relativePath: string,
  parsed: FrontmatterData,
  context: ValidationContext,
): { entry: IndexedPlaybookEntry | null; errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  ensureRequiredFields(relativePath, parsed.lineMap, parsed.data, PLAYBOOK_ENTRY_REQUIRED_FIELDS, errors);
  if (errors.length > 0) {
    return { entry: null, errors, warnings };
  }

  const id = requireString(relativePath, parsed, 'id', errors);
  const version = requireSemver(relativePath, parsed, 'version', errors);
  const status = requireEnum(relativePath, parsed, 'status', PLAYBOOK_STATUSES, errors);
  const lastVerifiedAt = requireIsoDate(relativePath, parsed, 'last_verified_at', false, errors);
  const ownerRole = requireString(relativePath, parsed, 'owner_role', errors);
  const sources = requireArray(relativePath, parsed, 'sources', errors);
  const dimension = validateTopLevelDimension(relativePath, parsed, 'dimension', context, errors, warnings);
  const covers = validateCovers(relativePath, parsed, context, errors, warnings);

  if ([id, version, status, lastVerifiedAt, ownerRole, sources, dimension, covers].some((value) => value === null)) {
    return { entry: null, errors, warnings };
  }

  return {
    entry: {
      kind: 'playbook-entry',
      path: relativePath,
      id: id!,
      dimension: dimension!,
      covers: covers!,
      version: version!,
      status: status!,
      lastVerifiedAt: lastVerifiedAt!,
      ownerRole: ownerRole!,
      sources: sources!,
    },
    errors,
    warnings,
  };
}

function validatePlaybookLeaf(
  relativePath: string,
  parsed: FrontmatterData,
  context: ValidationContext,
): { entry: IndexedPlaybookLeaf | null; errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  ensureRequiredFields(relativePath, parsed.lineMap, parsed.data, PLAYBOOK_LEAF_REQUIRED_FIELDS, errors);
  if (errors.length > 0) {
    return { entry: null, errors, warnings };
  }

  const id = requireString(relativePath, parsed, 'id', errors);
  const version = requireSemver(relativePath, parsed, 'version', errors);
  const status = requireEnum(relativePath, parsed, 'status', PLAYBOOK_STATUSES, errors);
  const lastVerifiedAt = requireIsoDate(relativePath, parsed, 'last_verified_at', false, errors);
  const dimension = validateTopLevelDimension(relativePath, parsed, 'dimension', context, errors, warnings);
  const subitem = validateSubitem(relativePath, parsed, dimension, errors);

  if ([id, version, status, lastVerifiedAt, dimension, subitem].some((value) => value === null)) {
    return { entry: null, errors, warnings };
  }

  return {
    entry: {
      kind: 'playbook-leaf',
      path: relativePath,
      id: id!,
      dimension: dimension!,
      subitem: subitem!,
      subitemTag: `${dimension!}:${subitem!}`,
      version: version!,
      status: status!,
      lastVerifiedAt: lastVerifiedAt!,
    },
    errors,
    warnings,
  };
}

function validateCaseStudy(
  relativePath: string,
  parsed: FrontmatterData,
  context: ValidationContext,
): { entry: IndexedCaseStudy | null; errors: ValidationIssue[]; warnings: ValidationIssue[] } {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  ensureRequiredFields(relativePath, parsed.lineMap, parsed.data, CASE_STUDY_REQUIRED_FIELDS, errors);
  if (errors.length > 0) {
    return { entry: null, errors, warnings };
  }

  const id = requireString(relativePath, parsed, 'id', errors);
  if (id && !id.startsWith('case-')) {
    errors.push(issue(relativePath, parsed.lineMap, 'id', `must start with "case-" (received "${id}")`));
  }

  const project = requireString(relativePath, parsed, 'project', errors);
  const repoUrl = requireUrl(relativePath, parsed, 'repo_url', errors);
  const starCount = requireNumberOrUnverified(relativePath, parsed, 'star_count', false, errors);
  const starCountAt = requireIsoDate(relativePath, parsed, 'star_count_at', false, errors);
  const starSource = requireEnum(relativePath, parsed, 'star_source', CASE_STUDY_STAR_SOURCES, errors);
  const forksCount = requireNumberOrUnverified(relativePath, parsed, 'forks_count', true, errors);
  const openIssuesCount = requireNumberOrUnverified(relativePath, parsed, 'open_issues_count', true, errors);
  const licenseSpdx = requireString(relativePath, parsed, 'license_spdx', errors);
  const lastPushAt = requireIsoDate(relativePath, parsed, 'last_push_at', true, errors);
  const category = requireEnum(relativePath, parsed, 'category', CASE_STUDY_CATEGORIES, errors);
  const dimensionsCovered = validateDimensionsCovered(relativePath, parsed, context, errors, warnings);
  const status = requireEnum(relativePath, parsed, 'status', CASE_STUDY_STATUSES, errors);
  const lastVerifiedAt = requireIsoDate(relativePath, parsed, 'last_verified_at', false, errors);
  const sources = validateCaseStudySources(relativePath, parsed, errors);

  if (
    [
      id,
      project,
      repoUrl,
      starCount,
      starCountAt,
      starSource,
      forksCount,
      openIssuesCount,
      licenseSpdx,
      lastPushAt,
      category,
      dimensionsCovered,
      status,
      lastVerifiedAt,
      sources,
    ].some((value) => value === null)
  ) {
    return { entry: null, errors, warnings };
  }

  return {
    entry: {
      kind: 'case-study',
      path: relativePath,
      id: id!,
      project: project!,
      repoUrl: repoUrl!,
      starCount: starCount!,
      starCountAt: starCountAt!,
      starSource: starSource!,
      forksCount: forksCount!,
      openIssuesCount: openIssuesCount!,
      licenseSpdx: licenseSpdx!,
      lastPushAt: lastPushAt!,
      category: category!,
      dimensionsCovered: dimensionsCovered!,
      status: status!,
      lastVerifiedAt: lastVerifiedAt!,
      sources: sources!,
    },
    errors,
    warnings,
  };
}

function ensureRequiredFields(
  relativePath: string,
  lineMap: Map<string, number>,
  data: Record<string, unknown>,
  requiredFields: readonly string[],
  errors: ValidationIssue[],
): void {
  for (const field of requiredFields) {
    if (!Object.prototype.hasOwnProperty.call(data, field)) {
      errors.push(issue(relativePath, lineMap, field, `missing required field "${field}"`));
    }
  }
}

function validateTopLevelDimension(
  relativePath: string,
  parsed: FrontmatterData,
  field: string,
  context: ValidationContext,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
): string | null {
  const rawValue = parsed.data[field];
  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
    errors.push(issue(relativePath, parsed.lineMap, field, 'must be a non-empty string'));
    return null;
  }

  const value = rawValue.trim();
  if (TOP_LEVEL_DIMENSIONS.includes(value as (typeof TOP_LEVEL_DIMENSIONS)[number])) {
    return value;
  }

  if (DEPRECATED_DIMENSIONS.includes(value as (typeof DEPRECATED_DIMENSIONS)[number]) && !context.strict) {
    warnings.push(warn(relativePath, parsed.lineMap, field, `deprecated 8-dim value "${value}" accepted only because --strict=false`));
    return value;
  }

  errors.push(issue(relativePath, parsed.lineMap, field, `invalid top-level dimension "${value}"; see plans/03-canonical-mapping.md`));
  return null;
}

function validateSubitem(
  relativePath: string,
  parsed: FrontmatterData,
  dimension: string | null,
  errors: ValidationIssue[],
): string | null {
  const rawValue = parsed.data.subitem;
  if (dimension === null) {
    return null;
  }
  if (typeof rawValue !== 'string' || rawValue.trim().length === 0) {
    errors.push(issue(relativePath, parsed.lineMap, 'subitem', 'must be a non-empty string'));
    return null;
  }
  const value = rawValue.trim();
  const normalized = value.includes(':') ? value.split(':', 2)[1] : value;
  if (!normalized) {
    errors.push(issue(relativePath, parsed.lineMap, 'subitem', `invalid subitem "${value}"`));
    return null;
  }
  const allowedSubitems = SUBITEM_CACHE.get(dimension);
  if (!allowedSubitems?.has(normalized)) {
    errors.push(issue(relativePath, parsed.lineMap, 'subitem', `unknown subitem "${value}" for dimension "${dimension}"`));
    return null;
  }
  return normalized;
}

function validateCovers(
  relativePath: string,
  parsed: FrontmatterData,
  context: ValidationContext,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
): string[] | null {
  const rawValue = parsed.data.covers;
  if (rawValue === undefined) {
    return [];
  }
  if (!Array.isArray(rawValue)) {
    errors.push(issue(relativePath, parsed.lineMap, 'covers', 'must be an array of leaf tags'));
    return null;
  }

  const covers: string[] = [];
  for (const value of rawValue) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push(issue(relativePath, parsed.lineMap, 'covers', 'covers[] entries must be non-empty strings'));
      continue;
    }
    const normalized = value.trim();
    if (context.leafTags.has(normalized)) {
      covers.push(normalized);
      continue;
    }
    if (!context.strict && DEPRECATED_DIMENSIONS.includes(normalized as (typeof DEPRECATED_DIMENSIONS)[number])) {
      warnings.push(warn(relativePath, parsed.lineMap, 'covers', `deprecated 8-dim value "${normalized}" accepted only because --strict=false`));
      covers.push(normalized);
      continue;
    }
    errors.push(issue(relativePath, parsed.lineMap, 'covers', `unknown leaf tag "${normalized}"`));
  }

  return errors.some((entry) => entry.file === relativePath && entry.field === 'covers') ? null : covers;
}

function validateDimensionsCovered(
  relativePath: string,
  parsed: FrontmatterData,
  context: ValidationContext,
  errors: ValidationIssue[],
  warnings: ValidationIssue[],
): string[] | null {
  const rawValue = parsed.data.dimensions_covered;
  if (!Array.isArray(rawValue)) {
    errors.push(issue(relativePath, parsed.lineMap, 'dimensions_covered', 'must be an array of 6-domain top-level values'));
    return null;
  }
  if (rawValue.length < 3) {
    errors.push(issue(relativePath, parsed.lineMap, 'dimensions_covered', 'must contain at least 3 top-level dimensions'));
  }

  const values: string[] = [];
  for (const value of rawValue) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      errors.push(issue(relativePath, parsed.lineMap, 'dimensions_covered', 'entries must be non-empty strings'));
      continue;
    }
    const normalized = value.trim();
    if (TOP_LEVEL_DIMENSIONS.includes(normalized as (typeof TOP_LEVEL_DIMENSIONS)[number])) {
      values.push(normalized);
      continue;
    }
    if (!context.strict && DEPRECATED_DIMENSIONS.includes(normalized as (typeof DEPRECATED_DIMENSIONS)[number])) {
      warnings.push(warn(relativePath, parsed.lineMap, 'dimensions_covered', `deprecated 8-dim value "${normalized}" accepted only because --strict=false`));
      values.push(normalized);
      continue;
    }
    errors.push(issue(relativePath, parsed.lineMap, 'dimensions_covered', `invalid case-study dimension "${normalized}"; only the 6 top-level domains are allowed`));
  }

  return errors.some((entry) => entry.file === relativePath && entry.field === 'dimensions_covered') ? null : values;
}

function validateCaseStudySources(
  relativePath: string,
  parsed: FrontmatterData,
  errors: ValidationIssue[],
): SourceRecord[] | null {
  const rawValue = parsed.data.sources;
  if (!Array.isArray(rawValue)) {
    errors.push(issue(relativePath, parsed.lineMap, 'sources', 'must be an array with at least 3 source records'));
    return null;
  }
  if (rawValue.length < 3) {
    errors.push(issue(relativePath, parsed.lineMap, 'sources', 'must contain at least 3 source records'));
  }

  const sources: SourceRecord[] = [];
  for (const [index, source] of rawValue.entries()) {
    if (!isRecord(source)) {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} must be an object`));
      continue;
    }
    const id = source.id;
    const url = source.url;
    const capturedAt = source.captured_at;
    const type = source.type;
    const note = source.note;

    if (typeof id !== 'string' || id.trim().length === 0) {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} missing string "id"`));
      continue;
    }
    if (typeof url !== 'string' || !isUrl(url)) {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} has invalid "url"`));
      continue;
    }
    if (typeof capturedAt !== 'string' || !isIsoDate(capturedAt)) {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} missing valid "captured_at"`));
      continue;
    }
    if (typeof type !== 'string' || !CASE_STUDY_SOURCE_TYPES.includes(type as (typeof CASE_STUDY_SOURCE_TYPES)[number])) {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} has invalid "type"`));
      continue;
    }
    if (note !== undefined && typeof note !== 'string') {
      errors.push(issue(relativePath, parsed.lineMap, 'sources', `source entry #${index + 1} has non-string "note"`));
      continue;
    }

    sources.push({ id: id.trim(), url, captured_at: capturedAt, type, note: typeof note === 'string' ? note : undefined });
  }

  return errors.some((entry) => entry.file === relativePath && entry.field === 'sources') ? null : sources;
}

function requireString(relativePath: string, parsed: FrontmatterData, field: string, errors: ValidationIssue[]): string | null {
  const value = parsed.data[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(issue(relativePath, parsed.lineMap, field, 'must be a non-empty string'));
    return null;
  }
  return value.trim();
}

function requireSemver(relativePath: string, parsed: FrontmatterData, field: string, errors: ValidationIssue[]): string | null {
  const value = requireString(relativePath, parsed, field, errors);
  if (value === null) {
    return null;
  }
  if (!/^\d+\.\d+\.\d+$/.test(value)) {
    errors.push(issue(relativePath, parsed.lineMap, field, `must be SemVer (received "${value}")`));
    return null;
  }
  return value;
}

function requireUrl(relativePath: string, parsed: FrontmatterData, field: string, errors: ValidationIssue[]): string | null {
  const value = requireString(relativePath, parsed, field, errors);
  if (value === null) {
    return null;
  }
  if (!isUrl(value)) {
    errors.push(issue(relativePath, parsed.lineMap, field, `must be a valid URL (received "${value}")`));
    return null;
  }
  return value;
}

function requireArray(relativePath: string, parsed: FrontmatterData, field: string, errors: ValidationIssue[]): unknown[] | null {
  const value = parsed.data[field];
  if (!Array.isArray(value)) {
    errors.push(issue(relativePath, parsed.lineMap, field, 'must be an array'));
    return null;
  }
  return value;
}

function requireEnum<T extends readonly string[]>(
  relativePath: string,
  parsed: FrontmatterData,
  field: string,
  allowed: T,
  errors: ValidationIssue[],
): T[number] | null {
  const value = requireString(relativePath, parsed, field, errors);
  if (value === null) {
    return null;
  }
  if (!allowed.includes(value as T[number])) {
    errors.push(issue(relativePath, parsed.lineMap, field, `must be one of: ${allowed.join(', ')} (received "${value}")`));
    return null;
  }
  return value as T[number];
}

function requireIsoDate(
  relativePath: string,
  parsed: FrontmatterData,
  field: string,
  allowUnverified: boolean,
  errors: ValidationIssue[],
): string | null {
  const value = parsed.data[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(issue(relativePath, parsed.lineMap, field, 'must be a non-empty ISO date string'));
    return null;
  }
  const normalized = value.trim();
  if (allowUnverified && isUnverified(normalized)) {
    return normalized;
  }
  if (!isIsoDate(normalized)) {
    errors.push(issue(relativePath, parsed.lineMap, field, `must be an ISO date string (received "${normalized}")`));
    return null;
  }
  return normalized;
}

function requireNumberOrUnverified(
  relativePath: string,
  parsed: FrontmatterData,
  field: string,
  allowUnverified: boolean,
  errors: ValidationIssue[],
): number | string | null {
  const value = parsed.data[field];
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return value;
  }
  if (allowUnverified && typeof value === 'string' && isUnverified(value.trim())) {
    return value.trim();
  }
  errors.push(issue(relativePath, parsed.lineMap, field, `must be a non-negative integer${allowUnverified ? ' or UNVERIFIED' : ''}`));
  return null;
}

async function loadTaxonomyWhitelist(repoRoot: string): Promise<{ leafTags: Set<string> }> {
  const taxonomyPath = path.join(repoRoot, 'plans', '01-taxonomy.md');
  const content = await readFile(taxonomyPath, 'utf8');
  const matches = [...content.matchAll(/\[([a-z]+:[a-z0-9-]+)\]/g)];
  const leafTags = new Set(matches.map((match) => match[1]));
  if (leafTags.size === 0) {
    throw new Error(`Failed to load leaf whitelist from ${toPosixPath(path.relative(repoRoot, taxonomyPath))}`);
  }
  SUBITEM_CACHE.clear();
  for (const tag of leafTags) {
    const [dimension, subitem] = tag.split(':', 2);
    if (!SUBITEM_CACHE.has(dimension)) {
      SUBITEM_CACHE.set(dimension, new Set());
    }
    SUBITEM_CACHE.get(dimension)?.add(subitem);
  }
  return { leafTags };
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => path.join(directory, entry.name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    if (isRecord(error) && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function readFrontmatter(filePath: string, relativePath: string, issues: ValidationIssue[]): Promise<FrontmatterData | null> {
  const content = await readFile(filePath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return null;
  }

  const rawFrontmatter = match[1] ?? '';
  const lineMap = extractLineMap(rawFrontmatter);
  try {
    const parsed = parseYaml(rawFrontmatter);
    if (!isRecord(parsed)) {
      issues.push(issue(relativePath, lineMap, 'frontmatter', 'must parse to a YAML object'));
      return null;
    }
    return { data: parsed, lineMap };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const line = extractYamlErrorLine(error) ?? 1;
    issues.push({ file: relativePath, line, field: 'frontmatter', message, severity: 'error' });
    return null;
  }
}

function extractLineMap(rawFrontmatter: string): Map<string, number> {
  const lineMap = new Map<string, number>();
  const lines = rawFrontmatter.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:/);
    if (match && !lineMap.has(match[1])) {
      lineMap.set(match[1], index + 2);
    }
  }
  return lineMap;
}

function extractYamlErrorLine(error: unknown): number | null {
  if (!isRecord(error)) {
    return null;
  }
  const linePos = error.linePos;
  if (Array.isArray(linePos) && linePos.length > 0 && isRecord(linePos[0])) {
    const line = linePos[0].line;
    if (typeof line === 'number') {
      return line + 1;
    }
  }
  return null;
}

function issue(relativePath: string, lineMap: Map<string, number>, field: string, message: string): ValidationIssue {
  return {
    file: relativePath,
    line: lineMap.get(field) ?? 1,
    field,
    message,
    severity: 'error',
  };
}

function warn(relativePath: string, lineMap: Map<string, number>, field: string, message: string): ValidationIssue {
  return {
    file: relativePath,
    line: lineMap.get(field) ?? 1,
    field,
    message,
    severity: 'warning',
  };
}

function formatIssue(entry: ValidationIssue): string {
  return `${entry.file}:${entry.line} ${entry.field} ${entry.message}`;
}

function sortIssues(a: ValidationIssue, b: ValidationIssue): number {
  return `${a.file}:${a.line}:${a.field}`.localeCompare(`${b.file}:${b.line}:${b.field}`);
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:[T ][0-9:.+-Z]+)?$/.test(value);
}

function isUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isUnverified(value: string): boolean {
  return value === 'UNVERIFIED' || value.startsWith('UNVERIFIED:');
}

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    root: REPO_ROOT,
    strict: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root') {
      const next = argv[index + 1];
      if (!next) {
        throw new Error('--root requires a value');
      }
      parsed.root = path.resolve(process.cwd(), next);
      index += 1;
      continue;
    }
    if (arg.startsWith('--root=')) {
      parsed.root = path.resolve(process.cwd(), arg.slice('--root='.length));
      continue;
    }
    if (arg === '--strict=false') {
      parsed.strict = false;
      continue;
    }
    if (arg === '--strict=true' || arg === '--strict') {
      parsed.strict = true;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  try {
    const result = await buildIndex({ root: args.root, strict: args.strict });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.length > 0) {
      process.stderr.write(`${message}\n`);
    }
    process.exitCode = 1;
  }
}

if (import.meta.main) {
  await main();
}
