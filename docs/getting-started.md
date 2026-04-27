# Getting Started

> 目标：让第一次接触 `oss-scorecard` 的人，在 **1 分钟内** 跑出一个真实 GitHub repo 的六域评分结果。

## Hero：安装体验目标

我们要达到的产品级安装体验是：

```bash
curl -sfL https://oss-scorecard.dev/install.sh | bash
```

安装后直接：

```bash
oss-scorecard audit openclaw/openclaw
```

> 这条 builderbio-style 安装链路已经有本地脚本版本：`./install.sh`。在 repo checkout 场景下它会写入 `~/.local/bin/oss-scorecard`，公网域名版只差托管。

## 当前可用路径

```bash
git clone <this-repo>
cd oss-scorecard
./install.sh
oss-scorecard audit openclaw/openclaw
```

如果你不想安装 skill，或者还没把 `~/.local/bin` 加入 PATH，也可以直接走开发态命令：

```bash
gh auth status
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

## 你会得到什么

输入一个 GitHub 仓库：

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

输出：

- `facade / docs / community / quality / caselib / tooling` 六域分数
- 当前 repo 的基础快照（stars / forks / contributors / releases）
- Top recommendations（按优先级排序）

## 0. 运行前提

当前本地 install 会自动安装 CLI wrapper 到 `~/.local/bin/oss-scorecard`。

当前 bootstrap 版本依赖本机 `gh` 登录态：

```bash
gh auth status
```

如果这里失败，`audit` 会 **hard-fail**，不会假装给你一个分数。

> 设计原则：缺凭据、缺 API 能力、collector 失败，都算产品缺口，不允许 silent fallback。

## 1. 看帮助

```bash
node ./bin/oss-scorecard.mjs --help
```

你会看到 4 个入口：

- `audit`：对真实 GitHub repo 跑 bootstrap 评分
- `index`：校验仓库内 case-study / playbook front-matter
- `score`：旧版 case-study scorecard MVP
- `history`：列出可公开分享的历史资产

## 2. 跑第一次真实评分

### 最短命令

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw
```

### 终端输出示例

```text
openclaw/openclaw  (https://github.com/openclaw/openclaw)
captured_at: 2026-04-27T06:39:08.045Z
mode: bootstrap-v0  version: 0.1.0-bootstrap

facade:     5.0/5   ██████████
docs:       5.0/5   ██████████
community:  5.0/5   ██████████
quality:    5.0/5   ██████████
caselib:    4.0/5   ████████░░
tooling:    5.0/5   ██████████
TOTAL:      4.8/5     ██████████
```

## 3. 导出 JSON / Markdown

### JSON

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw \
  --format json \
  --json-out .tmp/openclaw.score.json
```

### Markdown

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw \
  --format markdown \
  --markdown-out .tmp/openclaw.score.md
```

### 同时导出两种格式

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw \
  --json-out .tmp/openclaw.score.json \
  --markdown-out .tmp/openclaw.score.md
```

## 4. 现在的评分边界

当前 `audit` 是 **bootstrap-v0**，已经能做的是：

- 读取真实 GitHub repo 快照
- 基于 README / topics / homepage / workflows / license / releases / contributors 等信号打 6 域启发式分
- 输出 top recommendations

还**没有完全实现**的是：

- 6 域 × 37 叶子正式 YAML rubric 机器执行
- 全量 case-study 阈值回放
- GitHub Action / badge service / compare report

所以今天的正确理解是：

> 这是一个**真实可跑的产品起点**，不是最终版评分引擎。

## 5. 这个仓库还有什么现实入口

### 结构化历史导出

```bash
node ./bin/oss-scorecard.mjs history
node ./bin/oss-scorecard.mjs history --format=json
```

### 仓库内容 schema 校验

```bash
node ./bin/oss-scorecard.mjs index --root .
```

### 旧版 case-study scorecard

```bash
node ./bin/oss-scorecard.mjs score --config tools/scorecard-run.config.json
```

## 6. 遇到失败怎么办

### 1）`gh auth status` 失败

先登录：

```bash
gh auth login
```

### 2）`audit` 提示 GitHub API / EOF / TLS 错误

当前 collector 已做有限重试；如果仍失败：

- 先重试一次命令
- 再检查 `gh auth status`
- 再确认本地网络/代理环境

### 3）输出分数看起来过高或过低

这是 bootstrap-v0 的正常现象。请直接查看：

- `packages/core/src/bootstrap-rules.ts`
- `packages/core/src/score.ts`

后续会逐步替换成 `benchmarks/*.md` 驱动的正式规则。

## 7. 下一步最自然的使用姿势

### 如果你是维护者
- 跑自己的 repo
- 看 Top recommendations
- 先做前三项高 ROI 修复

### 如果你是研究者
- 看 `case-studies/`
- 看 `research/tier1-comparison-matrix.md`
- 把样本观察回灌成规则

### 如果你是贡献者
- 去 `packages/core/` / `packages/collectors/`
- 补 collector、补规则、补 formatter、补 tests

## 8. 相关文件

- CLI 入口：`bin/oss-scorecard.mjs`
- audit 实现：`packages/cli/src/index.ts`
- GitHub snapshot collector：`packages/core/src/github.ts`
- bootstrap scorer：`packages/core/src/score.ts`
- research collector：`packages/collectors/src/github-repo.ts`
- 架构说明：`docs/architecture.md`
- 产品入口说明：`skills/oss-scorecard/USAGE.md`
