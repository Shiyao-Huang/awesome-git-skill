---
id: release-playbook-001
dimension: community
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
covers:
  - community:release
  - quality:semver
  - quality:ci-cd
  - tooling:release-bot
---

# release playbook

## 1. 维度定义
`release` 维度衡量项目能否把版本发布做成一条**可预测、可审计、可自动化、低回归**的公开节奏：用户知道什么时候升级、为什么升级、升级会不会炸，以及维护者如何稳定把变更送到用户手里。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库几乎不打 release/tag，或发布完全依赖 maintainer 手工口头通知；用户只能通过 commit 历史猜测发生了什么变化。 |
| 1 | 项目会偶尔发 release，但 tag 规则不一致、版本号不符合 SemVer、release notes 经常缺失，且没有稳定的发布入口或升级说明。 |
| 2 | 仓库已有 release 页面与 changelog，但发布时间高度随机；breaking change 识别不稳定，CI 与发布脚本脱节，出现问题时主要靠人工补救。 |
| 3 | 项目具备可重复的发布流程：tag、notes、artifact、至少一层 CI 校验齐全，版本号基本遵循 SemVer，并能区分 stable / beta / canary 中的一种，但节奏、回滚和自动化仍不够清晰。 |
| 4 | 项目明确维护 release cadence、SemVer 规则、升级提示和发布自动化链路；release notes 可追溯、CI 与 artifact 构建绑定，用户可以在公开页面快速判断是否该升级。 |
| 5 | 发布体系已经产品化：节奏稳定、版本语义清晰、beta/stable 通道分层、发布机器人与 CI 强绑定、notes/changelog/upgrade guide 同步产出，且回滚、dry-run、失败告警都有公开且可执行的规范。 |

## 3. 头部项目实践占位
- [ ] next.js: 待 case-study 填充
- [ ] n8n: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] langchain: 待 case-study 填充
- [ ] vscode: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 在仓库根或 docs 中写清唯一版本语义规则：什么算 patch、minor、major，什么情况必须显式标 breaking。
  *为什么：没有语义约束的版本号只是一串数字，用户无法据此做升级风险判断。*
- [ ] 为发布链路定义单一入口（如 tag push、release bot PR merge、changeset merge），禁止多人各自手工发版。
  *为什么：发布入口一旦分叉，notes、artifact 与 tag 很快就会出现双源真相。*
- [ ] 给每次 release 生成结构化 release notes，至少包含新增、修复、破坏性变更、迁移提示四类信息。
  *为什么：用户看 release 页的第一诉求不是“发生了很多事”，而是“哪些事会影响我”。*
- [ ] 为 breaking change 准备固定标记与升级提示模板（如 `BREAKING:`、migration guide 链接、deprecation 窗口）。
  *为什么：破坏性升级最怕埋在长 changelog 里，统一标记可以降低事故概率。*
- [ ] 把发布前校验拆成 dry-run 与正式发布两层，确保 changelog、版本号、artifact 命名、依赖锁文件都能先验证再落地。
  *为什么：很多发布事故来自流程脚本本身，而不是代码本体。dry-run 是最低成本的保险。*
- [ ] 为 stable / beta / canary（如适用）建立明确的通道边界和命名规则，不要让预发布与正式发布共用同一标签语义。
  *为什么：头部项目常常需要先给高意愿用户试水，通道不分层会把所有用户都拉进实验场。*
- [ ] 让 CI 明确覆盖发布前关键检查：构建、测试、打包、安装/升级 smoke、签名或 checksum 生成。
  *为什么：release 是风险最集中的时刻，不能只验证“代码能过单测”。*
- [ ] 为 artifact 命名、checksum、平台矩阵与下载地址定义固定规则，并在 release notes 中自动列出。
  *为什么：一旦 artifact 命名随人变化，自动化消费和故障排查都会变得脆弱。*
