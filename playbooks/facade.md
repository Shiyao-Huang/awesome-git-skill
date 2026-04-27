---
id: facade-playbook-001
dimension: facade
version: 0.1.0
status: draft
last_verified_at: 2026-04-27
owner_role: implementer
sources: []
---

# facade playbook

## 1. 维度定义
`facade` 维度衡量项目能否在访客进入仓库后的前 30 秒内，用首屏 README、tagline、价值主张、demo、徽章与社交预览明确回答“这是什么、给谁用、为什么现在值得试”。

## 2. 评分锚点（0-5）

| 分数 | 具体可观察现象 |
|---|---|
| 0 | 仓库没有 README，或首屏几乎等同默认 GitHub 模板；看不到项目名称之外的价值说明、演示入口或任何可点击下一步。 |
| 1 | README 有标题与少量描述，但价值主张模糊，首屏没有 demo/视频/try-it 入口，徽章堆叠杂乱或存在死链，访客仍需下滑很久才知道项目能做什么。 |
| 2 | 首屏能看出项目类别，并至少出现 tagline、徽章或截图中的一种，但缺少明确受众、缺少“为什么比替代方案更好”的一句话，也没有低门槛试用路径。 |
| 3 | 首屏同时具备项目名、价值主张句、1 个 demo 资产或截图、少量有效徽章，并能把访客导向 quickstart/docs/playground 中的一个主 CTA，但社交预览、tagline 打磨或信息排序仍不稳定。 |
| 4 | 首屏在不滚屏或轻微滚动内给出 1 句面向目标用户的价值主张、1 个可验证 demo、1 个 try-it/quickstart CTA、2-4 个有效徽章，并且 README/OG/Twitter card 的核心叙事保持一致。 |
| 5 | 第一屏同时完成“识别对象 + 价值承诺 + 可信信号 + 立即体验”四件事：访客能在数秒内理解差异化定位，看到轻量 demo 或 playground，获得单一明确 CTA，并通过精简徽章与高质量社交预览形成强烈 star/试用动机。 |

## 3. 头部项目实践占位
- [ ] vscode: 待 case-study 填充
- [ ] ollama: 待 case-study 填充
- [ ] shadcn-ui: 待 case-study 填充
- [ ] supabase: 待 case-study 填充
- [ ] tauri: 待 case-study 填充

## 4. 可执行 checklist（≥10 条）
- [ ] 在 README 首屏收敛成一句 8-25 个词的 tagline，明确项目类别、目标用户和主要收益。
  *为什么：tagline 是首屏信息密度最高的位置，写不清就会把理解成本转嫁给访客。*
- [ ] 在 tagline 下方补一条价值主张句，只回答“为什么值得现在试”，不要重复功能列表。
  *为什么：项目名和功能名不等于价值，访客要先看到结果而不是模块清单。*
- [ ] 首屏只保留一个主 CTA（quickstart、playground 或 docs 其一），其他链接降级为次级入口。
  *为什么：首分钟最怕分叉；一个主路径能减少犹豫并提高试用完成率。*
- [ ] 提供 1 个 30 秒内能看懂的 demo 资产（GIF、短视频、asciinema 或 playground 截图），并保证加载体积可接受。
  *为什么：门面维度的说服力来自“看见结果”，不是抽象描述。*
- [ ] 将徽章数量限制在 2-4 个，只保留能增强信任的关键信号（版本、CI、license、社区/性能）。
  *为什么：徽章过多会把首屏变成噪音，反而削弱重点。*
- [ ] 对所有首屏徽章和 CTA 链接做死链检查，确保点击后进入真实且最新的目标页面。
  *为什么：门面上的失效链接会立刻摧毁可信度，比正文深处的坏链影响更大。*
- [ ] 在 README 首屏显式展示目标使用场景或“谁应该使用它”，避免只用技术术语自说自话。
  *为什么：100K+ star 项目往往先让潜在用户判断“这是不是为我而做”。*
- [ ] 将首屏的 logo、tagline、demo caption、OG 文案统一为同一叙事，不让 GitHub、社交分享和官网各说各话。
  *为什么：社交分发会放大首屏不一致，统一叙事才能形成记忆点。*
