# 02 — Playbook 骨架统一规范

> Status: ratified-v0 · Owner: master · Date: 2026-04-27 · 适用于所有 `playbooks/<dim>.md`

## 1. 目的
为 8 个维度（facade/docs/community/release/quality/growth/seo/case-library）的 playbook 文件定义统一骨架，让 10 个 implementer 可并行写作而互不冲突，且产物可被 `tools/` 索引脚本机器读取。

## 2. 必须遵守
- **配置驱动**：所有内容须放在结构化章节里，禁止散文堆叠。
- **Hard-fail**：front-matter 缺字段、章节缺失 → 索引脚本必须报错，不得 fallback。
- **不写完整案例**：案例栏只占位，等 case-studies 落地后回填（避免双源真相）。
- **可观测**：每条 checklist 必须能映射到 `metrics/` 或 `benchmarks/` 中的一条信号。

## 3. 文件路径
`playbooks/<dimension>.md`，dimension 取值见 `plans/00-repo-skeleton.md` §3。

## 4. Front-matter（必填）
```yaml
---
id: <dim>-playbook-001
dimension: <dim>
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---
```

## 5. 必含章节（顺序固定，章节标题严格匹配）

### 1. 维度定义
一句话回答：「这个维度对 100K+ star 项目意味着什么？」≤120 字。

### 2. 评分锚点（0-5）
表格 6 行，分别对应 0/1/2/3/4/5 分。每行写「具体可观察现象」，禁止"做得好/差"等模糊词。需可被外部观察者无歧义判定。

### 3. 头部项目实践占位
列出至少 5 个候选项目名（不写内容），每行格式 `- [ ] <project>: 待 case-study 填充`。case-study 完成后由 researcher 回填。

### 4. 可执行 checklist（≥10 条）
每条格式 `- [ ] <动作>` + 一行斜体注释「为什么」。动作必须是「项目维护者今晚就能开始做的具体事」，禁止"提升体验/优化品牌"等模糊动词。

### 5. 反模式（≥3 条）
每条 `- ❌ <反模式>` + 一行「典型后果」。

### 6. 量化指标
表格 ≥3 行，列：`指标名 | 采集来源 | 健康阈值`。来源必须是真实可访问的 URL/API/命令，禁止「人工感觉」。

### 7. 工具与模板
列出可在本仓 `tools/` 与 `templates/` 落地的自动化点（占位即可）。

## 6. DoD（每张 task 共用）
- [ ] 文件存在于 `playbooks/<dim>.md`
- [ ] Front-matter 完整且通过 `tools/` 索引脚本（脚本未就绪前手工核验）
- [ ] 7 个章节齐全且非空（占位也算非空，但必须符合本规范要求的最小条数）
- [ ] 评分锚点 6 行均可被外部观察者无歧义判定
- [ ] 在 task comment 贴最终文件路径 + 章节字数

## 7. 反模式（meta，给 implementer 看）
- ❌ 直接抄 GPT 通用建议 → 后果：与"15w star"无差异，不可执行
- ❌ 凭空虚构数据来源 → 后果：违反 hard-fail 原则
- ❌ 把案例直接写满 → 后果：与 case-studies 双源冲突
