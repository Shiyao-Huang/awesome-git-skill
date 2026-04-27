# OSS Scorecard Skill Usage

> 给想通过 **skill 入口** 使用 `oss-scorecard` 的人看的最短说明。

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
- 你只需要给一个 GitHub repo
- skill 会把 repo 审计结果组织成 6 域结论 + 改进建议

当前 skill 背后的现实能力来自：

- `bin/oss-scorecard.mjs audit`
- `packages/core/` bootstrap scorer
- `benchmarks/` + `playbooks/` + `case-studies/`

## 当前仓库态的等价运行方式

如果你在仓库开发态，推荐直接：

```bash
./install.sh
oss-scorecard audit openclaw/openclaw
```

如果你不想先安装 skill，也可以直接：

```bash
gh auth status
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

## 最推荐的提问方式

### 1. 做一次完整 repo 审计

```text
帮我用 oss-scorecard 审计 openclaw/openclaw，按 6 个域给出结果，并告诉我最值得先修的 3 件事。
```

### 2. 只看某一个域

```text
用 oss-scorecard 看一下 openclaw/openclaw 的 docs 和 community 两个域，指出最弱的地方。
```

### 3. 做对标

```text
用 oss-scorecard 评估这个 repo，并和 Tier-1 的 openclaw / everything-claude-code 做对比。
```

### 4. 从评分跳到改进动作

```text
先跑 oss-scorecard，然后把低分项映射到对应 playbook，给我一个 7 天改进清单。
```

## skill 的标准工作流

### Step 1 — 规范化目标

接受：

- `owner/repo`
- 完整 GitHub URL

都先转成：

```text
owner/repo
```

### Step 2 — 先跑可自动化部分

优先使用真实入口：

```bash
node ./bin/oss-scorecard.mjs audit <owner/repo>
```

如果需要原始 GitHub 轮廓数据：

```bash
node --experimental-strip-types packages/collectors/src/cli.ts <owner/repo>
```

### Step 3 — 把结果组织成 6 域

固定按这 6 个域表达：

1. `facade`
2. `docs`
3. `community`
4. `quality`
5. `caselib`
6. `tooling`

### Step 4 — 把低分项映射成动作

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
