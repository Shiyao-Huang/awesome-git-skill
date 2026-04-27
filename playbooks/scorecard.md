---
id: scorecard-meta
dimension: caselib
subitem: scorecard
version: 0.1.0
status: ratified
last_verified_at: 2026-04-27
---

# Playbook — 如何运行 Open Source Scorecard

> 元剧本：如何用 scorecard 给一个项目体检。详细模型见 [`../plans/02-scorecard.md`](../plans/02-scorecard.md)。

## 前置条件
- `tools/scorecard-run` 已实现并通过 self-test
- `scorecard.config.yaml` 准备好；`skipped[]` 中每个子项写明 `reason`

## 运行流程
1. `pnpm scorecard run --config scorecard.config.yaml --project owner/repo`
2. 输出 JSON 写到 `metrics/scorecard/<date>/<owner__repo>.json`（dated；禁止覆盖）
3. 任一 collector failure → 退出码非 0，**不写**入 metrics（fallback 即 bug）
4. 成功后渲染人读报告到 `case-studies/<owner__repo>.md`（首次跑分时由 `tools/case-study-init` 生成骨架）

## 解读结果
- 域得分 < 50 视为短板，进入下一轮迭代的 P0 改进列表
- 子项 0–1 的，去对应 `playbooks/<dim>/<subitem>.md` 找改进剧本
- 复算稳定性：同一 commit 同日两次跑分，overall 差 > 1.0 → tooling 域回归告警

## 常见错误
| 现象                              | 处理                                           |
|----------------------------------|----------------------------------------------|
| collector throw                   | 修 collector，不要把信号默认为 0              |
| signal_id 重复                    | fm-indexer 已 hard-fail；改 signal_id        |
| 权重在 PR 中被改                   | reviewer 拒 PR；权重只能在 02-scorecard 改   |
| 项目想 skip 一整个域               | 不允许；最多 skip 子项；reason 必填           |