- [ ] 为发布失败、回滚、误发 tag、漏发 notes、错误 artifact 准备标准处置脚本或 runbook。
  *为什么：真正考验发布体系的不是成功时有多顺，而是失败时能否有序止损。*
- [ ] 把 changelog 生成、release notes 整理、tag 创建与包发布尽量自动化到 bot / workflow，而不是依赖 maintainer 记忆。
  *为什么：重复性高、格式要求固定的工作最适合自动化，否则最先退化的就是文档质量。*
- [ ] 为用户提供“我该不该升级”的信号：最新 stable 版本、最近 major 时间点、LTS/兼容窗口（如适用）。
  *为什么：发布不是只服务维护者，也要服务存量用户的升级决策。*
- [ ] 将发布节奏与社区沟通打通：在 release 页、CHANGELOG、docs 或 social announcement 中至少保证一个公开同步出口。
  *为什么：用户感知到的发布质量，不仅来自代码质量，也来自信息同步的及时性。*

## 5. 反模式（≥3 条）
- ❌ 用 git tag 代替完整 release notes，默认用户自己翻 commit。
  典型后果：升级成本转嫁给用户，breaking change 被淹没在提交噪音里。
- ❌ patch/minor/major 混着发，版本号与实际变更风险不一致。
  典型后果：用户失去对版本语义的信任，开始长期 pin 旧版本或拒绝及时升级。
- ❌ 发布前不做 dry-run，不验证 artifact、notes、安装路径，只在发完后人工检查。
  典型后果：一旦脚本或凭证出错，维护者会在公开事故中调试自己的发布系统。*
- ❌ beta / canary / stable 共用同一文案和标签习惯。
  典型后果：预发布风险误伤普通用户，或者稳定用户根本分不清哪些版本可以放心跟进。*
- ❌ changelog、release notes、docs 升级说明三套各写各的。
  典型后果：出现描述冲突时，用户无法判断哪个才是官方真相。*

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 发布中位间隔 | `gh api repos/{owner}/{repo}/releases?per_page=30` 后计算相邻 `published_at` 中位数 | 稳定项目通常应落在 1-30 天区间，且最近 10 次不应完全无规律漂移 |
| Release notes 完整率 | `gh api repos/{owner}/{repo}/releases --jq '[.[] | {tag_name, body}]'` | 最近 10 个 release 中 notes 缺失率 = 0 |
| 版本语义合规率 | `gh api repos/{owner}/{repo}/releases --jq '.[].tag_name'` + SemVer 正则校验 | 最近 10 个 tag 的 SemVer 合规率 = 100% |
| 发布流水线成功率 | GitHub Actions API `gh api repos/{owner}/{repo}/actions/runs?event=push` 或发布 workflow 运行结果 | 最近 20 次发布相关 workflow 成功率 ≥ 95% |
| 安装/升级 smoke 通过率 | 发布前或发布后 `install` / `upgrade` smoke workflow 日志 | 最近 10 次安装或升级 smoke 失败数 = 0 |

## 7. 工具与模板
- `tools/release/dry-run.*`：对版本号、notes、artifact、checksum、发布通道做 dry-run 预检。
- `tools/release/notes-generator.*`：从 changesets / conventional commits / release PR 生成结构化 release notes。
- `tools/release/semver-check.*`：校验 tag 与 changelog 中的破坏性变更标记是否一致。
- `tools/release/artifact-manifest.*`：统一生成各平台 artifact 清单、checksum 与下载表。
- `tools/release/rollback-runbook.md`：标准回滚步骤模板，记录误发 tag / artifact 损坏 / workflow 失败的处置路径。
- `templates/release-notes.md`：固定 release note 模板（新增 / 修复 / breaking / migration / deprecation）。
- `templates/migration-guide.md`：major release 升级指南模板，避免 breaking change 只出现在 changelog。
- `tools/release/channel-policy.json`：stable / beta / canary 通道配置，占位给后续自动化读取。
