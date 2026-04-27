# 00 — 仓库骨架决策

> Status: ratified-v0 · Owner: solution-architect · Date: 2026-04-27
> ⚠️ **§3「8 维度」已被 [`01-taxonomy.md`](./01-taxonomy.md) 的 6 域 × 37 叶子取代为 machine-canonical**
> 8-dim 标签仅作 playbook 用户导航入口保留；fm-indexer / scorecard / 路由的白名单以 `01-taxonomy.md` §3 为准。
> 详细映射见 [`03-canonical-mapping.md`](./03-canonical-mapping.md)。

## 1. 任务定位

`opensourceStar` 不是产品仓库，而是**开源项目优化方法论的工作底座**。最终交付物是一套可被复制使用的「8 维度评估卡 + playbook + 头部案例库 + 自动化工具」。

任何目录的存在都必须服务于其中之一；不服务的目录立即删除。

## 2. 顶层目录（最终方案）

| 目录            | 用途                                                | 主要写入者                |
|-----------------|---------------------------------------------------|--------------------------|
| `plans/`        | 架构与方法论决策（本类文档）                          | solution-architect       |
| `playbooks/`    | 8 维度可执行剧本，front-matter 元数据驱动              | implementer × 维度        |
| `benchmarks/`   | 评分卡 / rubric / 数据采集说明                        | solution-architect + qa  |
| `case-studies/` | 头部项目拆解（统一模板）                             | researcher + implementer |
| `templates/`    | 项目级模板（README / CONTRIBUTING / ISSUE…）          | implementer (后期)        |
| `research/`     | 原始研究输出（带来源 + 时间戳）                       | researcher                |
| `metrics/`      | 量化数据快照（star history / DL / Insights，时间序列） | researcher + tools        |
| `tools/`        | 自动化脚本（配置驱动，禁止硬编码）                     | implementer               |
| `_meta/`        | 已存在；保留给团队 metadata                           | master                    |

## 3. 八个评估维度（**已被 `01-taxonomy.md` 取代为 machine-canonical**；本节仅保留作 playbook 用户导航入口）

> ⚠️ fm-indexer / scorecard.config / Master 路由白名单 **必须** 读 `01-taxonomy.md` §3 的 37 叶子枚举，**禁止** 回退到下面 8 项作 fallback。
> 8 项与 6 域 × 37 叶子的映射见 [`03-canonical-mapping.md`](./03-canonical-mapping.md)。

1. **facade** — 门面：第一屏 README、demo gif、tagline、价值主张
2. **docs** — 文档：上手 60 秒、API ref、教程、API 一致性
3. **community** — 社区：issue 模板、Discussions、Discord/Slack、贡献者梯度
4. **release** — 发布：release notes、SemVer、changelog 自动化、cadence
5. **quality** — 质量：测试覆盖、CI、稳定性指标、回归预防
6. **growth** — 增长：典型用户路径、留存信号、Show HN/Twitter
7. **seo** — SEO/分发：站点 SEO、关键词、文档可搜索性、外链
8. **case-library** — 案例库：知名用户、生产部署、迁移故事

## 4. 元数据契约（front-matter，配置驱动）

所有 `playbooks/*.md` 与 `case-studies/*.md` 顶部必须含：

```yaml
---
id: facade-001              # 全局唯一
dimension: facade           # 8 维度之一
version: 0.1.0              # SemVer
status: draft|ratified|deprecated
last_verified_at: 2026-04-27
sources:                    # 关键来源 URL，可选但推荐
  - https://...
---
```

`tools/` 中的索引脚本会扫描 front-matter，生成 `STRUCTURE.md` 中的索引表。**禁止用 fallback 解析**：缺字段直接 hard-fail，便于早暴露漏写。

## 5. 拒绝的备选方案

| 候选          | 拒绝理由                                                                |
|---------------|-------------------------------------------------------------------------|
| `docs/`       | 与用户偏好冲突：核心方法论未闭合前不优先产出对外使用文档；保留 plans/ 即可 |
| `examples/`   | 由 `case-studies/` 完整覆盖；额外目录会造成职责重叠                       |
| `src/`        | 本仓库非产品代码仓；自动化脚本统一放在 `tools/`                           |
| `docs-site/`  | 静态站点是闭合后的下游工程，目前不在路径上                              |
| 按角色分目录   | 按"产物维度"组织远比按角色组织稳定，避免人员流动导致目录漂移              |

## 6. 验收信号

- [ ] 所有 8 个目录存在，且 README 单句说明用途
- [ ] `STRUCTURE.md` 索引在仓库根
- [ ] 本文档列出的 8 个维度与 `playbooks/` 文件名一一可映射（首次落地由后续任务完成）
- [ ] 配置驱动：front-matter schema 定义在本文档第 4 节，禁止隐式 fallback
