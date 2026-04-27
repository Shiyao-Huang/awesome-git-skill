# OSS Scorecard Asset Map

这个文件告诉 skill 在仓库里该去哪里拿资产，不重复复制原文。

## 评分规则

- `benchmarks/facade.md`
- `benchmarks/docs.md`
- `benchmarks/community.md`
- `benchmarks/quality.md`
- `benchmarks/caselib.md`
- `benchmarks/tooling.md`

用途：定义 6 域评分口径、信号、边界、hard-fail 规则。

## 可复用动作

- `playbooks/facade.md`
- `playbooks/docs.md`
- `playbooks/community.md`
- `playbooks/quality.md`
- `playbooks/case-library.md`
- `playbooks/release.md`
- `playbooks/scorecard.md`
- `playbooks/seo.md`

用途：把 gap 转成可执行的修复动作与模板建议。

## 样本锚点

Tier-1 爆发样本：
- `case-studies/openclaw.md`
- `case-studies/everything-claude-code.md`
- `case-studies/andrej-karpathy-skills.md`
- `case-studies/mirofish.md`
- `case-studies/oh-my-openagent.md`
- `case-studies/worldmonitor.md`

用途：给 repo 审计结果提供对标样本与边界条件。

## 执行工具

- `packages/collectors/` — GitHub repo profile collector
- `tools/index.ts` — front-matter strict indexer
- `tools/scorecard-run.ts` — 当前 scorecard MVP 路径
- `bin/oss-scorecard.mjs` — 仓库级 CLI 入口
