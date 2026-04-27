# Research to Product

`oss-scorecard` 的核心不是“继续积累研究文档”，而是把已经完成的研究压缩成一个别人今天就能使用的开源产品。

## 1. 研究资产如何转化为可用资产

| 现有资产 | 转化后的产品资产 |
|---|---|
| `case-studies/*.md` | gold samples / comparison anchors |
| `research/*.md` | cohort datasets / comparison matrices |
| `benchmarks/*.md` | machine-readable rules / score signals |
| `playbooks/*.md` | recommendation library / fix recipes |
| `tools/index.ts` | strict integrity gate |
| `packages/core/` + `packages/collectors/` | runnable scoring engine |
| Legion + AgentImages | reusable execution team / genome-hub asset |

## 2. 最小可用产品

第一版产品不是“大而全的平台”，而是一个非常简单的 promise：

```bash
oss-scorecard audit owner/repo
```

输出：
- 6 域评分
- top gaps
- top fixes
- evidence trail
- markdown/json report

## 3. 为什么这能成为开源项目

因为它已经具备开源项目最重要的三类资产：

1. **规则**：6 域 × 37 叶子 benchmark 体系
2. **数据**：Tier-1 / Tier-2 cohort + case studies
3. **执行层**：CLI / skill / Legion / Agents

也就是说，这不再只是“研究仓库”，而是一个：

> 用爆发增长样本训练出来的 GitHub 仓库增长诊断器。

## 4. 最适合公开的内容

### 公开
- `README.md`
- `docs/methodology.md`
- `docs/competitive-landscape.md`
- `docs/research-to-product.md`
- `examples/reports/*.md|json`
- `history/` 下的精选构建记录

### 不公开
- 原始 team chat
- 高噪音 task-service 状态流
- runtime / credential 细节
- 与用户隐私相关的操作上下文

## 5. 对外产品分层

### Skill
最低摩擦分发入口。

### CLI
稳定可测试的执行入口。

### Legion + Agents
长期组织能力资产与 genome-hub 贡献。

## 6. “怎么做成开源爆款”的实际答案

不是“继续研究”，而是：

1. 降低首次尝试成本（skill / curl | bash / zero-config）
2. 给用户一个一眼能懂的输出（score + fixes）
3. 让结果本身具备传播性（report / badge / comparison）
4. 用真实案例不断反哺规则与建议

当这四件事闭环后，研究就不再是后台资料，而会变成产品增长飞轮。
