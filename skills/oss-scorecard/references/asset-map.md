# OSS Scorecard Asset Map

这个文件告诉 skill 在仓库里该去哪里拿资产，以及这些资产在 **深度分析** 里分别扮演什么角色。

## 1. 经验基准 / 对标样本

Tier-1 爆发样本：
- `case-studies/openclaw.md`
- `case-studies/everything-claude-code.md`
- `case-studies/andrej-karpathy-skills.md`
- `case-studies/mirofish.md`
- `case-studies/oh-my-openagent.md`
- `case-studies/worldmonitor.md`

更多案例：
- `case-studies/` 其余文件

用途：
- 找到“这个项目最像谁”
- 提取成功模式 / 边界条件
- 避免空泛建议

## 2. 评分语言 / 方法论

- `references/deep-analysis-dimensions.md`
- `benchmarks/facade.md`
- `benchmarks/docs.md`
- `benchmarks/community.md`
- `benchmarks/quality.md`
- `benchmarks/caselib.md`
- `benchmarks/tooling.md`

用途：
- 定义 6 域到底在看什么
- 明确每个域要读哪些文件、问哪些深度问题
- 把分析从主观印象收敛成一致的判断语言

## 3. 实证锚点 / 定量基线

- `benchmarks/case-anchors.yaml`
- `research/FINDINGS.md`
- `research/tier1-comparison-matrix.md`

用途：
- 判断项目相对 Tier-1 cohort 的位置
- 引用 P25 / P50 / P75 等经验锚点
- 支撑“这个建议为什么重要”

## 4. 可执行动作库

- `playbooks/facade.md`
- `playbooks/docs.md`
- `playbooks/community.md`
- `playbooks/quality.md`
- `playbooks/case-library.md`
- `playbooks/release.md`
- `playbooks/scorecard.md`
- `playbooks/seo.md`
- `playbooks/quick-wins.md`

用途：
- 把 gap 变成动作
- 把建议从“应该更好”变成“下一步怎么做”

## 5. 自动化 / 原始证据

快速公开基线：
- `bin/oss-scorecard.mjs`
- `packages/core/`

GitHub 研究采集器：
- `packages/collectors/`

仓库元数据校验：
- `tools/index.ts`

用途：
- 为 quick 模式提供 baseline
- 为深度分析补原始证据
- 但不能代替代码阅读本身

## 6. 架构与产品原则

- `docs/architecture.md`
- `docs/competitive-landscape.md`
- `docs/methodology.md`

用途：
- 约束什么叫可信分析
- 记住 public quick score ≠ deep audit
- 保持 `UNVERIFIED`、hard-fail、knowledge-base-grounded 这些产品 DNA