- [ ] 为 try-it/demo/quickstart 入口写清楚前提条件与限制（如云端试用、只读 demo、需登录）。
  *为什么：误导性的“马上试用”会带来高跳出和负面第一印象。*
- [ ] 在首屏下方紧跟 3-5 个高价值能力点，按“问题 → 结果”写法排列，而不是罗列内部模块名。
  *为什么：访客理解了主张后，需要快速确认项目覆盖的核心价值面。*
- [ ] 为社交预览准备固定安全区与标题模板，确保在 Twitter/X、Slack、Discord、GitHub link unfurl 中都能读清主信息。
  *为什么：很多 star 增长发生在仓库外部，OG 首图常是第一次曝光。*
- [ ] 为 tagline/hero 建立 A/B 文案模板与回收标准，记录哪些表述提升了点击、跳转或 star 转化。
  *为什么：门面优化不应停留在审美争论，而要沉淀成可复用实验资产。*

## 5. 反模式（≥3 条）
- ❌ 首屏堆满十几个徽章、截图、动画和赞助按钮。
  典型后果：真正的价值主张被淹没，访客只看到“很忙”而看不到“很重要”。
- ❌ tagline 只描述技术实现，不说明受众或收益。
  典型后果：项目看起来像内部组件库，非核心用户无法判断自己为何要继续看下去。
- ❌ demo 资产很大、很慢、过期，或展示的不是默认用户路径。
  典型后果：访客在还没理解价值前就先遭遇卡顿、困惑或预期错位。
- ❌ README、OG 图、社交卡片各自使用不同口号或不同产品定位。
  典型后果：分发链路中的记忆点被冲散，社交传播无法累积一致认知。

## 6. 量化指标

| 指标名 | 采集来源 | 健康阈值 |
|---|---|---|
| 首屏主 CTA 存在率 | `gh api repos/{owner}/{repo}/readme --jq '.content' \| base64 -d \| sed -n '1,60p'` 后检索 docs/quickstart/playground 链接 | README 前 60 行恰有 1 个主 CTA，且链接可访问 |
| 有效徽章数 | `gh api repos/{owner}/{repo}/readme --jq '.content' \| base64 -d` 提取 badge URL，再用 `curl -I` 校验 HTTP 200/3xx | 有效核心徽章 2-4 个，死链 0 个 |
| Demo 资产可用性 | `gh api repos/{owner}/{repo}/readme --jq '.content' \| base64 -d` 检索 GIF/video/playground，再对目标 URL 用 `curl -I` 或文件大小检查 | 至少 1 个 demo 资产或 playground 可访问 |
| 社交预览元标签完备率 | `curl -sL https://<project-site-or-docs-root> | grep -Ei 'og:image|twitter:card'` | 同时存在 `og:image` 与 `twitter:card=summary_large_image` |
| Hero 信息密度 | `gh api repos/{owner}/{repo}/readme --jq '.content' \| base64 -d \| sed -n '1,40p'` 统计标题/价值句/CTA/徽章/演示是否齐备 | 首屏具备标题、价值句、主 CTA、demo/截图、核心徽章中的 ≥4 项 |

## 7. 工具与模板
- `tools/social-preview/*`：社交预览图生成器，输入 tagline、logo、主题色与安全区配置，输出 OG/Twitter card 资产。
- `tools/readme-badges/*`：徽章选择器与死链校验器，限制徽章数量并标记低价值或失效徽章。
- `tools/tagline-ab/*`：tagline A/B 模板与实验记录器，沉淀不同受众语料的点击/转化表现。
- `tools/facade-audit/*`：对 README 首屏前 N 行执行低噪音检查，核对 CTA、demo、badge、value prop 是否齐备。
- `templates/facade/hero.md`：首屏文案模板，预置项目名、受众、价值主张、主 CTA、次级 CTA、证明信号位。
- `templates/facade/social-card.json`：社交卡片配置模板，固定标题长度、安全区和图文层级。
- `templates/facade/demo-checklist.md`：demo 资产准备清单，覆盖时长、分辨率、文件体积、字幕与默认路径一致性。
