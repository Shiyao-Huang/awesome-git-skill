# 01 — 100K Star 优化领域分类法 (Taxonomy v0)

> Status: ratified-v0.1 · Owner: solution-architect · Reviewer: master + researcher · Date: 2026-04-27
> **Supersedes**: [`00-repo-skeleton.md`](./00-repo-skeleton.md) §3（"8 维度"列表仅作 playbook 用户导航标签保留，machine-canonical 以本文件为准）
> 详细 8↔6 映射见 [`03-canonical-mapping.md`](./03-canonical-mapping.md)
> 下游：scorecard (`02-scorecard.md`)、benchmarks/_schema.md、tools/fm-indexer、case-study 对比矩阵 (researcher)
> v0.1 变更：基于 researcher 回测加 `[docs:site-stack]`（共 36→37 叶子）

## 0. 设计原则

- **MECE**：6 个顶层域不重叠、不遗漏；任何重叠子项必须合并到其中之一。
- **Feature-flag 化**：每个叶子可独立启用/禁用，不互相依赖；reading 路径线性（一个项目可以只做"门面"也能受益）。
- **可路由**：每个叶子有稳定标签 `[域:子项]`，作为后续 task 标题的前缀，便于 Master 路由与统计。
- **可量化**：每个叶子至少有 1 个观测指标（与 scorecard 锚定）。
- **配置驱动**：playbook front-matter 的 `dimension:`、`subitem:` 字段必须取值于本文件白名单。索引器对越界值 hard-fail。

## 1. 顶层 6 域

| Code | 域                          | 一句话                                                | 主要产物形态                  |
|------|-----------------------------|------------------------------------------------------|-----------------------------|
| `facade`     | 门面 / 第一印象              | 30 秒内让访客知道是什么、给谁、为什么                    | playbook + template          |
| `docs`       | 文档与上手                   | 让新用户在 5 分钟跑通第一个有价值场景                   | playbook + template          |
| `community`  | 社区与增长                   | 把流量沉淀为 issue / PR / 留存用户                      | playbook + template + tool   |
| `quality`    | 代码与发布质量               | 让"越用越稳"成为可观测事实                              | playbook + benchmark + tool  |
| `caselib`    | 案例库与基准                 | 用横向对比与数据为方法论提供实证                        | case-study + benchmark       |
| `tooling`    | 工程效率工具                 | 把 playbook 自动化掉，降低人力成本                      | tool                         |

> 拒绝合并的争议：`growth` 不独立成顶层，因为其手段（issue 模板、release 节奏、HN 发布、SEO）已与 community 的运营动作强耦合，分开会造成跨域产物。`security` 不独立成顶层，归并到 `quality.security`，与 CI/CD 同生命周期。

## 2. 二级子项（叶子全表）

### 2.1 facade — 门面 / 第一印象
| 子项标签            | 典型产物                           | 负责角色          | 关键指标                                    |
|---------------------|----------------------------------|------------------|--------------------------------------------|
| `[facade:hero]`     | README hero (logo + tagline + CTA) | implementer      | 首屏 CTR、tagline 一句话理解率              |
| `[facade:badges]`   | 徽章规范（CI/版本/社区/性能）      | implementer      | 徽章数量与有效性（不挂死链）                 |
| `[facade:demo]`     | 30 秒 GIF / 短视频 / 在线 playground | implementer + qa | demo 加载时间、playground 跳出率            |
| `[facade:social]`   | OG image / Twitter card 模板        | implementer      | 社交分享首图渲染合格率                       |
| `[facade:tagline]`  | 一句话价值主张 + 目标用户语料库      | researcher       | 不同受众文案的 hero CTR A/B                 |

