# Examples

这些示例文件回答一个核心问题：

> 研究资产如何变成别人今天就能直接使用的开源资产？

答案不是再写更多方法论文档，而是把研究压缩成：

1. **可执行入口**：`oss-scorecard audit <repo>`
2. **可分享报告**：Markdown / JSON report
3. **可追溯依据**：case studies / benchmarks / playbooks / history

## 当前示例

### 1. Live audit report
- `reports/openclaw.md`
- `reports/openclaw.json`

这两个文件来自真实命令：

```bash
node ./bin/oss-scorecard.mjs audit openclaw/openclaw \
  --markdown-out examples/reports/openclaw.md \
  --json-out examples/reports/openclaw.json
```

## 这些文件说明了什么

- `case-studies/` 不是终点，而是**训练样本 / 对标样本**
- `benchmarks/` 不是终点，而是**评分规则来源**
- `playbooks/` 不是终点，而是**改进建议库**
- `packages/core/` + `packages/collectors/` 才是把研究变成产品的执行层

## 对外最有价值的分享方式

与其公开原始任务/聊天流，不如公开：

1. 真实仓库的 score reports
2. 示例输入输出
3. 评分依据与方法说明
4. 对应的改进动作

这就是研究资产被产品化后的第一批可用成果。
