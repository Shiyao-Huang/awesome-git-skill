---
id: quality-playbook-001
dimension: quality
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# quality playbook

## 1. 维度定义
`quality` 维度衡量项目是否把“敢在生产使用、敢在仓库协作、敢持续升级”变成可复核的工程事实：测试、CI、性能、安全、发布纪律与本地 DX 都必须可观测、可门禁、可回归。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 没有可持续运行的 CI，或默认分支长期 red；测试、发布、安全、性能完全靠维护者个人记忆，外部贡献者无法判断项目是否可安全使用。 |
| 1 | 有零散 CI 或单一平台 smoke check，但没有明确 required checks、没有覆盖率或性能基线、没有安全响应路径；PR 合并后仍常出现“合了再修”。 |
| 2 | 具备基础 lint/typecheck/test 工作流，默认分支通常为绿，且能手动发版，但覆盖率、SemVer、依赖扫描、回归告警和本地 preflight 仍未形成统一契约。 |
| 3 | CI 已覆盖主要平台或运行时，并至少对测试覆盖、发布 dry-run、安全扫描、性能基线中的两项形成自动化；但阈值仍不稳定，失败信息不够聚焦，维护者还需要大量人工补位。 |
| 4 | CI 矩阵、覆盖率阈值、性能回归阈值、SemVer/changelog、SBOM/依赖扫描、关键路径 smoke/e2e 与本地 preflight 都已成文并可重复执行；默认分支质量状态对外可见，回归能在 PR 阶段被阻断。 |
| 5 | 项目形成“质量即发布门禁”的系统：CI 长期全绿、覆盖率与关键路径回归阈值公开、性能/安全/发布纪律都有自动化证据，失败日志低噪音可定位，外部贡献者几乎不需要口头说明就能在本地复现同一套质量门槛。 |

## 3. 头部项目实践占位
- [ ] vscode: 待 case-study 填充
- [ ] n8n: 待 case-study 填充
- [ ] next.js: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] excalidraw: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 把 CI 必跑项写成受版本控制的 workflow 与矩阵配置，明确 required checks，而不是靠仓库管理员口头约定。
  *为什么：质量门槛只有写进仓库并被平台执行，才不会在维护者轮换时蒸发。*
- [ ] 为默认分支建立最小必过链路：lint、typecheck、unit、关键路径 smoke，各自失败即阻断合并。
  *为什么：把“先合后修”变成系统不允许，比事后复盘更便宜。*
- [ ] 为覆盖率设置显式阈值与 PR diff 评论，至少对关键模块或关键路径提供自动摘要。
  *为什么：覆盖率只有与阈值和变更上下文绑定，才不会沦为漂亮但无用的百分比。*
- [ ] 把性能基线做成可重跑命令与阈值配置，并在 PR 或 nightly 中比较回归，而不是凭感觉说“这次应该没变慢”。
  *为什么：性能回归最容易在功能正确时悄悄滑入，必须用基线而不是直觉发现。*
- [ ] 为发布流程增加 SemVer 规则、changelog 生成与 release dry-run，要求破坏性变更在合并前就暴露。
  *为什么：质量不只等于测试通过，还包括用户能否安全升级。*
- [ ] 生成并归档 SBOM，同时在依赖升级、发布或 nightly 时跑漏洞扫描，明确高危项不能静默跳过。
  *为什么：安全/合规证据如果不随版本沉淀，出现问题时就只剩口头保证。*
- [ ] 建立 SECURITY.md、漏洞入口与响应时限，并把公开响应机制链接进仓库首层导航。
  *为什么：外部团队敢不敢生产使用，取决于他们是否知道出了问题会被怎样处理。*
- [ ] 对 flaky test 建立标签、隔离与恢复时限，不允许“先临时 skip”长期滞留主干。
  *为什么：不受控的 flaky test 会把整个 CI 信誉拖成噪音，最终让真失败也没人信。*
- [ ] 提供一个与 CI 对齐的本地 preflight 命令（如 `npm run verify` / `just verify`），并把耗时控制在贡献者可接受范围。
  *为什么：如果本地反馈回路和 CI 不一致，外部 PR 会把大量失败留到远端才发现。*
- [ ] 为关键 workflow 输出结构化摘要（coverage JSON、benchmark JSON、scan summary），只在失败时打印最小定位信息。
  *为什么：高噪音日志会掩盖真正的回归；结构化产物才能支撑后续 scorecard 和趋势比较。*
- [ ] 把“哪些检查跑在 PR、哪些跑在 nightly、哪些跑在 release”写成配置或显式 feature flag，不要把重任务硬编码进所有触发器。
  *为什么：质量体系既要严格，也要考虑执行成本；分层触发能避免大家为了速度偷偷绕过检查。*