### 2.2 docs — 文档与上手
| 子项标签              | 典型产物                              | 负责角色         | 关键指标                                     |
|-----------------------|--------------------------------------|------------------|---------------------------------------------|
| `[docs:quickstart]`   | 5 分钟跑通模板 + 复制粘贴可执行片段     | implementer      | 完成率（埋点/用户访谈）、首次成功命令次数     |
| `[docs:tutorial]`     | 端到端教程（≥1 个完整场景）            | implementer      | 完成深度、章节流失率                          |
| `[docs:api-ref]`      | 自动生成 API 文档 + 一致性 lint        | implementer + qa | 覆盖率、与源码漂移率                          |
| `[docs:troubleshoot]` | FAQ / 错误代码索引                     | researcher       | search hit / issue 重复率下降                 |
| `[docs:i18n]`         | 至少 EN + 1 关键地区语言               | implementer      | 翻译同步延迟、非英语流量占比                  |
| `[docs:examples]`     | 示例画廊（cookbook 模式）              | implementer      | clone / 引用次数                              |
| `[docs:site-stack]`   | 文档站技术栈选型（Nextra/Mintlify/Starlight/Docusaurus 等） | architect + implementer | 选型决策可复现 / 站点 build 时间 / Lighthouse |

### 2.3 community — 社区与增长
| 子项标签                  | 典型产物                              | 负责角色             | 关键指标                                     |
|---------------------------|--------------------------------------|---------------------|---------------------------------------------|
| `[community:issue-tpl]`   | Issue 模板 + 自动分类机器人            | implementer          | 模板使用率、首响应时间                       |
| `[community:pr-tpl]`      | PR 模板 + DCO/CLA 流程                 | implementer          | PR 合并时长、首贡献者比例                    |
| `[community:discussions]` | Discussions/Discord/论坛分流策略       | implementer          | 周活、提问解决率                             |
| `[community:funnel]`      | 贡献者漏斗（star→fork→issue→PR→core）  | researcher           | 各阶梯转化率                                 |
| `[community:release]`     | 发布节奏（cadence + release notes 风格）| implementer          | release 间隔稳定性、release 阅读率           |
| `[community:launch]`      | HN / Twitter / Reddit launch playbook   | implementer          | launch 当日 star 增量与留存                  |
| `[community:seo]`         | 文档 SEO + 关键词布局 + 外链策略        | implementer + tooling| 关键词排名、organic 流量                     |
| `[community:social]`      | 社交账号矩阵（Twitter/B站/YouTube）      | implementer          | 渠道粉丝增量、同源转化                       |

### 2.4 quality — 代码与发布质量
| 子项标签                    | 典型产物                              | 负责角色             | 关键指标                                     |
|-----------------------------|--------------------------------------|---------------------|---------------------------------------------|
| `[quality:perf-baseline]`   | 性能基线 + 回归告警                    | qa + tooling         | p95 延迟回归 < 5%                            |
| `[quality:ci-cd]`           | CI 矩阵（OS×版本）+ 自动发布           | implementer          | CI 红绿率、发布耗时                          |
| `[quality:semver]`          | SemVer + Changelog 自动化              | implementer          | 破坏性变更预告率                             |
| `[quality:security]`        | SECURITY.md + SBOM + 依赖扫描          | qa                   | 漏洞响应中位时间                             |
| `[quality:test-coverage]`   | 单元 + 集成 + e2e 矩阵                 | qa                   | 覆盖率、关键路径回归                         |
| `[quality:dx]`              | 内部 DX 工具（pre-commit / lint /类检查）| implementer          | 本地反馈循环时长                             |

### 2.5 caselib — 案例库与基准
| 子项标签                | 典型产物                                       | 负责角色             | 关键指标                                     |
|-------------------------|----------------------------------------------|---------------------|---------------------------------------------|
| `[caselib:head]`        | 头部项目深度拆解（VSCode/ollama/Next.js/...）   | researcher           | 拆解维度覆盖度（≥10 维度对齐）              |
| `[caselib:scorecard]`   | 8/6 域分数化评估卡 + 历史快照                  | architect + qa       | scorecard 一致性、复现率                     |
| `[caselib:h2h]`         | 同赛道头对头比较（如 Tauri vs Electron）        | researcher           | 决策树清晰度                                 |
| `[caselib:metrics]`     | star history / DL / Insights dashboard         | tooling + researcher | 数据时效（< 7d）                              |
| `[caselib:adoption]`    | 知名用户/落地故事                              | researcher           | 公开背书数量与质量                           |

