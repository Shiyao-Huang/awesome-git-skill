# Case-Study Template v1 (`[templates:case-study]`)

> Owner: Research Lead · Aligned to: `plans/01-taxonomy.md` (6 顶层域) · Date: 2026-04-27
> Consumer: `case-studies/<slug>.md`、`tools/fm-indexer`、`benchmarks/scorecard-v0.md`
> Hard-fail principle: 任何无法 API/URL 校验的字段必须显式 `UNVERIFIED: <reason>`，禁止编造、禁止 fallback。

---

## 0. 使用方式

1. 复制本文件到 `case-studies/<slug>.md`（slug 用 owner-repo，例如 `shadcn-ui`、`vercel-next-js`）。
2. 按下方 **front-matter v1** 填字段，所有数值字段必须带 `*_at` 抓取日期。
3. 按 **6 章节骨架** 顺序撰写。任何域（facade/docs/community/quality/caselib/tooling）的结论必须挂至少 1 个 `sources[].id` 引用。
4. 完成后由 `tools/fm-indexer` 校验；越界字段 / 缺 `*_at` / 缺引用 → hard-fail，PR 拒入。

---

## 1. Front-Matter v1（机器契约）

```yaml
---
# 标识
id: case-<slug>                  # 必须以 case- 开头，与文件名一致
project: <human-readable name>
repo_url: https://github.com/<owner>/<repo>

# 数据快照（所有数字字段都必须有对应 *_at）
star_count: <int>
star_count_at: 2026-04-27        # ISO date，抓取当天
star_source: gh-api              # 枚举：gh-api | star-history | unverified

forks_count: <int|UNVERIFIED>
open_issues_count: <int|UNVERIFIED>
license_spdx: <SPDX-id|NOASSERTION|UNVERIFIED>
last_push_at: <ISO-date|UNVERIFIED>

# 分类（必须命中 00-target-list §2 品类枚举之一）
category: dev-tool|ai-runtime|ai-app|ai-sdk|ai-ui|ai-visual|framework|infra|ide|ui-kit|ui-visual|productivity

# 评估维度覆盖（必须是 01-taxonomy.md §1 顶层 6 域子集；至少 3 个）
dimensions_covered:
  - facade
  - docs
  - community
  - quality
  - caselib
  - tooling

# 状态机
status: draft|review|stable
last_verified_at: 2026-04-27

# 引用清单（≥3 条；任何正文断言必须 cite 对应 id）
sources:
  - id: s1
    url: https://api.github.com/repos/<owner>/<repo>
    captured_at: 2026-04-27
    type: github                  # 枚举：github | hn | ph | x | reddit | blog | wayback | star-history | docs-site | video
    note: <可选简注>
---
```

### 1.1 Hard-fail 规则（fm-indexer 实现）

| 规则 | 违反示例 | 处理 |
|------|---------|------|
| `id` 必须 `case-` 前缀 | `id: shadcn-ui` | reject |
| `star_count` 必有 `star_count_at` | 缺 `star_count_at` | reject |
| `dimensions_covered` 子集校验 | `dimensions_covered: [growth]` | reject（growth 不在 01-taxonomy 顶层） |
| `category` 枚举 | `category: misc` | reject |
| `sources` ≥ 3 且每条带 `captured_at` | 2 条 / 缺日期 | reject |
| 正文域结论 → 引用挂载 | "周活 10k" 但无 `[s?]` | reject |
| 数字字段不允许凭感觉填 | `forks: ~5000` | reject（必须 int 或 `UNVERIFIED`） |

> 不允许 fallback 到默认值或 `unknown`。`UNVERIFIED: <reason>` 是唯一合法的"未知"标注。

---

## 2. 6 章节骨架

### §1 一句话定位 + 目标用户
- 不超过 60 字。说明：**项目是什么 / 给谁 / 为什么需要它**。
- 引用：项目自身 README hero / landing page tagline。`[s?]`

