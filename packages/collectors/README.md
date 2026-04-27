# @oss-scorecard/collectors

面向 **研究 / case-study / raw signal** 的采集层。

当前已交付：

- GitHub repo snapshot
- contributors bucket
- release cadence
- tooling raw signals
  - GitHub Actions / CI workflows
  - publish / release workflows
  - dependency automation config discovery
  - dependency-update commit heuristic（90 天采样窗口）

边界：

- 这里的输出是 **原始信号 / research profile**
- 不直接做 6 域评分
- audit pipeline 仍由 `packages/core/src/github.ts` 服务

命令行：

```bash
node --experimental-strip-types packages/collectors/src/cli.ts owner/repo
node --experimental-strip-types packages/collectors/src/cli.ts owner/repo --out metrics/repo.snapshot.json
```


新增：
- tooling domain raw signals（workflow / release cadence / dependency automation configs）
- CLI 支持 `--kind repo|tooling|all`