### 2.6 tooling — 工程效率工具
| 子项标签                  | 典型产物                              | 负责角色             | 关键指标                                     |
|---------------------------|--------------------------------------|---------------------|---------------------------------------------|
| `[tooling:scorecard-run]` | scorecard 自动跑分脚本                  | implementer          | 跑分耗时、配置覆盖率                         |
| `[tooling:social-gen]`    | OG/Twitter 图自动生成器                 | implementer          | 渲染成功率                                   |
| `[tooling:lighthouse]`    | 文档站 Lighthouse 监控                  | implementer          | perf/seo 分数趋势                            |
| `[tooling:release-bot]`   | release-please / changesets 集成        | implementer          | 自动 release 通过率                          |
| `[tooling:metrics-fetch]` | metrics 抓取 cron + 时间序列存储        | implementer          | 抓取成功率、缺数据 hard-fail                 |
| `[tooling:fm-indexer]`    | front-matter 索引（缺字段 hard-fail）   | implementer          | 索引时间、违规检出率                         |

## 3. 标签清单（Master 路由用）

后续 task 标题前缀 **必须** 来自这个枚举：

```
[facade:hero] [facade:badges] [facade:demo] [facade:social] [facade:tagline]
[docs:quickstart] [docs:tutorial] [docs:api-ref] [docs:troubleshoot] [docs:i18n] [docs:examples] [docs:site-stack]
[community:issue-tpl] [community:pr-tpl] [community:discussions] [community:funnel]
[community:release] [community:launch] [community:seo] [community:social]
[quality:perf-baseline] [quality:ci-cd] [quality:semver] [quality:security]
[quality:test-coverage] [quality:dx]
[caselib:head] [caselib:scorecard] [caselib:h2h] [caselib:metrics] [caselib:adoption]
[tooling:scorecard-run] [tooling:social-gen] [tooling:lighthouse] [tooling:release-bot]
[tooling:metrics-fetch] [tooling:fm-indexer]
```

工程化要求：`tools/fm-indexer` 在解析 playbook front-matter 时，`dimension`/`subitem` 必须命中本表，否则 hard-fail（不允许 fallback 到 "uncategorized"）。

## 4. 与下游的对齐点

- **scorecard (`mUT5mmeZjWhN`)**：6 顶层域 → 6 个评分模块；每个叶子至少贡献 1 个观测指标，避免域内空洞。
- **case-studies (researcher)**：拆解模板的 10+ 维度需要在标签清单中找得到对应叶子；如出现新维度未覆盖，先回此文件加叶子，再启动 case-study。
- **playbooks/<dim>/<subitem>.md**：默认目录布局；front-matter `id` 与 `[域:子项]` 一致（如 `id: facade-hero`）。

## 5. 验收信号

- [x] 顶层 6 域 + 36 个叶子 ≤3 层
- [x] 每个叶子有：产物 / 角色 / 指标
- [x] 标签清单存在且与 fm-indexer 对接
- [ ] researcher 反馈 ≥10 case-study 维度可被本表覆盖（待联调）
- [ ] master 验收并据此发起 ≥30 个 implementer 子任务

## 6. 已知缺口（v0 不解
）

- 法律/许可证（License/Trademark）暂归 `quality:security`，若后续法务工作量爆发可独立成域。
- 商业化路径（Open Core / SaaS / Sponsorship）未纳入本表 —— 与 100K star 主线弱相关，后续若纳入将作为第 7 域 `commercial` 单独提案，不挤占现有 6 域。
