---
id: docs-playbook-001
dimension: docs
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# docs playbook

## 1. 维度定义
`docs` 维度衡量一个项目是否能让新用户从“装上”到“跑通第一个有价值的例子”稳定地在 60 秒级路径内完成，并继续沿着 quickstart、教程、API reference、故障排查、i18n、examples 六条轨道自助深入，而不是在 README、命令、版本或文档结构里迷路。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库没有可执行的安装/启动步骤，或默认路径在当前主分支上直接失败；访客必须翻 issue/聊天记录才能知道第一条命令。 |
| 1 | 有安装步骤，但缺少版本前提、操作系统差异或环境变量说明；首次运行经常卡在依赖/权限/路径错误，且无 try-online 替代路径。 |
| 2 | Quickstart 能跑通静态 hello world，但缺少“第一个有价值结果”定义；教程、API reference、故障排查彼此割裂，用户需要自行猜测下一步。 |
| 3 | 默认 quickstart 在新机器上可重复跑通，文档明确区分 install / first-run / next-step，并至少提供 1 个完整教程与 1 个故障排查入口，但 API reference 或 examples 覆盖仍不完整。 |
| 4 | 项目提供 60 秒级 first-run、在线 sandbox/托管试用或无本地安装替代路径，教程按难度梯度组织，API reference 与源码版本同步，常见错误有可检索的解决入口。 |
| 5 | 新用户可在 60 秒内跑通 demo 并看到明确价值结果；同时具备在线体验、≥3 个难度梯度教程、可搜索 API reference、examples 画廊、i18n 关键页面与可执行故障排查，且关键路径通过自动化检查持续防回归。 |

## 3. 头部项目实践占位
- [ ] next.js: 待 case-study 填充
- [ ] vscode: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] langchain: 待 case-study 填充
- [ ] shadcn-ui: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 把默认 quickstart 收敛成一条“复制即跑”的主路径，并在首段直接给出唯一推荐入口。
  *为什么：新用户第一分钟最怕分叉；主路径越唯一，完成率越高。*
- [ ] 为 install 步骤显式写出最低版本前提（Node/Python/Go/Rust、包管理器、系统要求）和验证命令。
  *为什么：把环境前置写清楚，能减少“装上了但版本不对”的隐形失败。*
- [ ] 在 first-run 章节定义“第一个有价值结果”截图或终端输出，而不是只展示服务成功启动。
  *为什么：用户要验证自己真的获得了价值，不只是看到进程在跑。*
- [ ] 提供 try-online / sandbox / hosted demo 路径，并明确它与本地安装路径的差异和限制。
  *为什么：零安装体验能降低试用门槛，也能帮助用户先确认项目价值。*
- [ ] 将文档路径拆成 `[docs:quickstart]`、`[docs:tutorial]`、`[docs:api-ref]`、`[docs:troubleshoot]`、`[docs:i18n]`、`[docs:examples]` 六类稳定入口。
  *为什么：用户问题类型不同，稳定信息架构比长篇 README 更可导航。*
- [ ] 至少提供 3 层教程梯度：5 分钟入门、30 分钟实战、生产级集成。
  *为什么：只有单层教程会让新手和进阶用户都找不到合适入口。*
- [ ] 给每个代码片段标注适用版本、运行前置和预期输出，并为可执行片段加入自动校验钩子。
  *为什么：snippet 过时是文档失真的高频来源，必须在 CI 中暴露。*
- [ ] 建立 API reference 与源码/Schema/OpenAPI 的单一生成链路，避免手写双份真相。
  *为什么：API 文档一旦靠人工同步，漂移几乎必然发生。*
- [ ] 为高频错误建立按症状检索的 troubleshooting 索引，而不是只写“常见问题”散文。
  *为什么：用户通常带着错误信息来搜索，症状索引比泛 FAQ 更可命中。*
- [ ] 为 examples 画廊标注适用人群、依赖成本、预期结果和跳转到教程/API reference 的关系。
  *为什么：示例只有在帮助用户选路时才真正减少认知负担。*
- [ ] 为关键 quickstart 页面提供至少一门非英语镜像或术语对照表，并标注翻译更新时间。
  *为什么：国际用户最常卡在术语理解和过期翻译，而不是功能本身。*
- [ ] 在 docs CI 中加入死链、锚点、snippet freshness 与 first-run smoke 测试。
  *为什么：没有自动化门禁，文档回归会比代码回归更晚暴露。*

## 5. 反模式（≥3 条）
- ❌ 把安装方式、云端试用、源码开发、生产部署全部堆在同一屏首段。
  典型后果：用户无法判断哪条是默认路径，首分钟决策成本暴涨。
- ❌ quickstart 只写“启动成功”而不定义第一个有价值结果。
  典型后果：用户即使命令跑通，也无法确认项目到底解决了什么问题。
- ❌ API reference、教程、examples 各自维护一套术语与版本前提。
  典型后果：搜索命中后仍要来回跳转校对，文档可信度快速下降。
- ❌ 故障排查只写“如有问题请进群/提 issue”。
  典型后果：支持成本转嫁给社区，新用户在公开渠道留下“文档不可用”的第一印象。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 首次跑通耗时（p50） | `hyperfine --warmup 1 '<project quickstart command>'` 或 CI smoke 命令计时日志 | 默认 quickstart 路径 p50 ≤ 60s |
| 文档死链率 | `npx lychee --no-progress README.md docs/ <docs-site-url>` | 默认分支 0 死链 |
| 示例片段新鲜度失败数 | `npx markdown-code-runner` / `pytest --doctest-glob='*.md'` / 等价 snippet 校验命令 | 关键 quickstart/API 片段失败数 = 0 |
| 搜索零结果率 | Algolia DocSearch / 站内搜索分析 API 或 dashboard | 零结果查询占比 < 15% |
| API reference 漂移率 | `openapi-diff old.yaml new.yaml`、`typedoc --json`、或源码导出与文档索引比对命令 | 阻塞级漂移 = 0 |

## 7. 工具与模板
- `tools/docs/quickstart-smoke.*`：对 install / first-run / try-online 关键路径做 smoke 校验，并输出低噪音耗时日志。
- `tools/docs/link-check.*`：统一封装死链、锚点、重定向检查，供 CI 与本地复用。
- `tools/docs/snippet-verify.*`：验证 markdown 代码片段是否仍能在当前版本执行。
- `tools/docs/api-sync.*`：检查 API reference 是否由单一生成链路产出，发现手写漂移即 hard-fail。
- `tools/docs/search-audit.*`：汇总站内搜索零结果词与失败路径，反推 troubleshooting / examples 缺口。
- `templates/docs/quickstart.md`：Quickstart 页面模板，预置前置条件、验证命令、预期输出与回滚说明。
- `templates/docs/tutorial.md`：教程模板，固定写法包含目标、前提、步骤、校验点、下一步。
- docs site 选型矩阵（Docusaurus / Nextra / Mintlify）先保留为配置驱动占位，待后续专门决策卡落地。
