#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';

import { collectRepoSnapshot, parseRepoTarget } from '../../core/src/github.ts';
import { scoreRepoSnapshot } from '../../core/src/score.ts';
import { renderMarkdownReport, renderTerminalReport } from './format.ts';

type CliOptions = {
  repo: string;
  jsonOut?: string;
  markdownOut?: string;
  format: 'terminal' | 'json' | 'markdown';
};

class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CliError';
  }
}

function parseArgs(argv: string[]): CliOptions {
  let repo: string | undefined;
  let jsonOut: string | undefined;
  let markdownOut: string | undefined;
  let format: CliOptions['format'] = 'terminal';

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--repo') {
      repo = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--json-out') {
      jsonOut = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--markdown-out') {
      markdownOut = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === '--format') {
      const value = argv[index + 1];
      if (value !== 'terminal' && value !== 'json' && value !== 'markdown') {
        throw new CliError(`invalid --format value: ${value}`);
      }
      format = value;
      index += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(
        [
          'Usage: node --experimental-strip-types packages/cli/src/index.ts --repo <owner/repo> [--format terminal|json|markdown] [--json-out <path>] [--markdown-out <path>]',
          '',
          'Bootstrap OSS scorecard: fetches a GitHub repo snapshot, computes 6-domain heuristic scores, and prints actionable output.',
          'Optional env: GITHUB_TOKEN or GH_TOKEN for higher API limits.',
        ].join('\n') + '\n',
      );
      process.exit(0);
    }
    throw new CliError(`unknown argument: ${arg}`);
  }

  if (!repo) {
    throw new CliError('--repo is required');
  }

  return { repo, jsonOut, markdownOut, format };
}

function writeText(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, 'utf8');
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const target = parseRepoTarget(options.repo);
  const snapshot = await collectRepoSnapshot(target);
  const report = scoreRepoSnapshot(snapshot);
  const jsonText = JSON.stringify(report, null, 2);
  const markdownText = renderMarkdownReport(report);

  if (options.jsonOut) {
    writeText(resolve(process.cwd(), options.jsonOut), jsonText);
  }

  if (options.markdownOut) {
    writeText(resolve(process.cwd(), options.markdownOut), markdownText);
  }

  if (options.format === 'json') {
    process.stdout.write(`${jsonText}\n`);
    return;
  }

  if (options.format === 'markdown') {
    process.stdout.write(markdownText);
    return;
  }

  process.stdout.write(renderTerminalReport(report));
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`oss-scorecard bootstrap failed: ${message}\n`);
  process.exitCode = 1;
});
