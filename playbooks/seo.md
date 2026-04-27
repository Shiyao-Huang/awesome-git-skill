---
id: seo-playbook-001
dimension: community
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
covers:
  - community:seo
  - tooling:lighthouse
---

# seo playbook

## 1. 维度定义
`seo` 维度衡量项目能否让“尚未听过你”的用户在搜索、目录与链接分发链路中稳定发现你，并把发现转成高意图访问、试用与后续社区入口。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | GitHub topics 缺失或完全泛化，项目站点/文档站没有 sitemap、canonical、meta description，仓库与文档在搜索结果里几乎不可发现。 |
| 1 | 维护者知道 SEO 很重要，但只零散补了标题或关键词；topics 数量很少或高度噪音化，页面标题、描述、OG 文案彼此不一致，外部目录/awesome-list 收录靠偶然转发。 |
| 2 | 项目具备基础的 topics、title、description 和可访问文档，但没有系统整理高意图关键词、没有结构化数据或 sitemap 审计，也没有把搜索入口与 quickstart/docs/社区入口联成一条路径。 |
| 3 | 维护者能说清主关键词、替代方案关键词和核心落地页；GitHub topics、docs 页面 title/description、OG 卡片和基础 sitemap 已就位，并开始记录 awesome-list/backlink 线索，但 Lighthouse SEO、索引健康与目录分发仍未形成持续机制。 |
| 4 | 项目默认维护精准 topics、关键词地图、sitemap/robots/canonical、结构化数据与 OG/Twitter 卡片；至少有若干 awesome-list 或目录收录记录，并能用命令或日志定期检查收录面、坏链和 SEO 退化。 |
| 5 | 项目形成可复用的发现系统：关键词意图、GitHub topics、页面信息架构、结构化元数据、awesome-list/目录投递、反向链接记录和 Lighthouse/索引审计全部成文且可复核；付费工具缺失的数据被明确标 `UNVERIFIED`，而不是被营销叙事替代。 |

## 3. 头部项目实践占位
- [ ] next.js: 待 case-study 填充
- [ ] n8n: 待 case-study 填充
- [ ] dify: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] shadcn-ui: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 为项目整理一张关键词地图，至少区分品牌词、品类词、替代方案词和高意图任务词，并标注每类词要落到的页面。
  *为什么：没有意图分层，维护者很容易把所有词都堆到首页，结果哪一类用户都接不住。*
- [ ] 给 GitHub 仓库维护 5-10 个精准 topics，优先覆盖真实使用场景与品类定位，定期删掉泛化或误导性标签。
  *为什么：GitHub topics 本身就是项目发现面，错误标签会把低意图流量和错误预期带进来。*
- [ ] 统一仓库描述、docs/landing 的 `<title>`、`meta description`、OG 标题与主 tagline，不让搜索摘要与页面首屏讲不同故事。
  *为什么：发现链路如果叙事不一致，会降低点击率，也会让访客怀疑是不是点错了项目。*
- [ ] 为 docs/landing 站点生成并提交 `sitemap.xml` 与 `robots.txt`，同时明确 canonical URL 与版本策略。
  *为什么：没有 sitemap/canonical，收录面和重复页面问题都只能靠搜索引擎自己猜。*
- [ ] 在首页与核心文档页补最小可用结构化数据（如 SoftwareApplication、TechArticle 或 FAQPage），并用命令可检方式验证其存在。
  *为什么：结构化数据不是锦上添花，而是帮助搜索引擎正确理解项目类型和页面用途。*
- [ ] 为“为什么选你而不是 X”准备 1-3 个对比型页面或章节，覆盖替代方案词与迁移意图词。
  *为什么：很多高质量搜索不是品牌词，而是“alternative to”“vs”与迁移问题。*
- [ ] 建立 awesome-list / 目录收录清单，记录目标列表、提交条件、PR 模板、提交日期与结果状态。
  *为什么：目录分发如果不留痕，只会重复人工搜索并丢失哪些入口真正带来发现。*
- [ ] 保证每个高流量入口页都能在首屏把用户引到 quickstart、demo 或社区入口之一，而不是只停留在介绍层。
  *为什么：SEO 的价值不在“被搜到”，而在“被搜到之后能继续往下走”。*
- [ ] 定期跑一次 docs/landing 的 Lighthouse SEO 与坏链检查，把明显回归写入 `metrics/` 或 review 记录。
  *为什么：SEO 回归往往悄无声息；没有定期体检就只能等流量掉了才发现。*
