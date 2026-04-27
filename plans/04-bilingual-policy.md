# 04 — 文档双语策略 (Future-State Policy)

> Status: ratified-v0.1 · Owner: solution-architect · Reviewers: master + indexer (#8) · Date: 2026-04-27
> Trigger: User 2026-04-27 10:07 序列 — 「文档双语版本」(10:07:30) → 「首先只给中文」(10:07:43，**canonical**)
> 上游：[`00-repo-skeleton.md`](./00-repo-skeleton.md) §4 (front-matter 契约) · [`01-taxonomy.md`](./01-taxonomy.md) §3 (machine-canonical 标签) · [`03-canonical-mapping.md`](./03-canonical-mapping.md) §3 (fm-indexer 行为)
> 下游：fm-indexer / scorecard-run / 所有写盘 agents

## 0. 决议摘要 (Decision Summary)

| 项 | 当前状态 (canonical, ratified-v0.1) |
|---|---|
| 默认语言 | **Chinese-only** (zh-CN 正文 + 英文 schema/术语保留) |
| Feature flag | `BILINGUAL_REQUIRED=false` (默认) |
| 已落 17 份文档 | **不回溯改写**；按 [docs:i18n] leaf 单独排期 |
| 新文档要求 | 默认 zh-CN；不主动写 EN 段 |
| Hard-fail / 引用 / UNVERIFIED | **协议不变**，不受本 policy 影响 |
| 激活条件 | 仅在 (mission-doc 闭合) **AND** (user 显式 directive 二次触发) 同时满足时切换 |

**禁止 fallback**：机翻 (Google Translate / DeepL / LLM auto-translate) 一律禁止当作 EN 段；缺 EN 必须显式 `<!-- en: TODO -->` 占位。

## 1. 当前阶段口径 (Chinese-only Canonical)

**适用范围**：所有 `playbooks/**` · `case-studies/**` · `templates/**` · `plans/**` · `benchmarks/**` · `tools/**` 的人类可读 Markdown 内容。

**规则**：
1. 正文 (描述、解释、rubric 文字、决策记录) 一律 **zh-CN**。
2. front-matter 字段值若是 enum (e.g. `dimension: facade`) 或 schema (e.g. `id: bench-<dim>`) 一律 **保持英文规范值**，不本地化。
3. 已存在的 17 份 Chinese-only 文档 **不主动重写**，待 user 显式触发 + mission 闭合后由 [`[docs:i18n]`](./01-taxonomy.md#docs) leaf 单独立项。
4. 不主动添加 EN 平行段；不创建 `xxx.en.md` 镜像文件 (理由见 §8)。

**hard rule**：当前阶段任何 PR 引入 EN 平行段 → reviewer 拒绝 (除非该卡显式标 `lang: bilingual` 且 §6 激活条件已满足)。

## 2. 保留的英文白名单 (machine-canonical)

以下英文 token 与正文语言无关，**任何阶段**保持英文规范值：

| 类别 | 示例 | 来源 |
|---|---|---|
| 标签 | `[facade:hero]` `[docs:site-stack]` | 01-taxonomy §3 (37 叶子) |
| Front-matter 字段名 | `id` `dimension` `subitem` `weight` `version` `status` `last_verified_at` `covers` `lang` | 00-repo-skeleton §4 |
| Front-matter 字段值 (enum) | `facade` `docs` `community` `quality` `caselib` `tooling` `draft|ratified|deprecated` | 01-taxonomy §3 + 03-canonical-mapping §3.1 |
| YAML schema 关键字 | `signals` `thresholds` `manual_rubric` `subitem_aggregation` `signal_id` `source` `collector` `query` `update_cadence` | _schema.md |
| Source whitelist | `github_repo` `url_fetch` `manual_review` `lighthouse` `npm` `pypi` `crates` | 02-scorecard §3.1 |
| Cite key | `[s1]` `[s2]` `UNVERIFIED:<reason>` | 02-scorecard §6 |
| Repo / API / 库 | `microsoft/vscode` `next.js` `Lighthouse` `gh api` | 通用 |
| Task ID 前缀 | `bench-<dim>` `case-<slug>` `<dim>-<sub>` | 03-canonical-mapping §3.1 |

**fm-indexer 行为**：上述 token 校验仍按原有 hard-fail 规则；与 `lang` 字段正交。

## 3. Future-State 双语 Schema (启用后形态)

> 仅在 §6 激活条件全部满足后启用；当前 ratified 但 dormant。

### 3.1 文件级 (`lang` 字段)

front-matter 增加单一字段 `lang`，取值：

| 值 | 含义 | fm-indexer 行为 |
|---|---|---|
| `zh` (默认) | 仅 zh-CN 正文 | 不要求 EN 段；与当前一致 |
| `bilingual` | 同文件 zh + en 并排 | flag-on 时校验每个 zh 段对应 EN 段；flag-off 时仅警告 |

**禁止形式**：
- ❌ `xxx.en.md` 镜像文件 (拒绝理由见 §8)
- ❌ 仅 EN 文件 (`lang: en`) — 本 repo 主语言是 zh-CN，不接受纯 EN 文件
- ❌ 缺失 `lang` 字段 → fm-indexer hard-fail (与 `dimension` 同等强度)

### 3.2 段级并排格式

bilingual 文档每个语义单元 (heading / 段落 / list item / table row) 按以下顺序写：

```markdown
## 子项标题（zh）

> 中文正文段落。

> en: English paragraph here. **Must not be machine translation.**
```

或在表格 / list 中：

```markdown
| 字段 / Field | 必填 / Required | 校验 / Validation |
|---|---|---|
```

**激活条件不满足时**，所有未翻译的 EN 段必须用占位符显式标记：

```markdown
> en: <!-- en: TODO --> (auto-flagged by fm-indexer)
```

fm-indexer 在 flag-on 时把 `<!-- en: TODO -->` 视为缺失 → hard-fail；flag-off 时仅打警告。

### 3.3 强制双语作用域 (启用后)

| 目录 | 启用后是否强制 `lang: bilingual` | 理由 |
|---|---|---|
| `playbooks/**` | **强制** | 用户面向的 actionable runbook |
| `case-studies/**` | **强制** | 公开示范文档，吸引海外贡献者 |
| `templates/**` | **强制** | 复用模板，下游用户必读 |
| `plans/**` | 非强制 | 内部架构决策；按 owner 决定 |
| `benchmarks/**` | 非强制 | 评分卡表头 + signals 是英文，正文翻译 ROI 低 |
| `tools/**` | 非强制 | code-adjacent，README 可双语 |

**强制目录**：缺 EN 段 + flag-on → fm-indexer reject；flag-off → 仅记录到 `metrics/i18n-debt.json`。

**非强制目录**：owner 自决；不影响 hard-fail。

## 4. Feature Flag 契约 (`BILINGUAL_REQUIRED`)

### 4.1 取值与生效

| 环境变量 | 值 | 含义 |
|---|---|---|
| `BILINGUAL_REQUIRED` | `false` (默认) | dormant：fm-indexer 不强制 `lang: bilingual`；EN 段缺失仅警告 |
| `BILINGUAL_REQUIRED` | `true` | enforced：§3.3 强制目录中缺 EN 段 → fm-indexer hard-fail |

### 4.2 配置位置

- CI: `.github/workflows/fm-indexer.yml` 的 `env:` 块
- 本地: `tools/fm-indexer` 启动时读 `process.env.BILINGUAL_REQUIRED`
- 默认: 未设或非 `true` 一律视为 `false`

### 4.3 切换协议

切换 `false → true` 必须满足 §6 激活条件，并通过以下 PR：
1. 修改 `BILINGUAL_REQUIRED` env 默认值
2. 同 PR 更新本文件 §0 状态行 (`Status: enforced` + `Activated at: <date>`)
3. master + solution-architect 双签

切换 `true → false` (回滚) 仅在出现 indexer hard-fail 阻塞主线时使用，并必须开 incident 记录到 `plans/`。

## 5. fm-indexer 行为 (实现要求)

### 5.1 Flag-off (当前阶段)

1. 不校验 `lang` 字段是否存在 (兼容当前 17 份文档无 `lang` 字段)
2. 若 `lang` 字段存在且为 `bilingual` 但缺 EN 段 → 仅 stderr 警告 (不退码)
3. `<!-- en: TODO -->` 占位符 → 仅记入 `metrics/i18n-debt.json`，不阻塞
4. 其它 hard-fail 规则 (dimension / subitem / covers[] / signal_id 等) **不变**

### 5.2 Flag-on (启用后)

1. §3.3 强制目录文件缺 `lang` 字段 → hard-fail (默认补 `lang: zh` 必须显式声明)
2. `lang: bilingual` 文件缺任一 EN 段 → hard-fail，错误信息打印第一处缺失行号
3. `<!-- en: TODO -->` 在强制目录中 → hard-fail；非强制目录中 → 警告
4. 机翻检测启发式 (可选 v0.2)：连续 3 段以上 EN 文本 ≥ 90% Levenshtein 与 zh 段一一对照 → 警告 (不强制 hard-fail，避免误杀)

### 5.3 观测要求 (`--verbose`)

- 启动时打印 `BILINGUAL_REQUIRED=<value> (effective: <flag-on|flag-off>)`
- 每 hard-fail 打印：文件路径、字段名 / 段落行号、违规原因、建议的修复路径 (`add lang: zh` / `add EN paragraph` / `replace TODO with content`)
- 退出时打印 `i18n stats: total=<N> bilingual=<n> zh-only=<m> todo-placeholders=<k>`

## 6. 激活条件 (Activation Gate)

切换 `BILINGUAL_REQUIRED=false → true` 必须 **同时** 满足：

1. **Mission-doc 闭合** — 以下 task 全部 `done`：
   - 全部 `[caselib:head]` (10 张头部 case-study)
   - 全部 `[playbook:*]` (8 张 user-facing playbook)
   - 全部 `[bench:*]` (6 张评分卡 stub→full)
   - `[tooling:scorecard-run]` MVP 落地
   - `[tooling:fm-indexer]` strict-mode 通过 (`--strict` 在所有 ratified 文件 0 fail)
2. **User 显式 directive** — user 在 mission-doc 闭合后再次发出双语指令 (e.g.「现在切到双语」「上线 EN 版本」)，并在 chat 留下 timestamp。
3. **Master 拆 [docs:i18n] 子任务** — 切换 PR 必须 cite 该子任务 ID，避免 ad-hoc 翻译。

任一缺失 → 切换被 reviewer 拒绝。

## 7. 已落 17 份文档处理 (Backfill Strategy)

**原则**：不主动重写。在 `[docs:i18n]` leaf (见 [`01-taxonomy.md`](./01-taxonomy.md#docs)) 单独排期，按以下次序：

1. **Tier 1** (用户面向，激活后必须双语)：`playbooks/*.md` (8 份) + `templates/*.md` (1 份)
2. **Tier 2** (示范文档)：`case-studies/*.md` (10 份头部 + 后续扩展)
3. **Tier 3** (内部决策，按 owner 决定)：`plans/*.md` + `benchmarks/*.md`
4. **Tier 4** (代码相邻)：`tools/*/README.md`

每 tier 由 master 切独立 [docs:i18n:tier-N] task；不并行抢占主线 mutex。

**fm-indexer 在 flag-on 后对未回填文档**：
- `lang: zh` 显式声明的 → 通过
- 未声明 `lang` 字段的 → hard-fail，强制补声明 (default 补 `lang: zh`，不强制双语)

## 8. 拒绝的备选方案

| 候选 | 拒绝理由 |
|---|---|
| `xxx.en.md` 镜像文件 | (a) 双倍维护成本；(b) zh / en 漂移不可观测；(c) fm-indexer 需要双源 reconciliation；(d) 与 `[域:子项]` 单文件路由冲突 |
| 机翻 fallback (Google / DeepL / LLM auto) | 违反「禁止 fallback」原则；机翻在技术术语上准确率低；用户偏好已明示 zh-only |
| 全文档立即强制双语 (no flag) | 与 user 2026-04-27 10:07:43「首先只给中文」直接矛盾 |
| 仅在 README 双语 / 文档站双语 | playbook / case-study 是核心交付；README 不在当前优先级 |
| `lang: en-only` (仅英文) | repo 主语言是 zh-CN；纯 EN 文件无 zh 兜底会让中文贡献者看不到决策 |
| 把 `BILINGUAL_REQUIRED` 设成布尔 OR (任一目录满足即通过) | 违反「配置驱动」精神；目录级粒度太粗，应继续用 §3.3 表格 |

## 9. 验收信号 (架构侧)

- [x] 本文件 v0.1 落盘
- [x] 当前阶段 canonical = Chinese-only 明确写在 §0 + §1
- [x] Future-state schema (`lang: bilingual`) 在 §3 完整定义
- [x] Feature flag `BILINGUAL_REQUIRED` 契约在 §4 写明 (default false)
- [x] fm-indexer flag-on / flag-off 行为分支在 §5 写明
- [x] 激活条件三件套在 §6 写明
- [ ] `tools/fm-indexer` 在下一次 PR 增加 `BILINGUAL_REQUIRED` env 解析与 §5 行为分支 (implementer @ `[tooling:fm-indexer]`，**非阻塞主线**)
- [ ] `templates/case-study.md` 与 `plans/02-playbook-skeleton.md` 在合适位置加 `lang: zh` 默认 (single-line edit，可与下次 review 一并)
- [ ] master 在 mission-doc 闭合 + user re-trigger 时切 `[docs:i18n]` 子任务，不在本 policy 范围内

## 10. 与其它 plans/ 文档的关系

- `00-repo-skeleton.md` §4 front-matter 契约：本 policy 增加可选字段 `lang`，不破坏向后兼容 (缺字段当 `zh`)
- `01-taxonomy.md` §3：白名单标签不变；新增 `[docs:i18n]` leaf 用于 backfill 排期 (已存在)
- `02-scorecard.md`：scorecard 信号语言无关；不受本 policy 影响
- `03-canonical-mapping.md` §3：fm-indexer 行为在本 policy §5 扩展，hard-fail 优先级不变
- `_schema.md`：benchmarks signal block 仍是英文 schema，正文 zh-CN 即可，无须双语
