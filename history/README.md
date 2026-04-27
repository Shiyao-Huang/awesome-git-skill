# History Sharing Policy

这部分解决的是：

> 历史 team / task 记录，到底怎么公开，才有价值又不变成噪音？

我的选择是：**公开结构化历史，不公开原始高噪音聊天流。**

## 为什么不用原始群聊当公开资产

因为原始群聊会天然混入：
- 重复 ack
- 中间误判
- stale / phantom task 噪音
- 凭据与运行时细节
- 对后来者没有复用价值的思路流

如果直接倾倒，对外只会让项目显得混乱，而不是专业。

## 默认公开的 5 类历史资产

### 1. Timeline
面向外部读者：看这一天/这一波到底做成了什么。

文件：`timeline-YYYY-MM-DD.json`

### 2. Team Roster
面向研究者/协作者：看这一波由哪些角色组成、怎么分工。

文件：`team-roster-YYYY-MM-DD.json`

### 3. Task Summary
面向普通贡献者：看代表性任务与交付物，不必读全量流水。

文件：`task-summary-YYYY-MM-DD.json`

### 4. Task Ledger
面向机器与审计：用 JSONL 做可追加、可筛选、可扩展的任务台账。

文件：`task-ledger.jsonl`

### 5. Decision Log
面向后来者：只记录真正改变路径的决策，而不是所有讨论。

文件：`decision-log.md`

## 不公开什么

### 1. 原始高噪音群聊
默认不公开；只有在某个里程碑必须保留语境时，才摘录**脱敏片段**。

### 2. secret / key / env 细节
无论是否已失效，一律不进入公开仓库。

### 3. 无结果的思路流
没有形成任务、产物、验证结果的内容，不作为公开默认资产。

## 当前这个仓库的公开策略

- **公开产品名**：`oss-scorecard`
- **公开执行团队名**：`opensource-optimizer`
- **公开形式**：timeline + roster + task summary + task ledger + decision log
- **不公开形式**：原始 full chat transcript

## 如果以后需要分享更细的执行细节

推荐顺序：

1. 先补 `task-ledger.jsonl`
2. 再补 `task-summary-YYYY-MM-DD.json`
3. 必要时才补 `wave-*.md` 复盘
4. 最后才做**脱敏摘录**，而不是原样导出聊天记录

## 当前首批公开文件

- `timeline-2026-04-27.json`
- `team-roster-2026-04-27.json`
- `task-summary-2026-04-27.json`
- `task-ledger.jsonl`
- `decision-log.md`
- `wave-3-2026-04-27.md`
