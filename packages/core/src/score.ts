import { BOOTSTRAP_RULES } from './bootstrap-rules.ts';
import type { DomainScore, Recommendation, RepoSnapshot, ScoreReport, SignalResult } from './types.ts';

const VERSION = '0.1.0-bootstrap';

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function priorityForDomainScore(normalizedFiveScale: number): 'high' | 'medium' {
  return normalizedFiveScale < 2.5 ? 'high' : 'medium';
}

export function scoreRepoSnapshot(snapshot: RepoSnapshot): ScoreReport {
  const domains: DomainScore[] = BOOTSTRAP_RULES.map((domainRule) => {
    const signals: SignalResult[] = domainRule.signals.map((signal) => {
      const passed = signal.evaluate(snapshot);
      return {
        id: signal.id,
        label: signal.label,
        description: signal.description,
        passed,
        score: passed ? 1 : 0,
        maxScore: 1,
        recommendation: signal.recommendation,
        evidence: signal.evidence(snapshot),
      };
    });

    const score = signals.reduce((sum, signal) => sum + signal.score, 0);
    const maxScore = signals.reduce((sum, signal) => sum + signal.maxScore, 0);
    const normalizedScore = maxScore === 0 ? 0 : (score / maxScore) * 100;
    const normalizedFiveScale = maxScore === 0 ? 0 : (score / maxScore) * 5;

    return {
      domain: domainRule.domain,
      label: domainRule.label,
      summary: domainRule.summary,
      score,
      maxScore,
      normalizedScore: round(normalizedScore),
      normalizedFiveScale: round(normalizedFiveScale),
      signals,
    };
  });

  const overallRaw = domains.reduce((sum, domain) => sum + domain.normalizedScore, 0) / domains.length;
  const overallFive = domains.reduce((sum, domain) => sum + domain.normalizedFiveScale, 0) / domains.length;

  const recommendations: Recommendation[] = domains
    .flatMap((domain) =>
      domain.signals
        .filter((signal) => !signal.passed)
        .map((signal) => ({
          domain: domain.domain,
          signalId: signal.id,
          priority: priorityForDomainScore(domain.normalizedFiveScale),
          text: signal.recommendation,
          rank: domain.normalizedFiveScale,
        })),
    )
    .sort((left, right) => left.rank - right.rank)
    .slice(0, 10)
    .map(({ rank: _rank, ...item }) => item);

  return {
    project: snapshot.repoFullName,
    repoUrl: snapshot.repoUrl,
    capturedAt: snapshot.capturedAt,
    version: VERSION,
    mode: 'bootstrap-v0',
    overall: {
      normalizedScore: round(overallRaw),
      normalizedFiveScale: round(overallFive),
    },
    domains,
    recommendations,
    snapshot: {
      stars: snapshot.stars,
      forks: snapshot.forks,
      openIssues: snapshot.openIssues,
      watchers: snapshot.watchers,
      language: snapshot.language,
      licenseSpdx: snapshot.licenseSpdx,
      pushedAt: snapshot.pushedAt,
      contributorsCount: snapshot.contributorsCount,
      releasesCount: snapshot.releasesCount,
    },
  };
}
