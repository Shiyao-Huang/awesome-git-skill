---
title: Tier-1 跨项目对比矩阵
capture_at: "2026-04-27"
growth_class: explosive
cohort_window: "2-6 months"
type: comparison
---

# Tier-1 跨项目对比矩阵

> 基于 6 个 2-6 月爆发增长项目的 Case Study 数据，14 维度横向对比。

## 一、基础数据对比

| 维度 | openclaw | everything-claude-code | karpathy-skills | MiroFish | oh-my-openagent | worldmonitor |
|------|----------|----------------------|-----------------|----------|-----------------|--------------|
| Stars | 364,822 | 167,783 | 91,425 | 57,614 | 54,329 | 52,763 |
| Forks | 74,717 | 26,002 | 8,757 | 8,893 | 4,415 | 8,459 |
| 月龄 | 5.1 | 3.3 | 3.0 | 5.0 | 4.8 | 3.6 |
| 月增速 | 71,529 | 50,836 | 30,454 | 11,522 | 11,317 | 14,656 |
| Fork/Star | 20.5% | 15.5% | 9.6% | 15.4% | 8.1% | 16.0% |
| Issues/Stars | 2.0% | 0.1% | 0.08% | 0.4% | 1.2% | 0.25% |

## 二、项目属性对比

| 维度 | openclaw | everything-claude-code | karpathy-skills | MiroFish | oh-my-openagent | worldmonitor |
|------|----------|----------------------|-----------------|----------|-----------------|--------------|
| License | MIT | MIT | MIT | AGPL-3.0 | NOASSERTION | NOASSERTION |
| 主语言 | TypeScript | JavaScript | Markdown | Python | TypeScript | TypeScript |
| Category | ai-app | dev-tool | productivity | ai-app | dev-tool | ai-app |
| 贡献者 | 50-200 | 50-200 | <50 | <50 | 200-1k | UNVERIFIED |
| Top1 commits | 21,381 | 965 | ~10 | 225 | 3,460 | UNVERIFIED |
| 发布节奏 | 日更 | ~5天 | 无release | ~1月 | 日更 | UNVERIFIED |
| 文档站 | Mintlify | ecc.tools | 无 | mirofish.ai | ohmyopenagent.com | worldmonitor.app |
| 品牌站 | openclaw.ai | ecc.tools | 无 | mirofish.ai | ohmyopenagent.com | worldmonitor.app |

## 三、6 域评分 (RAG: 🟢强 / 🟡中 / 🔴弱 / ⚪不适用)

| 域 | openclaw | everything-claude-code | karpathy-skills | MiroFish | oh-my-openagent | worldmonitor |
|----|----------|----------------------|-----------------|----------|-----------------|--------------|
| facade | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | 🟡 |
| docs | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🔴 |
| community | 🟢 | 🟢 | 🟡 | 🟡 | 🟡 | 🟡 |
| quality | 🟢 | 🟢 | 🔴 | 🟡 | 🟡 | 🔴 |
| caselib | 🟢 | 🟡 | 🔴 | 🟡 | 🔴 | 🔴 |
| tooling | 🟢 | 🟢 | 🟢 | 🟡 | 🟢 | 🔴 |

## 四、增长模式分类

| 模式 | 项目 | 特征 |
|------|------|------|
| **平台生态型** | openclaw | 25+ 渠道 × Skills 生态 × 赞助商矩阵 |
| **开发者工具型** | everything-claude-code, oh-my-openagent | 跨 harness 兼容 × npm 分发 × CI 自动化 |
| **内容杠杆型** | karpathy-skills | 名人品牌 × 单文件 × 零安装 |
| **数据产品型** | MiroFish, worldmonitor | 演示驱动 × 可视化 × 垂直场景 |

## 五、风险信号汇总

| 项目 | 关键风险 |
|------|---------|
| openclaw | 单人驱动 (steipete 21K commits)，Bus Factor = 1 |
| everything-claude-code | 创始人 X 影响力依赖 |
| karpathy-skills | 无 CI/CD/测试，内容 ≠ 软件 |
| MiroFish | AGPL-3.0 限制企业采用，仓库治理 42% health |
| oh-my-openagent | NOASSERTION License，662 open issues |
| worldmonitor | NOASSERTION License，88MB 仓库 |

## 六、跨项目规律

1. **MIT License = 更快增长**：MIT 项目 (openclaw/ecc/karpathy) 平均 207K★ vs NOASSERTION 项目平均 53K★
2. **TypeScript 主导**：4/6 项目主语言为 TypeScript
3. **单人驱动普遍**：所有项目 Top1 贡献者远超其他人
4. **日更/周更发布节奏**：头部项目 (openclaw/ecc/oh-my-openagent) 发布间隔 ≤ 1 天
5. **文档站 = 增长乘数**：有独立文档站的项目增速明显高于无文档站项目
6. **AI 辅助开发痕迹**：Copilot/cursoragent/sisyphus 出现在多个项目贡献者列表

## 七、对 opensource-optimizer 的启示

| 启示 | 来源 | 建议行动 |
|------|------|---------|
| 多渠道分发是增长核心 | openclaw (25+ 渠道) | LegionImage 应覆盖 GitHub / npm / Docker / 品牌站 |
| 文档站必须早期建立 | openclaw/ecc vs karpathy/MiroFish | 为 opensource-optimizer 建 Mintlify 文档站 |
| License 明确 = 信任 | MIT 项目增速 4x NOASSERTION | 确保 LegionImage License 明确 |
| CI 自动化释放维护能力 | ecc + oh-my-openagent (跨平台 CI matrix + 日更发布) | 建立自动化 CI/CD，发布间隔 ≤ 2 天 |
| 内容型资产可独立爆发 | karpathy-skills (20 bytes → 91K★) | 考虑输出方法论内容（如"开源增长指南"） |
