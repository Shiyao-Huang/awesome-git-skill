---
id: bench-issue-response
dimension: community              # 与 [community:funnel]/[community:issue-tpl] 共用底层信号；不映射到 6 域之外
subitem: funnel                   # 子项归属：贡献者漏斗的"首次响应/收敛"环节
version: 0.1.0
status: draft
captured_at: 2026-04-27
source: gh-api
methodology_caveat: "本表测量 time-to-close（issue 关闭时延），不是 time-to-first-response。多个仓库存在 bot 自动关闭（n8n/next.js/langchain），中位数 0.0h 是 bot triage 签名而非人工响应速度，**禁止**直接当作运营响应能力指标使用。"
---

# Benchmark: D8 — Issue Response (cross-project median time-to-close)

> 上游：`case-studies/00-target-list.md` §3 D8（"Issue 中位响应"，P0 标 UNVERIFIED，本文件即 P1 补全）
> 取数：`gh api repos/<owner>/<repo>/issues?state=closed&sort=updated&direction=desc&per_page=30 --jq '[.[] | select(.pull_request | not) | {created_at, closed_at}]'`
> 时间窗：每个仓库取最近 30 个 **state=closed** 的 issue（PR 已剔除），实际样本因仓库 close 速率不同在 3-21 之间
> 指标：`time_to_close = closed_at − created_at`（小时）；汇总用 median + p25/p75 + min/max
> 抓取日期：2026-04-27 · 抓取账户：`Shiyao-Huang`

---

## 1. 数据表（10 个 100K+★ 主标的）

| Repo | n | median (h) | p25 (h) | p75 (h) | min (h) | max (h) | 备注 |
|------|--:|-----------:|--------:|--------:|--------:|--------:|------|
| microsoft/vscode        | 21 |  346.5 |  226.3 |  398.8 | 0.2  | 35,758.2 | max 异常值为 2022 年长尾 issue [s1] |
| n8n-io/n8n              | 14 |    0.0 |    0.0 |  197.8 | 0.0  |  4,522.3 | **疑 bot auto-close**：6/14 项 `closed_at − created_at < 30s` [s2] |
| ollama/ollama           | 20 |   46.4 |   10.4 |  426.0 | 0.0  |  3,735.2 | 含 4 项 < 60s 的快速关闭，疑机器分流 [s3] |
| langgenius/dify         | 20 | 1,121.1 |  453.6 | 1,281.9 | 0.4  |  5,810.1 | 长尾偏长，疑 stale-bot 周期化关闭 [s4] |
| vercel/next.js          |  7 |    0.0 |    0.0 |    0.0 | 0.0  |  9,502.8 | **疑 bot auto-close**：6/7 项 < 20s [s5] · 样本偏小（n=7） |
| langchain-ai/langchain  |  9 |    0.0 |    0.0 |    2.2 | 0.0  |    389.6 | **疑 bot auto-close**：6/9 项 < 15s [s6] |
| open-webui/open-webui   | 18 |   13.2 |    5.8 |   48.5 | 0.3  |     69.3 | 中位数最低且分布稳定，疑活跃维护者快速分流 [s7] |
| excalidraw/excalidraw   |  9 |    7.1 |    0.1 |  259.6 | 0.0  | 34,737.0 | 长尾受 2020/2021 老 issue 影响 [s8] |
| shadcn-ui/ui            |  3 | UNVERIFIED: sample_size<10 | — | — | — | — | 本批次 close 量过少 [s9] |
| Comfy-Org/ComfyUI       |  3 | UNVERIFIED: sample_size<10 | — | — | — | — | 本批次 close 量过少 [s10] |

---

## 2. 重要方法论警示（必读）

1. **time_to_close ≠ time_to_first_response**。本表无法区分"维护者认真讨论后关闭"与"bot 自动关闭"。median=0.0h 的项目 **不能** 解读为"响应快"，更可能是机器人 triage 签名。
2. **样本偏向**：`sort=updated&direction=desc` 优先采到最近被更新的 closed issue，长尾老 issue 也会进入样本（vscode/excalidraw 的 max=3.5w h 即为此），导致 p75/max 不稳定。
3. **样本量门槛**：shadcn-ui (n=3) 与 ComfyUI (n=3) 在本批次抓取窗口内 closed issue 不足，强制标 `UNVERIFIED: sample_size<10`，**禁止** fallback 到"算个数就发"。
4. **PR 已剔除**：`select(.pull_request | not)` 过滤掉了 PR；GitHub API 的 issues 端点默认混合 issue+PR。
5. **时区**：所有时间戳为 UTC ISO-8601，不做本地化换算。

---

## 3. 结论候选（待 P1 case-study 单独验证后落 playbook）

- **可信信号**：open-webui (median 13.2h, p75 48.5h) + ollama (46.4h, 426h) 是本组中分布最健康的两个，对应 `[community:issue-tpl]` 与 `[community:discussions]` 子项的"小规模团队主动维护"模式，可作 playbook 候选证据。
- **反例信号**：dify (median 1,121h ≈ 47d) 表明海外增长样板项目 issue 收敛慢，说明 100K+ ★ 不必然带来响应优势，需要单独 case-study 拆解 issue 类型分布。
- **不可结论**：vscode/n8n/next.js/langchain 在本指标下被 bot 噪音淹没，本表不出 community-level 结论；P1 case-study 阶段需补 **time_to_first_human_comment** 自定义抓取。
- **样本不足**：shadcn-ui/ComfyUI 本批次 D8 不可下结论，留待下次抓取窗口扩到 90d 时补齐。

---

## 4. 引用（10 条 gh-api 抓取）

- `[s1]` `https://api.github.com/repos/microsoft/vscode/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s2]` `https://api.github.com/repos/n8n-io/n8n/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s3]` `https://api.github.com/repos/ollama/ollama/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s4]` `https://api.github.com/repos/langgenius/dify/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s5]` `https://api.github.com/repos/vercel/next.js/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s6]` `https://api.github.com/repos/langchain-ai/langchain/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s7]` `https://api.github.com/repos/open-webui/open-webui/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s8]` `https://api.github.com/repos/excalidraw/excalidraw/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s9]` `https://api.github.com/repos/shadcn-ui/ui/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27
- `[s10]` `https://api.github.com/repos/Comfy-Org/ComfyUI/issues?state=closed&sort=updated&direction=desc&per_page=30` — captured 2026-04-27

---

## 5. 已知缺口（hard-fail 标注）

- D8.bot-noise: 4/10 项目 median 受 bot 污染，**禁止** 直接喂入 scorecard。需 P1 阶段引入 `time_to_first_human_comment`（过滤 `user.type=Bot` + 首条非作者评论）替代。
- D8.sample-size: 2/10 项目样本不足 (`sample_size<10`)，标 UNVERIFIED；扩窗口 → 90d 重抓即可解。
- D8.long-tail: max 受历史长尾 issue 影响，需 P1 加 `closed_at > captured_at - 365d` 过滤。

> 不允许"信号缺失自动判 0"或"取均值掩盖样本不足"。本表所有数值由 `python3 statistics.median` 直算，源 JSON 见 §4 引用。

## 6. 变更日志
- 2026-04-27 v0.1.0 — Research Lead 初版（10 项目 × time_to_close median，方法论警示已显式标注）
