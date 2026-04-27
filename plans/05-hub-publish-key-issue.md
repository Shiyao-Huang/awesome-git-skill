# HUB_PUBLISH_KEY 阻塞问题

**状态**: 待修复
**发现时间**: 2026-04-27 11:54
**影响**: create_corps (LegionImage 发布) 在 builder 执行路径上被 401 阻塞

## 问题

Builder 在 Phase 2 执行 `create_corps` 时返回 401，并将其解释为 `HUB_PUBLISH_KEY` 未配置。

但当前进一步核查显示：
- 当前会话环境中 `HUB_PUBLISH_KEY` 已存在（非空，长度 44）
- `~/.aha/settings.json` 中也存在 `genomeHubPublishKey`，权限为 `0600`
- 以同一份本地 key 对 `POST https://aha-agi.com/genome/corps` 做认证探测时，返回 **400 参数校验错误**，不是 401

**结论**：问题不是“系统里完全没有 key”，而是 **builder / publish 执行上下文没有正确消费现有 key**，或执行时仍处于 `LEGION_PUBLISH_ENABLED` 关闭状态。

## 根因（当前判断）

更可能的根因是以下之一：
1. builder runtime 未继承当前 env 中的 `HUB_PUBLISH_KEY`
2. builder runtime 未读取 `~/.aha/settings.json` 中的 `genomeHubPublishKey`
3. `LEGION_PUBLISH_ENABLED` 未在实际执行上下文中打开
4. create_corps 调用路径与本地探测路径使用了不同 runtime / config context

## 临时方案

用户要求从 `wow` 机器临时取 key。

已尝试：
- `ssh wow`
- `ssh -o BatchMode=yes -o ConnectTimeout=10 wow 'echo connected'`

结果：远端在认证前关闭连接（`Connection closed by 31.97.214.218 port 22`），**当前环境无法通过 wow 取 key**。

因此，短期最优方案不是继续依赖 wow，而是先修正 builder publish runtime 对现有 key 的读取。

## 修复路径

### 立即修复
1. 确认 builder/publish runtime 读取到 `HUB_PUBLISH_KEY` 或 `genomeHubPublishKey`
2. 在实际执行上下文显式设置 `LEGION_PUBLISH_ENABLED=true`
3. 重跑 `create_corps`
4. 若仍失败，再在群里请求 alternate SSH/bastion 或 admin 手动 publish

### 永久修复
- 在 daemon / spawn 流程中增加 publish preflight：
  - 缺 `HUB_PUBLISH_KEY` → hard-fail with actionable hint
  - `LEGION_PUBLISH_ENABLED!=true` → 明确 gate 提示
- 在 builder runtime 启动日志中打印（不泄露值）:
  - `HUB_PUBLISH_KEY present|missing`
  - `settings genomeHubPublishKey present|missing`
  - `LEGION_PUBLISH_ENABLED true|false`
- create_corps 成功后关闭此 issue
