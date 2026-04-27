---
id: bench-quality
dimension: quality
version: 0.1.0
status: draft
weight: 0.20
last_verified_at: 2026-04-27
---

# Code & Release Quality Scorecard

> 上游：[`../plans/02-scorecard.md`](../plans/02-scorecard.md) · 标签白名单：[`../plans/01-taxonomy.md`](../plans/01-taxonomy.md) §3
> 6 个子项；与 [community:release] / [tooling:release-bot] 协同（详见 `playbooks/release.md` 的 `covers[]`）。
> 与 OpenSSF Scorecard / OSV 复用：security 子项的 collector 直接消费 OpenSSF JSON，但 thresholds 由本文件定义，不接受外部 score 直接覆盖（避免双源漂移）。

## perf-baseline  `[quality:perf-baseline]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: quality.perf_baseline.has_baseline_doc
    source: github_repo
    query: docs/perf*.md or benchmarks/ dir documents canonical perf scenarios + thresholds
    collector: tools/scorecard-run/collectors/perf_baseline_doc.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: quality.perf_baseline.regression_gate_in_ci
    source: github_repo
    query: CI workflow contains perf job that fails on regression > threshold
    collector: tools/scorecard-run/collectors/ci_perf_gate.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: quality.perf_baseline.public_dashboard
    source: url_fetch
    query: public perf trend dashboard (continuousbenchmark / codspeed / hyperfine 公开页) linked from README
    collector: tools/scorecard-run/collectors/perf_dashboard.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
```

## ci-cd  `[quality:ci-cd]`

```yaml
subitem_aggregation: weighted
weights:
  matrix_breadth: 0.3
  green_rate: 0.4
  pipeline_p50_minutes: 0.3
