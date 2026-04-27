# oss-scorecard — 仓库结构索引

> 当前工作仓库历史名为 `opensourceStar`；对外产品/仓库名统一为 **`oss-scorecard`**，内部执行团队/Legion 名保留为 **`opensource-optimizer`**。

## 顶层目录

| 目录 | 用途（一句话） |
|---|---|
| [skills/](./skills/) | 直接使用入口（skill-first） |
| [agents/](./agents/) | genome-hub AgentImage 资产说明 |
| [legion/](./legion/) | genome-hub LegionImage 资产说明 |
| [plans/](./plans/) | 架构与方法论决策文档 |
| [playbooks/](./playbooks/) | 可执行剧本与修复动作来源 |
| [benchmarks/](./benchmarks/) | 评分卡 / rubric / 数据采集口径 |
| [case-studies/](./case-studies/) | 真实项目样本拆解（统一模板） |
| [research/](./research/) | 原始研究输出（带来源 + 时间戳） |
| [metrics/](./metrics/) | 量化数据快照（时间序列） |
| [tools/](./tools/) | 自动化脚本（配置驱动） |
| [history/](./history/) | 对外公开的精炼历史记录 |
| [templates/](./templates/) | 可复用模板 |
| `_meta/` | 团队内部 metadata |

## 资产层次

### 1. Skill
给个人用户和 Claude Code / agent 工作流直接用。

### 2. Agents
给进阶用户复用单角色能力。

### 3. Legion
给团队/组织复用完整协作模板。

### 4. Repo Assets
给外界公开规则、案例、模板、数据和历史。

## 6 个评估顶层域

`facade` · `docs` · `community` · `quality` · `caselib` · `tooling`

完整 37 个叶子标签与产物/角色/指标见 [`plans/01-taxonomy.md`](./plans/01-taxonomy.md)。

## 关键文档

- [`README.md`](./README.md) — 对外产品入口说明
- [`plans/legion-spec.md`](./plans/legion-spec.md) — Legion canonical spec
- [`plans/legion-publish-log.md`](./plans/legion-publish-log.md) — 发布对账
- [`history/README.md`](./history/README.md) — 历史公开策略
- [`benchmarks/_schema.md`](./benchmarks/_schema.md) — Signal / rubric schema
- [`templates/case-study.md`](./templates/case-study.md) — 案例模板契约

## 元数据契约

所有 playbook / case-study 必须含 YAML front-matter；索引脚本对缺字段 **hard-fail**，禁止 fallback。
