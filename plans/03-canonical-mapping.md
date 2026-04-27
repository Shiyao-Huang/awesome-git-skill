# 03 — Canonical Mapping: 8 维度 ↔ 6 域 × 37 叶子

> Status: ratified-v0.1 · Owner: solution-architect · Reviewers: master + researcher + Codex #8 #10 · Date: 2026-04-27
> 上游：[`00-repo-skeleton.md`](./00-repo-skeleton.md) §3（8 维度，仅作用户导航）
> 下游 / 唯一 machine-canonical 源：[`01-taxonomy.md`](./01-taxonomy.md) §3 标签清单（37 叶子）
> 触发动机：Codex #10 / #8 在 WAVE-2 派发时发现 8-dim 与 6-域并存导致 fm-indexer 白名单歧义；researcher 反馈 14 个 case-study 维度有 1 项（docs 站技术栈）未在原 36 叶子中找到归宿。

## 0. 决议摘要（Decision）

1. **唯一 machine-canonical**：`plans/01-taxonomy.md` §3 的 **37** 个 `[域:子项]` 标签是路由 / 评分 / 索引的唯一白名单。
2. **00-repo-skeleton.md §3 的「8 维度」自此降级**：仅作 playbook 用户导航入口（`playbooks/<8-dim>.md`），不参与机器枚举。
3. **playbook ↔ leaf 是 1:N 映射**：一个用户导航入口（如 `playbooks/release.md`）可覆盖多个 6-域叶子（如 `[community:release]` + `[quality:semver]` + `[tooling:release-bot]`）。playbook front-matter `dimension`/`subitem` 仍取 6 域 × 37 叶子白名单的值，叶子覆盖在 playbook 内部 `covers:` 数组中声明。
4. **fm-indexer 行为**：解析时只校验 `dimension`/`subitem` ∈ 37 叶子；未命中 → hard-fail，不 fallback 到 "uncategorized"，不接受 8-dim 标签。
5. **新叶子 `[docs:site-stack]`**：吸收 researcher 提的 docs 站技术栈选型维度（Nextra / Mintlify / Starlight / Docusaurus 等），38 叶子？答：**37 叶子**（`01-taxonomy.md` v0.1 已加，36→37）。

## 1. 8 维度（用户导航）→ 6 域 × N 叶子（机器枚举）

| 8 维度（旧，仅导航）       | 主映射（machine-canonical 6 域）                  | 覆盖的 37-叶子（一个 playbook 至少 cover 这些）                                                          | 说明 |
|--------------------------|--------------------------------------------------|----------------------------------------------------------------------------------------------------------|------|
| `facade`                 | `facade`                                         | `[facade:hero]` `[facade:badges]` `[facade:demo]` `[facade:social]` `[facade:tagline]`                    | 纯 1:1 拆分。 |
| `docs`                   | `docs`                                           | `[docs:quickstart]` `[docs:tutorial]` `[docs:api-ref]` `[docs:troubleshoot]` `[docs:i18n]` `[docs:examples]` `[docs:site-stack]` | 加入 site-stack。 |
| `community`              | `community`                                      | `[community:issue-tpl]` `[community:pr-tpl]` `[community:discussions]` `[community:funnel]`               | community 与 release/growth/seo/social 在 6 域里被合并到 community 顶层；详见后 4 行。 |
| `release`（旧）           | **`community` + `quality` + `tooling`** 跨域      | 主：`[community:release]`；副：`[quality:semver]` `[quality:ci-cd]` `[tooling:release-bot]`                | 节奏 / changelog 风格属 community；SemVer / CI 属 quality；自动化属 tooling。 |
| `quality`                | `quality`                                        | `[quality:perf-baseline]` `[quality:ci-cd]` `[quality:semver]` `[quality:security]` `[quality:test-coverage]` `[quality:dx]` | 1:1。 |
| `growth`（旧）            | **`community` + `caselib`** 跨域                   | 主：`[community:launch]` `[community:funnel]`；副：`[caselib:adoption]`                                    | launch playbook + 漏斗 + adoption 故事 = 增长全链。 |
| `seo`（旧）               | **`community` + `tooling`** 跨域                   | 主：`[community:seo]`；副：`[tooling:lighthouse]`                                                          | SEO 内容策略归 community；监测归 tooling。 |
| `case-library`           | `caselib`                                        | `[caselib:head]` `[caselib:scorecard]` `[caselib:h2h]` `[caselib:metrics]` `[caselib:adoption]`            | 1:1（重命名）。 |

> 跨域 playbook（`release` / `growth` / `seo`）的 front-matter `dimension` 字段必须取 **主映射** 的 6 域之一（如 `release.md` 取 `community`），通过 `covers:` 数组列出副映射叶子。fm-indexer 校验 `covers[]` 每一项也必须命中 37 叶子。

## 2. WAVE-2 卡片名兼容（master 已派发的入口名）

Master 在 WAVE-2 用 `[playbook:<old-dim>]` 前缀派发了以下导航入口（不是叶子，是 user-facing playbook 文件）：

| WAVE-2 卡前缀                | 落地文件                          | front-matter `dimension`（6 域） | front-matter `covers[]`（叶子） |
|------------------------------|----------------------------------|----------------------------------|----------------------------------|
| `[playbook:facade]`          | `playbooks/facade.md`            | `facade`                         | facade.* 全集 |
| `[playbook:docs]`            | `playbooks/docs.md`              | `docs`                           | docs.* 全集（含 site-stack） |
| `[playbook:community]`       | `playbooks/community.md`         | `community`                      | community.{issue-tpl,pr-tpl,discussions,funnel,social} |
| `[playbook:release]`         | `playbooks/release.md`           | `community`                      | community:release, quality:semver, quality:ci-cd, tooling:release-bot |
| `[playbook:quality]`         | `playbooks/quality.md`           | `quality`                        | quality.* 全集 |
| `[playbook:growth]`          | `playbooks/growth.md`            | `community`                      | community:launch, community:funnel, caselib:adoption |
| `[playbook:seo]`             | `playbooks/seo.md`               | `community`                      | community:seo, tooling:lighthouse |
| `[playbook:case-library]`    | `playbooks/case-library.md`      | `caselib`                        | caselib.* 全集 |

