import type { DomainScore, ScoreReport } from '../../core/src/types.ts';

function bar(value: number): string {
  const filled = Math.max(0, Math.min(10, Math.round((value / 5) * 10)));
  return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`;
}

function formatDomain(domain: DomainScore): string {
  const label = `${domain.domain}:`.padEnd(12, ' ');
  const score = `${domain.normalizedFiveScale.toFixed(1)}/5`.padEnd(8, ' ');
  return `${label}${score}${bar(domain.normalizedFiveScale)}`;
}

export function renderTerminalReport(report: ScoreReport): string {
  const lines = [
    `${report.project}  (${report.repoUrl})`,
    `captured_at: ${report.capturedAt}`,
    `ref: ${report.targetRef}`,
    `mode: ${report.mode}  version: ${report.version}`,
    '',
    ...report.domains.map(formatDomain),
    `${'TOTAL:'.padEnd(12, ' ')}${report.overall.normalizedFiveScale.toFixed(1)}/5     ${bar(report.overall.normalizedFiveScale)}`,
    '',
    'Snapshot:',
    `- stars=${report.snapshot.stars}, forks=${report.snapshot.forks}, contributors=${report.snapshot.contributorsCount}, releases=${report.snapshot.releasesCount}`,
    `- language=${report.snapshot.language ?? 'UNVERIFIED'}, license=${report.snapshot.licenseSpdx ?? 'UNVERIFIED'}, last_push_at=${report.snapshot.pushedAt}`,
    '',
    'Top recommendations:',
    ...(report.recommendations.length === 0
      ? ['- None. Bootstrap scan did not find priority gaps.']
      : report.recommendations.slice(0, 5).map((item) => `- [${item.priority}] ${item.domain}: ${item.text}`)),
  ];

  return `${lines.join('\n')}\n`;
}

export function renderMarkdownReport(report: ScoreReport): string {
  const rows = report.domains
    .map(
      (domain) =>
        `| ${domain.domain} | ${domain.normalizedFiveScale.toFixed(1)}/5 | ${domain.normalizedScore.toFixed(1)} | ${domain.signals.filter((signal) => !signal.passed).length} |`,
    )
    .join('\n');

  const recommendations =
    report.recommendations.length === 0
      ? '- None'
      : report.recommendations.slice(0, 10).map((item) => `- **${item.domain}** (${item.priority}): ${item.text}`).join('\n');

  return [
    `# OSS Scorecard — ${report.project}`,
    '',
    `- Repo: ${report.repoUrl}`,
    `- Captured at: ${report.capturedAt}`,
    `- Ref: ${report.targetRef}`,
    `- Mode: ${report.mode}`,
    `- Overall: ${report.overall.normalizedFiveScale.toFixed(1)}/5 (${report.overall.normalizedScore.toFixed(1)}/100)`,
    '',
    '## Domain scores',
    '',
    '| Domain | Score | Percent | Failed signals |',
    '|---|---:|---:|---:|',
    rows,
    '',
    '## Top recommendations',
    '',
    recommendations,
    '',
  ].join('\n');
}