### §2 关键数据表（fact-only）
| 字段 | 值 | 来源 |
|------|----|------|
| Stars | <num> @ <date> | [s1] |
| Forks | <num> @ <date> | [s1] |
| Open Issues | <num> @ <date> | [s1] |
| License | <spdx> | [s1] |
| Last Push | <ISO> | [s1] |
| Star History URL | https://star-history.com/#... | [s?] |
| First Commit | <ISO\|UNVERIFIED> | [s?] |
| Contributors | <bucket: <50 / 50-200 / 200-1k / 1k+> | [s?] |

> 任何无法用 `gh api` 或公开 URL 验证的项 → `UNVERIFIED: <reason>`。

### §3 6 域评估（核心）
按 `01-taxonomy.md` 的 6 顶层域逐一展开，每个域 1-3 段，必带引用。

#### 3.1 facade — 门面 / 第一印象
- 观察对象：README hero / badges / demo 形式 / OG image / tagline
- 取数：仓库根 + landing page 截图 + `og:image` URL
- 结论模板：**做了什么** + **效果信号** + `[s?]`

#### 3.2 docs — 文档与上手
- 观察对象：quickstart 步数 / tutorial 完整度 / API ref / 文档站技术栈（[docs:site-stack]）
- 取数：docs 站 footer / 仓库 docs/ 目录 / package.json

#### 3.3 community — 社区与增长
- 观察对象：issue & PR 模板 / discussions 入口 / release 节奏 / launch 渠道 / SEO 关键词 / 社交账号
- 取数：`gh api repos/.../releases` 中位间隔 / `.github/` / HN/PH 历史帖

#### 3.4 quality — 代码与发布质量
- 观察对象：CI 矩阵 / SemVer + Changelog / SECURITY.md / 测试覆盖 / DX 工具
- 取数：`.github/workflows/` / CHANGELOG.md / SECURITY.md

#### 3.5 caselib — 案例库与基准
- 观察对象：本项目自身被引用次数 / 落地用户 / 公开背书
- 取数：landing page "used by" / GitHub dependents

#### 3.6 tooling — 工程效率工具
- 观察对象：release-please / changesets / Lighthouse / OG 自动生成 / fm-indexer 类
- 取数：`.github/workflows/` / package.json scripts

### §4 3 条可复用经验（playbook 候选）
1. **<标题>** — 一句话原理 + 引用 `[s?]`。映射到 `[域:子项]` 标签。
2. **<标题>** — ...
3. **<标题>** — ...

> 每条经验必须能映射到 `01-taxonomy.md` §3 标签清单中的至少 1 个叶子。否则 → 反馈研究员补叶子，再回来填。

### §5 2 条边界条件（不可复用 / 反例）
1. **<场景>** — 为什么本项目能做但其他项目不能（资源/赛道/时机）。
2. **<场景>** — 同上。

### §6 引用清单
- `[s1]` GitHub API snapshot — `https://api.github.com/repos/<owner>/<repo>` — captured 2026-04-27
- `[s2]` Star history — `https://star-history.com/#<owner>/<repo>` — captured 2026-04-27
- `[s3]` Launch HN thread — `https://news.ycombinator.com/item?id=...` — wayback `https://web.archive.org/web/.../...`

---

## 3. 与下游的对齐

- **scorecard (`benchmarks/scorecard-v0.md`)**：§3 的 6 域评估直接喂给评分卡每个模块。每域至少 1 条引用 → 评分可追溯。
- **playbooks/research/**：§4 的可复用经验是 playbook 的素材池，必须带 `[域:子项]` 标签。
- **fm-indexer**：本模板的 front-matter 即唯一合法 schema，hard-fail 规则即索引器测试用例。

## 4. 反例（什么会被拒）

```yaml
# ❌ 缺日期
star_count: 113000

# ❌ 越界域
dimensions_covered: [growth, marketing]

# ❌ 凭感觉数字
forks_count: ~5k

# ❌ 引用不足
sources:
  - id: s1
    url: ...
    # 只有 1 条
```

```markdown
<!-- ❌ 域结论无引用 -->
## §3.3 community
社区周活约 10k，Discord 非常活跃。  ← 无 [s?]，reject
```

## 5. 变更日志
- 2026-04-27 v1.0 — Research Lead 初版（front-matter v1 + 6 章节骨架 + hard-fail 规则）
