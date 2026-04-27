# tools/

自动化脚本：评分卡计算、case-study 模板生成、front-matter 索引、metrics 抓取。每个脚本必须支持配置文件驱动（无硬编码项目名/路径）。

## 30 秒上手

### front-matter 索引器

在 `tools/` 目录运行：

```bash
npm test
node index.ts
node index.ts --strict=false
node index.ts --root ../some-fixture
```

- 默认 `--strict=true`：旧 8-dim 字段、非法 `covers[]`、非法 `dimensions_covered[]` 直接 hard-fail
- stdout 输出 JSON 索引结果
- stderr 仅输出 `file:line field message` 级别错误，避免噪音
- 当前索引范围：`playbooks/*.md`、`case-studies/*.md`

## scorecard-run

`tools/scorecard-run.ts` 是评分卡 MVP：读取 `tools/scorecard-run.config.json`（或 `--config <path>`）、`benchmarks/*.md` 与单个 `case-studies/*.md`，按 `plans/02-scorecard.md` + `plans/03-canonical-mapping.md` 做严格校验并输出 JSON / Markdown。默认 `--strict`；`--strict=false` 仅用于显式允许开发期的 partial run，不会放宽缺字段或废弃枚举的 hard-fail。