signals:
  - signal_id: quality.ci_cd.matrix_breadth
    source: github_repo
    query: GitHub Actions workflow os × runtime version 矩阵基数（去重）
    collector: tools/scorecard-run/collectors/ci_matrix.ts
    thresholds:
      - { gte: 9, score: 5 }
      - { gte: 4, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.ci_cd.green_rate_30d
    source: github_repo
    query: 最近 30d default branch CI run 成功率
    collector: tools/scorecard-run/collectors/ci_green_rate.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.85, score: 3 }
      - { gte: 0.60, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.ci_cd.pipeline_p50_minutes
    source: github_repo
    query: 最近 30d default branch CI run wallclock p50 (分钟)
    collector: tools/scorecard-run/collectors/ci_runtime.ts
    thresholds:
      - { lte: 10, score: 5 }
      - { lte: 25, score: 3 }
      - { lte: 60, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.ci_cd.publish_automation
    source: github_repo
    query: tag → registry (npm/PyPI/crates/Docker) 自动发布 workflow 存在
    collector: tools/scorecard-run/collectors/release_workflow.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
```

## semver  `[quality:semver]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: quality.semver.tag_pattern_compliance
    source: github_repo
    query: 最近 30 个 tag 中符合 vMAJOR.MINOR.PATCH（含 prerelease 后缀）的比例
    collector: tools/scorecard-run/collectors/semver_tags.ts
    thresholds:
      - { gte: 0.95, score: 5 }
      - { gte: 0.80, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.semver.changelog_automation
    source: github_repo
    query: changesets / release-please / semantic-release / 自定义 conventional-commits→changelog workflow 存在
    collector: tools/scorecard-run/collectors/changelog_automation.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: quality.semver.breaking_change_marked
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 抽样 5 个 major release notes 全部缺 BREAKING CHANGE 段
      3 — 多数有 BREAKING CHANGE 段但缺 migration 指引
      5 — 每个 major 都有 BREAKING + migration + codemod / 替换示例
```

## security  `[quality:security]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: quality.security.has_security_md
    source: github_repo
    query: SECURITY.md exists with disclosure email + supported versions table
    collector: tools/scorecard-run/collectors/security_md.ts
    thresholds:
      - { gte: 2, score: 5 }
      - { gte: 1, score: 3 }
      - { gte: 0, score: 0 }
  - signal_id: quality.security.openssf_scorecard
    source: github_repo
    query: OpenSSF Scorecard JSON aggregate score (0-10)
    collector: tools/scorecard-run/collectors/openssf.ts
    thresholds:
      - { gte: 8, score: 5 }
      - { gte: 6, score: 3 }
      - { gte: 4, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.security.cve_response_days_p50
    source: github_repo
    query: 最近 12mo GHSA / CVE issue 从 disclose→fix-released wallclock p50 (天)；不足 1 条样本则按 manual_rubric 评估
    collector: tools/scorecard-run/collectors/cve_response.ts
    thresholds:
      - { lte: 7, score: 5 }
      - { lte: 30, score: 3 }
      - { lte: 90, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.security.sbom_published
    source: github_repo
    query: release artifact 含 SBOM (SPDX / CycloneDX) 或 GitHub auto-SBOM 启用
    collector: tools/scorecard-run/collectors/sbom_present.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
```

> CVE 样本不足时 collector 必须返回 `insufficient_data` 状态而非 0 分；scorecard-run 在 manual_rubric fallback 不可用时退出码非 0（hard-fail），禁止把"无 CVE"误判为满分。

## test-coverage  `[quality:test-coverage]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: quality.test_coverage.line_pct
    source: github_repo
    query: codecov / coveralls / lcov.info 主分支最新 line coverage %
    collector: tools/scorecard-run/collectors/coverage_pct.ts
    thresholds:
      - { gte: 0.85, score: 5 }
      - { gte: 0.70, score: 3 }
      - { gte: 0.50, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.test_coverage.tier_breadth
    source: github_repo
    query: 测试目录中 unit / integration / e2e 三层至少出现的层数
    collector: tools/scorecard-run/collectors/test_tiers.ts
    thresholds:
      - { gte: 3, score: 5 }
      - { gte: 2, score: 3 }
      - { gte: 1, score: 1 }
      - { gte: 0, score: 0 }
  - signal_id: quality.test_coverage.flaky_rate_30d
    source: github_repo
    query: 最近 30d default branch test rerun-to-success / total run 比例
    collector: tools/scorecard-run/collectors/flaky_rate.ts
    thresholds:
      - { lte: 0.01, score: 5 }
      - { lte: 0.05, score: 3 }
      - { lte: 0.15, score: 1 }
      - { gte: 0, score: 0 }
```

## dx  `[quality:dx]`

```yaml
subitem_aggregation: mean
signals:
  - signal_id: quality.dx.contributor_setup_minutes
    source: manual_review
    collector: manual
    manual_rubric: |
      0 — 无 CONTRIBUTING / 本地启动文档
      1 — 有文档但需 ≥30min 解决依赖 / 缺步骤
      3 — 10-20min 内 first build pass，文档与现实一致
      5 — ≤10min（含一键脚本 devcontainer / nix / make bootstrap），首次 PR 路径有清单
  - signal_id: quality.dx.devcontainer_or_nix
    source: github_repo
    query: .devcontainer/ or flake.nix or shell.nix or docker-compose.dev.yml exists
    collector: tools/scorecard-run/collectors/dev_env.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
  - signal_id: quality.dx.codeowners_present
    source: github_repo
    query: CODEOWNERS file exists with non-empty rules
    collector: tools/scorecard-run/collectors/codeowners.ts
    thresholds:
      - { gte: 1, score: 5 }
      - { gte: 0, score: 0 }
```

## skip 规则
- 纯文档 / Awesome 类项目可显式 `skip: quality.test_coverage`、`skip: quality.perf_baseline`，并提供 `reason: docs-only repo`；其余仍需打分。
- 单语言、单 OS 项目可显式 `skip: quality.ci_cd.matrix_breadth` 子信号，但 `green_rate` / `pipeline_p50_minutes` 不可 skip。

## Hard-fail 边界（与 `_schema.md` §5 对齐）
- `quality.security.cve_response_days_p50` collector 返回 `insufficient_data` 时，必须显式 fallback 到 `quality.security.openssf_scorecard`（不是兜底 0 分），否则退出码非 0
- OpenSSF Scorecard JSON 拉取失败 → 退出码非 0，不沿用缓存
- `weight` 与 02-scorecard §2.4 不一致 → fm-indexer hard-fail
