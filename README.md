# awesome-git-skill

> Score real GitHub repos across 6 growth domains, using rules grounded in breakout open-source case studies.

```bash
curl -sfL https://oss-scorecard.dev/install.sh | bash
```

```bash
oss-scorecard audit openclaw/openclaw
```

```bash
oss-scorecard audit /absolute/path/to/private-or-unpublished-repo
```

```bash
openclaw/openclaw  (https://github.com/openclaw/openclaw)
captured_at: 2026-04-27T07:49:31.142Z
mode: bootstrap-v0  version: 0.1.0-bootstrap

facade:     5.0/5   ██████████
docs:       5.0/5   ██████████
community:  5.0/5   ██████████
quality:    5.0/5   ██████████
caselib:    4.0/5   ████████░░
tooling:    5.0/5   ██████████
TOTAL:      4.8/5   ██████████
```

Paste-and-go is the intended install UX: skill-first, zero-config, local-first.  
当前如果你是从 repo checkout 试用，也可以直接：

```bash
bash ./install.sh
```

## Hero

`awesome-git-skill` 是这个仓库的**公开仓库名 / 品牌名**，`oss-scorecard` 是当前 CLI 命令名。首屏承诺只有两件事：

1. **一行安装**：`curl -sfL https://oss-scorecard.dev/install.sh | bash`
2. **零配置审计**：`oss-scorecard audit owner/repo`（也支持 `owner/repo@branch` 与本地 worktree 路径）

> 当前本地 `./install.sh` 会在 repo checkout 场景下写入 `~/.local/bin/oss-scorecard` shim；公网 `install.sh` 上线后会对齐到同样的即装即用体验。

- **对外仓库 / 品牌名**：`awesome-git-skill`
- **CLI 命令名**：`oss-scorecard`
- **内部执行团队模板 / Legion 名**：`opensource-optimizer`
- **已发布 CorpsID**：`cmogou8fn000u1403dndkdicg`

这样命名的原因很简单：

- `awesome-git-skill` 负责 GitHub 传播与品牌记忆
- `oss-scorecard` 继续作为可执行 CLI / skill 命令名
- `opensource-optimizer` 继续作为 multi-agent 执行团队的名称存在于 genome-hub

## 这个仓库现在是什么

不是继续堆研究文档，而是把现有资产收敛成一个可运行的开源工具仓库：

1. **样本库**：`case-studies/`
2. **评分规则**：`benchmarks/`
3. **动作库**：`playbooks/`
4. **执行工具**：`tools/`
5. **公开历史**：`history/`

## Skill 入口（主入口）

如果用户更偏向 Claude Code / agent 形态，仓库已经有公开 skill 骨架：

- `skills/oss-scorecard/SKILL.md` — 6 域评分工作流
- `skills/oss-scorecard/USAGE.md` — 最短使用说明与提示词示例
- `skills/oss-scorecard/agents/openai.yaml` — skill UI 元数据
- `skills/oss-scorecard/references/asset-map.md` — benchmark / playbook / case-study 映射

Skill-first，CLI/core 作为底层引擎继续演进；Legion + Agents 作为 genome-hub 组织资产层继续保留。


## 研究如何变成可用资产

这个仓库不是把研究结果原样堆出来，而是把研究分解成 5 类可复用资产：

1. **Case studies → 数据样本**：`case-studies/` + `research/` + `benchmarks/case-anchors.yaml`
2. **Benchmarks → 评分规则**：`benchmarks/` + `packages/core/src/bootstrap-rules.ts`
3. **Playbooks → 改进动作库**：`playbooks/`（包括 `playbooks/quick-wins.md`）
4. **Tools / Core / CLI → 可执行产品**：`packages/core/`、`packages/cli/`、`bin/oss-scorecard.mjs`
5. **History / Legion / Agents → 可分享 provenance**：`history/` + `skills/` + 已发布 `opensource-optimizer` Legion

也就是说：**研究本身已经被产品化成一个开源项目**。今天它不只是结论文档，而是一个能安装、能审计真实仓库、能给出改进建议的 `oss-scorecard`。

## 当前真实能力

当前已经可用的不是“想象中的 npm install”，而是下面这些现实入口：

```bash
node ./bin/oss-scorecard.mjs --help
node ./bin/oss-scorecard.mjs audit openclaw/openclaw --format json
node ./bin/oss-scorecard.mjs audit /absolute/path/to/private-repo --format json
node ./bin/oss-scorecard.mjs score openclaw/openclaw > metrics/openclaw.score.json
node ./bin/oss-scorecard.mjs history
node ./bin/oss-scorecard.mjs index --root .
node ./bin/oss-scorecard.mjs score --legacy --config tools/scorecard-run.config.json
node tools/index.ts --root .
node tools/scorecard-run.ts --config tools/scorecard-run.config.json
npm --prefix tools test
```

首次上手建议直接看：

- `docs/getting-started.md`
- `skills/oss-scorecard/USAGE.md`

- `bin/oss-scorecard.mjs`：仓库级 CLI 壳，统一暴露 `audit / history / index / score`
- `packages/cli/`：真实 repo audit CLI 实现（由根 `bin/` 转发）
- `tools/index.ts`：严格校验 `case-studies/` 与 `playbooks/` front-matter
- `packages/core/`：6 域 repo scoring engine，输出 machine-readable `ScoreReport` + evidence trail
- `tools/scorecard-run.ts`：旧版 case-study scorecard MVP（通过 `score --legacy` 保留）
- `case-studies/`：已收敛出 Tier-1 2–6 月爆发样本

## 目标产品面

这个仓库默认往 4 个产品入口收敛：

1. **Skill**：`skills/oss-scorecard/`，适合 Claude Code / agent 工作流直接调用
2. **CLI**：`oss-scorecard <repo>`
3. **GitHub Action**：对真实仓库做持续评分与硬校验
4. **Public Dataset**：爆发项目案例库与对比矩阵

## 历史记录怎么公开

不公开高噪音原始聊天流；公开**结构化、可复查、可复用**的执行历史。

见：[`history/README.md`](history/README.md)

目前默认公开：
- `history/timeline-2026-04-27.json`
- `history/team-roster-2026-04-27.json`
- `history/task-summary-2026-04-27.json`
- `history/task-ledger.jsonl`
- `history/decision-log.md`

## 下一步默认方向

1. 继续增强真实 GitHub repo / branch 的 `score` 路径（更多 signals / richer evidence / compare）
2. 把 benchmark / playbook 规则继续机器可执行化
3. 给 CLI 增加可分享输出（badge / markdown report / compare）
4. 继续扩 Tier-2 样本，但不让文档工作抢主线功能
