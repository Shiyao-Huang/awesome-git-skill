# OSS Scorecard Skill Usage

> 仓库品牌名 `awesome-git-skill`，skill / CLI 命令名 `oss-scorecard`。给想通过 **skill 入口** 使用它的人看的最短说明。

## Hero：我们要的安装/分发体验

目标形态：

```bash
curl -sfL https://oss-scorecard.dev/install.sh | bash
```

然后直接：

```text
帮我用 oss-scorecard 审计 openclaw/openclaw，并给出最值得先做的 3 个改进动作。
```

> 这条公开安装链路已经有本地脚本版本：`./install.sh`；在 repo checkout 场景下它会额外写入 `~/.local/bin/oss-scorecard`，公网域名版只差托管。

## 这是什么

`oss-scorecard` 更适合作为一个 **skill-first 产品** 被使用：

- 你不需要先理解整个仓库
- 你可以给一个 GitHub repo，或更好地给一个本地 worktree / 私有仓库路径
- skill 会优先读真实代码、文档、测试、workflow，再组织成 6 域结论 + 改进建议

当前 skill 背后的现实能力来自：

- `bin/oss-scorecard.mjs audit`（公开 quick baseline）
- `packages/core/` bootstrap scorer
- `benchmarks/` + `playbooks/` + `case-studies/` + `research/FINDINGS.md` + `benchmarks/case-anchors.yaml`

## 当前仓库态的等价运行方式

> 当前最有价值的用法不是只跑 public surface score，而是结合本地代码做深度审计。只要能给本地路径，就优先给本地路径。


如果你在仓库开发态，推荐直接：

```bash
./install.sh
~/.local/bin/oss-scorecard audit openclaw/openclaw
```

如果你的 `PATH` 已包含 `~/.local/bin`，也可以直接用 `oss-scorecard audit openclaw/openclaw`。

如果你不想先安装 skill，也可以直接：

```bash
gh auth status
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

## 最推荐的提问方式

### 1. 做一次完整 repo 深度审计（推荐）

```text
帮我用 oss-scorecard 深度审计这个项目，优先读代码、文档、测试和 workflow，判断它的目标用户、当前阶段、内部工程成熟度和对外开源 readiness，然后给出最值得先做的 3 件事。
```

### 2. 审计私有仓库 / 本地 worktree

```text
帮我用 oss-scorecard 审计这个本地 worktree：/path/to/repo。不要只看表面文件，要从代码、目标、受众、阶段和可用性角度分析。
```

### 3. 只看某一个域

```text
用 oss-scorecard 看一下 openclaw/openclaw 的 docs 和 community 两个域，指出最弱的地方。
```

### 4. 做对标

```text
用 oss-scorecard 评估这个 repo，并和 Tier-1 的 openclaw / everything-claude-code 做对比。
```

### 5. 从评分跳到改进动作

```text
先跑 oss-scorecard，然后把低分项映射到对应 playbook，给我一个 7 天改进清单。
```

## skill 的标准工作流

### Step 1 — 规范化目标

接受：

- 本地路径
- `owner/repo`
- `owner/repo@branch`
- 完整 GitHub URL（含 `/tree/<branch>` 也可）

如果本地路径可用，优先本地路径。

### Step 2 — 先判断是 deep 还是 quick

- **deep**：本地代码 / 私有仓库 / 未发布分支 / 需要真实代码分析
- **quick**：只有公开 GitHub URL，且只需要快速 baseline

### Step 3 — 先读真实项目，再跑自动化补证

公开 quick baseline 仍可用：

```bash
node ./bin/oss-scorecard.mjs audit <owner/repo[@ref]>
```

如果需要原始 GitHub 轮廓数据：

```bash
node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo>
```

同时应主动读：README、package manifests、workspace 结构、测试、workflow、贡献文档、examples。

### Step 4 — 把结果组织成 6 域

固定按这 6 个域表达：

1. `facade`
2. `docs`
3. `community`
4. `quality`
5. `caselib`
6. `tooling`

### Step 5 — 把低分项映射成动作

不要只说“这里不太好”。  
必须继续映射到：

- `playbooks/`
- `templates/`
- `case-studies/`

最终输出应至少包含：

1. strongest domains
2. weakest domains
3. top 3 gaps
4. top 3 fixes
5. evidence list

## 当前 skill 的现实边界

### 已自动化

- repo 基础快照
- 6 域 bootstrap 评分
- Top recommendations
- JSON / Markdown / terminal 输出

### 尚未完全自动化

- 6 域 × 37 叶子正式 rubric 全量执行
- 全部 case-study 阈值机器回放
- GitHub Action / badge service

因此，当前 skill 的正确口径是：

> **自动化优先，缺覆盖就明确说“未自动化/需人工补证”，绝不伪造分数。**

## 推荐输出模板

### 简版

```text
目标 repo: openclaw/openclaw
时间: 2026-04-27

6 域评分:
- facade: 5.0/5
- docs: 5.0/5
- community: 5.0/5
- quality: 5.0/5
- caselib: 4.0/5
- tooling: 5.0/5

Top 3 gaps:
1. ...
2. ...
3. ...

Top 3 fixes:
1. ...
2. ...
3. ...
```

### 完整版

```text
1. Repo 基础快照
2. 六域逐项分析
3. strongest / weakest
4. evidence list
5. 对应 playbooks
6. 对标 case-studies
7. 下一轮建议
```

## 什么时候该 hard-fail

以下情况不要假装完成：

1. `gh` 未登录 / collector 取不到数据
2. repo 目标无法规范化
3. 关键 evidence 缺失
4. 需要自动化分数，但当前实现根本没有覆盖该维度

这时应该直接说：

```text
当前自动化链路无法完成这一步，原因是……
```

而不是编一个数字出来。

## 和 Legion / Agents 的关系

`oss-scorecard` skill 是个人可直接用的入口。  
`opensource-optimizer` Legion 与 5 个 AgentImages 是团队执行层。

关系如下：

- **Skill**：问一句话就能审计 repo
- **CLI**：适合脚本化/批量化
- **Agents**：适合做深入改造
- **Legion**：适合组织级持续执行

## 最短可复现路径

### 人工命令版

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

### 自然语言版

```text
帮我用 oss-scorecard 审计 openclaw/openclaw，并给出最值得先做的 3 个改进动作。
```

## 相关文件

- Skill 定义：`skills/oss-scorecard/SKILL.md`
- 资产映射：`skills/oss-scorecard/references/asset-map.md`
- CLI 入口：`bin/oss-scorecard.mjs`
- Getting Started：`docs/getting-started.md`