> 实施约束（implementer 必读）：
> - playbook front-matter 的 `dimension` 字段不能取 8-dim 旧名（`release`/`growth`/`seo`/`case-library`），只能取 6 域之一。
> - `covers[]` 的元素必须严格匹配 `01-taxonomy.md` §3 的 37 叶子；fm-indexer `--strict` 会全量校验，未命中 → hard-fail。
> - 一个叶子可以被多个 playbook `covers[]` 引用（路由查询时返回所有引用方），但只能有一个 **owner** playbook（在 leaf benchmark 文件 front-matter 的 `owner_playbook:` 声明）。

## 3. fm-indexer 行为契约（实现要求）

`tools/fm-indexer` 在解析任何 playbook / case-study / benchmark 文件时：

1. 读 `dimension` —— 必须 ∈ {`facade`,`docs`,`community`,`quality`,`caselib`,`tooling`}；否则 hard-fail。
2. 读 `subitem`（playbook 入口可选；leaf benchmark 必填） —— 必须 ∈ 37 叶子表；否则 hard-fail。
3. 读 `covers[]`（playbook 用） —— 每一项必须 ∈ 37 叶子表；否则 hard-fail。
4. **禁止 fallback**：不允许把未识别值规约为 `uncategorized` / `null` / 跳过该字段。
5. 8-dim 旧名（`release`/`growth`/`seo`/`case-library`）出现在 `dimension`/`subitem`/`covers[]` 任一位置 → hard-fail，提示「该值已废弃，参考 plans/03-canonical-mapping.md」。

观测要求（`--verbose`）：
- 输出 `LOADED <N> leaves whitelist from plans/01-taxonomy.md`
- 每条 hard-fail 必须打印：文件路径、字段名、违规值、最近合法叶子建议（≤3 个）。

## 3.1 Playbook vs Case-Study front-matter schema（fm-indexer 必须分流）

两类文件 schema 不同，fm-indexer 实现时按 `id:` 前缀分流，**禁止用一套校验混跑**：

| 文件类型              | id 前缀         | 路径模式                | 必填分类字段                              | 校验规则 |
|----------------------|-----------------|------------------------|------------------------------------------|--------|
| playbook（user-facing 入口） | `<8-dim>-001` 或自定 | `playbooks/<name>.md`  | `dimension`（单值，6 域之一）+ `covers[]`（叶子列表）| 跨域 playbook 用 covers[] 列副映射叶子 |
| playbook leaf（≤1 叶子时）   | `<dim>-<sub>`     | `playbooks/<dim>/<sub>.md` | `dimension` + `subitem`（单值，37 叶子之一）| 不需 covers[] |
| case-study（拆解头部项目）   | `case-<slug>`     | `case-studies/<slug>.md` | `dimensions_covered[]`（≥3 个 6 域顶层）   | **不要**填 `subitem` / `covers[]`；引用 leaf 在正文 §4 经验里挂 [域:子项] 标签 |
| benchmark（评分卡）          | `bench-<dim>`     | `benchmarks/<dim>.md`  | `dimension`（单值，6 域之一）+ `weight`     | 子项块在正文用 `## <name>  [<dim>:<sub>]` 标题表达 |

> 实现要点（implementer @ `[tooling:fm-indexer]`）：
> - 先读 `id:` 前缀决定走哪条 schema 校验路径；前缀不命中 4 类之一 → hard-fail
> - case-study 的 `dimensions_covered[]` 元素必须 ∈ {`facade`,`docs`,`community`,`quality`,`caselib`,`tooling`}；出现叶子标签（如 `docs:site-stack`） → hard-fail（叶子级在正文，不在 front-matter）
> - playbook 的 `covers[]` 元素必须 ∈ 37 叶子；4 类校验各自独立，**不要共用** allowedValues 列表

## 4. 验收信号（架构侧）

- [x] `plans/01-taxonomy.md` 标 v0.1 + Supersedes 头
- [x] `plans/00-repo-skeleton.md` §3 标"已降级，仅导航"
- [x] `plans/03-canonical-mapping.md`（本文件）落盘
- [ ] `tools/fm-indexer` 实现 §3 全部行为（implementer @ `[tooling:fm-indexer]`）
- [ ] 8 个 user-facing playbook 文件按 §2 表格落 front-matter（implementer × playbook）
- [ ] reviewer 拒绝任何在 `dimension`/`covers[]` 出现 8-dim 旧名的 PR

## 5. 已知风险与拒绝理由

| 候选方案                                              | 拒绝理由                                                                  |
|------------------------------------------------------|--------------------------------------------------------------------------|
| 让 fm-indexer 同时接受 8-dim 与 6 域作双白名单         | 违反「禁止 fallback」原则；双源白名单必然漂移。                            |
| 把 `release`/`growth`/`seo` 提升回顶层第 7~9 域        | 与 01-taxonomy §1「拒绝合并的争议」决议矛盾；会和 community/quality 重叠。 |
| 把 `[docs:site-stack]` 放到 `tooling:lighthouse` 下    | site-stack 是文档侧选型决策（内容/作者体验），lighthouse 是性能监控信号。 |
| 删除 8-dim 入口、强迫用户直接看 37 叶子                | 用户导航成本太高；100K star 项目的非工程读者读不下来 37 叶子表。           |
