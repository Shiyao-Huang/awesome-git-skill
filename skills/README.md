# Skills

这一层是 `oss-scorecard` 的**直接使用入口**，由 `opensource-optimizer` 团队资产支撑。

## 当前主入口

- [`oss-scorecard/`](./oss-scorecard/) — 对任意 GitHub repo 做 6 域评分、证据提取与改进建议

## 设计原则

1. **先有可用输出，再抽离稳定引擎**
2. **Skill-first，不等 CLI 完整成熟**
3. **输出必须可执行**：分数、证据、优先级建议、模板/修复动作
4. **与 `agents/` / `legion/` 协同**：skill 适合个人直接用，agent/legion 适合执行更重的改造工作