- [ ] 为 GitHub README、docs 首页和分享卡片准备同一套 OG/preview 安全区与标题模板，避免目录、社交和搜索预览互相打架。
  *为什么：用户的第一次接触可能来自搜索，也可能来自聊天工具 unfurl，预览不一致会削弱点击意愿。*
- [ ] 把能公开复核的收录证据（awesome-list PR、目录页面、站点 meta 检查结果）归档到 `research/` 或 `metrics/`，缺证据就写 `UNVERIFIED`。
  *为什么：SEO 最容易被事后叙事污染，证据归档能防止“我们应该被收录了吧”式想当然。*
- [ ] 当需要付费工具（Ahrefs/SEMrush/Similarweb）才能得到的数据不可用时，在文档里显式标 `UNVERIFIED`，不要自行补写排名或流量结论。
  *为什么：工程规则明确要求 hard-fail，付费数据缺失不能被假数字掩盖。*

## 5. 反模式（≥3 条）
- ❌ 把 SEO 理解成“多塞关键词”，却不处理页面意图、信息结构和点击后的下一步。
  典型后果：页面也许被索引，但来的不是目标用户，跳出率和误解都更高。
- ❌ GitHub topics 追求越多越好，随意挂上所有热门标签。
  典型后果：发现面变广但精度下降，错误受众带来的负反馈会污染 issue 与讨论。
- ❌ 只盯着付费工具截图，不保存任何可公开复核的 meta、sitemap、awesome-list 或 Lighthouse 证据。
  典型后果：团队无法在无预算环境下复盘，也无法区分真实改进和展示层幻觉。
- ❌ 搜索摘要、社交卡片、README 首屏与 docs 首页各写各的定位。
  典型后果：用户从搜索点进来后发现承诺不一致，点击与转化都会流失。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| GitHub topics 精准度 | `gh api repos/{owner}/{repo} --jq '.topics'`，结合人工维护的关键词白名单比对 | 精准 topics ≥8，且无明显误导性泛标签 |
| Sitemap / robots / canonical 完备率 | `curl -sfL https://<docs-or-site>/sitemap.xml`、`curl -sfL https://<docs-or-site>/robots.txt`、`curl -sL https://<docs-or-site> | grep -Ei 'rel="canonical"|name="description"'` | sitemap、robots、canonical、description 4 项齐备 |
| 结构化预览元数据完备率 | `curl -sL https://<docs-or-site> | grep -Ei 'application/ld\+json|og:image|twitter:card'` | `og:image`、`twitter:card`、至少 1 个 JSON-LD 块同时存在 |
| Lighthouse SEO 分数 | `npx lighthouse https://<docs-or-site> --only-categories=seo --quiet --output=json` | SEO score ≥90，且关键入口页无明显回归 |
| awesome-list / 目录收录证据数 | `gh api search/code -f q='"<owner>/<repo>" awesome in:file language:Markdown' --jq '.total_count'` 或已归档提交 PR 列表 | 可复核收录/提交证据 ≥3；缺证据则显式 `UNVERIFIED` |

## 7. 工具与模板
- `tools/seo/topics-audit.*`：读取仓库 topics 与关键词白名单，输出过宽/缺失标签建议，并在 strict 模式下拒绝旧 8-dim 枚举漂移。
- `tools/seo/meta-check.*`：检查 title、description、canonical、OG/Twitter card 与 JSON-LD 是否齐备，只在失败时输出 `file/page + missing field`。
- `tools/seo/sitemap-lint.*`：校验 sitemap、robots、canonical 与站点索引入口是否一致，避免隐式坏链与重复页。
- `tools/seo/awesome-registry.*`：维护 awesome-list/目录提交清单、状态与 PR URL，缺证据时返回 `UNVERIFIED`。
- `tools/seo/lighthouse-runner.*`：按页面列表执行 Lighthouse SEO 检查，并把结果写入 `metrics/` 供后续趋势对比。
- `tools/seo/og-preview.*`：按 tagline、截图和安全区配置生成或校验 OG/Twitter card 资产，避免搜索与社交预览叙事分裂。
- `templates/seo/keyword-map.md`：关键词地图模板，固定品牌词、品类词、替代方案词、任务词和目标页面字段。
- `templates/seo/awesome-pr.md`：awesome-list 提交 PR 模板，预置项目简介、适用标签、证明链接与维护检查项。
- `templates/seo/og-card.json`：OG/Twitter card 配置模板，约束标题长度、安全区和主 CTA 文案，便于与 `tooling:lighthouse` 监测结果联动。