- [ ] 给依赖升级、基础设施变更、发布脚本变更分别准备回滚或 dry-run 路径，并在文档中写清如何验证成功。
  *为什么：质量体系本身也会出错，预先设计回滚路径能避免“为了修质量把发布完全堵死”。*

## 5. 反模式（≥3 条）
- ❌ CI 看起来存在，但大量关键 job 标了 `continue-on-error`、只跑在手工触发或默认跳过 fork PR。
  典型后果：主干看似常绿，真实回归却在合并或发版之后才爆出来。
- ❌ 只追求总覆盖率数字，不定义关键路径、失败阈值或 diff 级别回归提示。
  典型后果：项目能拿到一个好看的百分比，却依旧在最重要的用户路径上反复翻车。
- ❌ 版本号、changelog 与 breaking change 提示完全手工维护，或者把破坏性变更藏在 patch/minor 发布里。
  典型后果：升级成本不可预期，头部用户会选择继续 pin 旧版本而不是持续跟进。
- ❌ 安全扫描存在，但高危依赖、SBOM 缺失或 CVE 响应长期无人处理，还用“没有公开事故”自我安慰。
  典型后果：真正的风险不是扫描结果，而是团队对扫描结果已经麻木。
- ❌ 本地开发命令与 CI 检查集脱节，贡献者只能靠推 PR 试错。
  典型后果：反馈回路越来越慢，维护者开始跳过流程，最终把质量体系本身当作阻碍。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 默认分支 CI 绿率 | `gh api repos/{owner}/{repo}/actions/runs?branch=main&per_page=50 --jq '[.workflow_runs[] | select(.conclusion != null) | .conclusion] | (map(select(. == "success")) | length) / length * 100'` | 最近 50 次默认分支 workflow 成功率 ≥95% |
| 覆盖率门槛 | `jq '.total.lines.pct' coverage/coverage-summary.json` 或 CI 产出的 json-summary artifact | 总体 lines 覆盖率 ≥80%，且关键包/关键路径存在单独门槛 |
| 性能回归幅度 | `node benchmarks/run.<js|ts> --output metrics/benchmarks/latest.json` 后与上次基线比较 | p95 延迟回归 <5%，关键冷启动/构建时间回归 <10% |
| 高危漏洞滞留量 | `gh api repos/{owner}/{repo}/dependabot/alerts --paginate` 或 `osv-scanner --format json .` | open critical = 0；high 且超过 7 天未处理 = 0 |
| 发布纪律合规率 | `gh api repos/{owner}/{repo}/releases --jq '[.[] | {tag_name, body}]'` + tag/changelog 校验脚本 | 最近 10 个 release 的 tag 全部符合 SemVer，且 release notes 缺失率 = 0 |
| 本地反馈回路时长 | `hyperfine 'npm run verify'`、`hyperfine 'pnpm verify'` 或等价 preflight 命令 | 默认贡献者机器上完整 preflight ≤5 分钟，快速 smoke ≤2 分钟 |

## 7. 工具与模板
- `tools/ci/required-checks.*`：读取 workflow 配置与 branch protection 规则，校验 required checks 是否与 playbook 契约一致。
- `tools/coverage/pr-comment.*`：把 coverage diff 变成 PR 评论与 JSON artifact；低于阈值时 hard-fail，而不是只发提醒。
- `tools/bench/regression.*`：跑关键 benchmark、比对基线并输出 machine-readable 结果，供 `metrics/` 与 scorecard 消费。
- `tools/security/audit.*`：统一封装 `osv-scanner`、`npm audit`、`pip-audit`、`cargo audit` 等结果，生成低噪音摘要。
- `tools/sbom/generate.*`：生成 SPDX/CycloneDX SBOM，并校验 artifact 是否随 release 发布。
- `tools/release/dry-run.*`：对 changelog、SemVer、release notes 与 tag 规则做 dry-run，提前暴露 breaking-change 漏标。
- `tools/preflight/verify.*`：本地一键 preflight 脚本，确保 lint/typecheck/test/format 与 CI 契约对齐。
- `templates/quality/ci-matrix.yml`：质量矩阵模板，显式拆分 PR、nightly、release 三种触发层级与 feature flags。
- `templates/quality/security-policy.md`：SECURITY.md 模板，固定 disclosure、SLA、支持版本与补丁窗口字段。
- `templates/quality/benchmark-thresholds.json`：性能/稳定性阈值模板，避免把门槛散落在 workflow 条件表达式中。
