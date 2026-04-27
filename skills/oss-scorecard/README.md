# oss-scorecard

> `opensource-optimizer` 的第一个公开 skill 入口。

## 目标

输入一个 GitHub repo，输出：
- 6 域评分
- 关键证据
- Top gaps
- Top fixes
- 对标样本建议

## 预期输入

- `owner/repo`
- 或完整 GitHub repo URL

## 预期输出

1. `facade / docs / community / quality / caselib / tooling` 六域评分
2. 每个维度的证据点
3. 优先改进的 3 件事
4. 对应 playbook / template / case-study 链接

## 资产来源

- 评分规则：`benchmarks/`
- 样本库：`case-studies/`
- 修复建议：`playbooks/`
- 执行工具：`tools/`

## 状态

- 当前为仓库产品化阶段的公开入口定义
- 后续将把稳定能力下沉到 CLI / Action / engine

## 使用入口

- 通用上手：[`../../docs/getting-started.md`](../../docs/getting-started.md)
- skill 专用说明：[`./USAGE.md`](./USAGE.md)
