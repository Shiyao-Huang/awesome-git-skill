import type { DomainRule } from './types.ts';

function containsAny(text: string | null, patterns: RegExp[]): boolean {
  if (!text) {
    return false;
  }
  return patterns.some((pattern) => pattern.test(text));
}

function hasAnyEntry(entries: string[], candidates: string[]): boolean {
  const entrySet = new Set(entries.map((value) => value.toLowerCase()));
  return candidates.some((candidate) => entrySet.has(candidate.toLowerCase()));
}

export const BOOTSTRAP_RULES: DomainRule[] = [
  {
    domain: 'facade',
    label: 'Facade',
    summary: '首屏价值表达、项目门面、第一眼转化。',
    signals: [
      {
        id: 'facade.description',
        label: 'Repository description',
        description: '仓库描述存在且长度适中。',
        recommendation: '补一条清晰的 repo description，让访问者一眼知道项目解决什么问题。',
        evaluate: (snapshot) => {
          const text = snapshot.description?.trim() ?? '';
          return text.length >= 16 && text.length <= 180;
        },
        evidence: (snapshot) => `description=${snapshot.description ?? '∅'}`,
      },
      {
        id: 'facade.homepage',
        label: 'Homepage or docs entry',
        description: '存在 homepage / docs 落地页。',
        recommendation: '补 homepage 或 docs 入口，把 README 外的完整入口挂出来。',
        evaluate: (snapshot) => Boolean(snapshot.homepage),
        evidence: (snapshot) => `homepage=${snapshot.homepage ?? '∅'}`,
      },
      {
        id: 'facade.topics',
        label: 'Topic coverage',
        description: '至少 3 个 GitHub topics，便于发现和定位。',
        recommendation: '补齐 GitHub topics（场景、技术栈、用户对象），增强 discoverability。',
        evaluate: (snapshot) => snapshot.topics.length >= 3,
        evidence: (snapshot) => `topics=${snapshot.topics.join(', ') || '∅'}`,
      },
      {
        id: 'facade.demo-asset',
        label: 'Demo or visual asset',
        description: 'README 首屏包含 demo / gif / screenshot / video 线索。',
        recommendation: '在 README 首屏增加 demo 截图、gif、asciinema 或视频入口。',
        evaluate: (snapshot) =>
          containsAny(snapshot.readmeText, [
            /!\[[^\]]*\]\(/i,
            /<img\b/i,
            /demo/i,
            /asciinema/i,
            /\.gif\b/i,
            /screenshot/i,
            /video/i,
          ]),
        evidence: (snapshot) =>
          snapshot.readmeText ? 'README contains visual/demo cues' : 'README missing',
      },
      {
        id: 'facade.quickstart-cta',
        label: 'Quickstart CTA in README',
        description: 'README 里能看到 quickstart / install / getting started 入口。',
        recommendation: '在 README 前半段显式放 install / quickstart CTA，减少首次使用阻力。',
        evaluate: (snapshot) =>
          containsAny(snapshot.readmeText, [/quickstart/i, /getting started/i, /install/i, /usage/i]),
        evidence: (snapshot) =>
          snapshot.readmeText ? 'README contains quickstart/install cues' : 'README missing',
      },
    ],
  },
  {
    domain: 'docs',
    label: 'Docs',
    summary: '首次成功、长期可维护文档与示例。',
    signals: [
      {
        id: 'docs.readme',
        label: 'README exists',
        description: '仓库存在 README。',
        recommendation: '先补 README，至少包括定位、安装、运行、贡献入口。',
        evaluate: (snapshot) => Boolean(snapshot.readmeText),
        evidence: (snapshot) => `readmePath=${snapshot.readmePath ?? '∅'}`,
      },
      {
        id: 'docs.docs-dir',
        label: 'Dedicated docs surface',
        description: '存在 docs/ 目录、docs 站点或明确文档入口。',
        recommendation: '增加 docs/ 目录或外部 docs 站点，避免 README 承担全部文档负担。',
        evaluate: (snapshot) =>
          snapshot.docsEntries.length > 0 ||
          Boolean(snapshot.homepage && /docs|guide|manual/i.test(snapshot.homepage)) ||
          containsAny(snapshot.readmeText, [/docs/i, /documentation/i, /guide/i]),
        evidence: (snapshot) =>
          `docsEntries=${snapshot.docsEntries.join(', ') || '∅'}; homepage=${snapshot.homepage ?? '∅'}`,
      },
      {
        id: 'docs.contributing',
        label: 'Contributing guide',
        description: '存在 CONTRIBUTING 或明确贡献指引。',
        recommendation: '补 CONTRIBUTING.md，说明本地开发、提交流程、质量门禁。',
        evaluate: (snapshot) =>
          Boolean(snapshot.contributingText) || containsAny(snapshot.readmeText, [/contribut/i, /pull request/i]),
        evidence: (snapshot) =>
          snapshot.contributingText ? 'CONTRIBUTING present' : 'CONTRIBUTING missing',
      },
      {
        id: 'docs.examples',
        label: 'Examples or tutorial path',
        description: '存在 examples/tutorial/sample 目录或同等线索。',
        recommendation: '补 examples/tutorial，给第一次成功一个最小可运行路径。',
        evaluate: (snapshot) =>
          hasAnyEntry(snapshot.rootEntries, ['examples', 'example', 'tutorial', 'sample']) ||
          containsAny(snapshot.readmeText, [/example/i, /tutorial/i, /sample/i]),
        evidence: (snapshot) =>
          `rootEntries=${snapshot.rootEntries.join(', ') || '∅'}`,
      },
      {
        id: 'docs.installation',
        label: 'Installation instructions',
        description: 'README 有可执行安装/运行线索。',
        recommendation: '在 README 中加入复制即用的安装/运行命令。',
        evaluate: (snapshot) =>
          containsAny(snapshot.readmeText, [
            /npm install/i,
            /pnpm install/i,
            /yarn install/i,
            /pip install/i,
            /cargo install/i,
            /git clone/i,
            /docker run/i,
          ]),
        evidence: (snapshot) => (snapshot.readmeText ? 'README contains install commands' : 'README missing'),
      },
    ],
  },
  {
    domain: 'community',
    label: 'Community',
    summary: '外部协作、沟通入口、维护者与贡献者关系。',
    signals: [
      {
        id: 'community.issue-templates',
        label: 'Issue templates',
        description: '存在 issue templates。',
        recommendation: '补 `.github/ISSUE_TEMPLATE`，把 bug/feature/ask 分流。',
        evaluate: (snapshot) => snapshot.issueTemplateFiles.length > 0,
        evidence: (snapshot) => `issueTemplates=${snapshot.issueTemplateFiles.join(', ') || '∅'}`,
      },
      {
        id: 'community.pr-template',
        label: 'PR template or contributing path',
        description: '存在 PR template 或贡献工作流。',
        recommendation: '补 PR template 或贡献 checklist，降低外部贡献协作成本。',
        evaluate: (snapshot) =>
          snapshot.githubEntries.some((entry) => /pull_request_template/i.test(entry)) || Boolean(snapshot.contributingText),
        evidence: (snapshot) => `githubEntries=${snapshot.githubEntries.join(', ') || '∅'}`,
      },
      {
        id: 'community.multi-contributor',
        label: 'More than one contributor',
        description: '贡献者不止 1 人。',
        recommendation: '补 onboarding / issue hygiene，让项目从单人驱动转向可协作状态。',
        evaluate: (snapshot) => snapshot.contributorsCount > 1,
        evidence: (snapshot) => `contributorsCount=${snapshot.contributorsCount}`,
      },
      {
        id: 'community.release-rhythm',
        label: 'Release rhythm exists',
        description: '已有 release 记录，社区看到演进节奏。',
        recommendation: '建立 release cadence 和 changelog，形成外部可感知的迭代节奏。',
        evaluate: (snapshot) => snapshot.releasesCount > 0,
        evidence: (snapshot) => `releasesCount=${snapshot.releasesCount}`,
      },
      {
        id: 'community.discussion-channel',
        label: 'Discussion/community channel',
        description: 'GitHub Discussions 或 README 社群入口存在。',
        recommendation: '补 Discussion/Discord/社区入口，把用户问题从 issue 里分流。',
        evaluate: (snapshot) =>
          snapshot.hasDiscussions ||
          containsAny(snapshot.readmeText, [/discord/i, /slack/i, /telegram/i, /community/i, /discussion/i]),
        evidence: (snapshot) => `hasDiscussions=${snapshot.hasDiscussions}`,
      },
    ],
  },
  {
    domain: 'quality',
    label: 'Quality',
    summary: '可信度、稳定性、安全与可维护性。',
    signals: [
      {
        id: 'quality.license',
        label: 'License clarity',
        description: '存在清晰 SPDX license。',
        recommendation: '补正式 License（SPDX 可识别），避免法律风险。',
        evaluate: (snapshot) => Boolean(snapshot.licenseSpdx && snapshot.licenseSpdx !== 'NOASSERTION'),
        evidence: (snapshot) => `license=${snapshot.licenseSpdx ?? '∅'}`,
      },
      {
        id: 'quality.ci',
        label: 'CI workflows',
        description: '存在 workflow 自动化。',
        recommendation: '补 CI workflow，把 lint/test/build 机器化。',
        evaluate: (snapshot) => snapshot.workflowFiles.length > 0,
        evidence: (snapshot) => `workflowCount=${snapshot.workflowFiles.length}`,
      },
      {
        id: 'quality.test-signal',
        label: 'Test or lint signal',
        description: 'workflow/manifest 中有 test/lint/build 等质量信号。',
        recommendation: '在 workflow 或 package scripts 中加入 test/lint/build，并对 PR 强制执行。',
        evaluate: (snapshot) =>
          Object.values(snapshot.workflowTextByPath).some((text) =>
            /test|pytest|vitest|jest|lint|typecheck|tsc|cargo test/i.test(text),
          ) ||
          containsAny(snapshot.packageJsonText, [/\"test\"\s*:/i, /\"lint\"\s*:/i]),
        evidence: () => 'workflow/package scripts scanned for test/lint/build keywords',
      },
      {
        id: 'quality.security-policy',
        label: 'Security policy',
        description: '存在 SECURITY.md 或安全披露说明。',
        recommendation: '补 SECURITY.md，明确漏洞披露和响应路径。',
        evaluate: (snapshot) => Boolean(snapshot.securityText),
        evidence: (snapshot) => (snapshot.securityText ? 'SECURITY present' : 'SECURITY missing'),
      },
      {
        id: 'quality.recent-maintenance',
        label: 'Recent maintenance',
        description: '最近 30 天有 push，说明仍在积极维护。',
        recommendation: '维持可见维护节奏；若暂停维护需明确 roadmap/状态说明。',
        evaluate: (snapshot) => {
          const ageMs = Date.now() - Date.parse(snapshot.pushedAt);
          const ageDays = ageMs / (1000 * 60 * 60 * 24);
          return ageDays <= 30;
        },
        evidence: (snapshot) => `pushedAt=${snapshot.pushedAt}`,
      },
    ],
  },
  {
    domain: 'caselib',
    label: 'Case Library',
    summary: '可信 adoption 叙事、案例、示例与对外证明。',
    signals: [
      {
        id: 'caselib.showcase-link',
        label: 'Showcase or examples surface',
        description: '存在 showcase/examples/gallery/use-cases 线索。',
        recommendation: '补 showcase/use-cases/examples，把“谁在怎么用”做成公开资产。',
        evaluate: (snapshot) =>
          hasAnyEntry(snapshot.rootEntries, ['examples', 'showcase', 'gallery', 'use-cases', 'usecases']) ||
          containsAny(snapshot.readmeText, [/showcase/i, /case stud/i, /use cases?/i, /gallery/i]),
        evidence: (snapshot) => `rootEntries=${snapshot.rootEntries.join(', ') || '∅'}`,
      },
      {
        id: 'caselib.production-proof',
        label: 'Production or user proof',
        description: 'README/docs 中存在 production / users / customer 证明。',
        recommendation: '公开最小 adoption proof：生产部署、用户故事、迁移故事或 customer wall。',
        evaluate: (snapshot) =>
          containsAny(snapshot.readmeText, [/production/i, /customer/i, /used by/i, /companies/i, /users/i]),
        evidence: () => 'README scanned for production/customer/user proof keywords',
      },
      {
        id: 'caselib.migration-path',
        label: 'Migration or upgrade story',
        description: 'README/docs 中有 migrate / upgrade / compatibility 线索。',
        recommendation: '补 migrate/upgrade/compatibility 指引，降低从旧方案迁移成本。',
        evaluate: (snapshot) =>
          containsAny(snapshot.readmeText, [/migration/i, /migrate/i, /upgrade/i, /compatib/i]),
        evidence: () => 'README scanned for migration/upgrade keywords',
      },
      {
        id: 'caselib.release-history',
        label: 'Release history as evidence',
        description: '有 release 历史可作为演进证据。',
        recommendation: '建立 release/changelog 历史，让案例叙事有时间线支撑。',
        evaluate: (snapshot) => snapshot.releasesCount >= 3,
        evidence: (snapshot) => `releasesCount=${snapshot.releasesCount}`,
      },
      {
        id: 'caselib.external-entry',
        label: 'External proof entry',
        description: '存在官网、文档站或 README 之外的公开入口。',
        recommendation: '补官网/文档站/公开目录页，承载案例、FAQ、路线图等外部证明。',
        evaluate: (snapshot) => Boolean(snapshot.homepage),
        evidence: (snapshot) => `homepage=${snapshot.homepage ?? '∅'}`,
      },
    ],
  },
  {
    domain: 'tooling',
    label: 'Tooling',
    summary: '开发/发布/环境配置的自动化与工程杠杆。',
    signals: [
      {
        id: 'tooling.release-workflow',
        label: 'Release workflow',
        description: '存在 release / publish 自动化 workflow。',
        recommendation: '补 release/publish workflow，把发布节奏自动化。',
        evaluate: (snapshot) =>
          snapshot.workflowFiles.some((path) => /release|publish|deploy/i.test(path)) ||
          Object.values(snapshot.workflowTextByPath).some((text) => /release|publish|deploy/i.test(text)),
        evidence: (snapshot) => `workflowFiles=${snapshot.workflowFiles.join(', ') || '∅'}`,
      },
      {
        id: 'tooling.package-manifest',
        label: 'Package/build manifest',
        description: '存在 package.json / pyproject / Cargo.toml 等 manifest。',
        recommendation: '补 package/build manifest，声明运行、构建与发布入口。',
        evaluate: (snapshot) =>
          hasAnyEntry(snapshot.rootEntries, ['package.json', 'pyproject.toml', 'cargo.toml', 'go.mod']),
        evidence: (snapshot) => `rootEntries=${snapshot.rootEntries.join(', ') || '∅'}`,
      },
      {
        id: 'tooling.dev-environment',
        label: 'Dev environment config',
        description: '存在 Dockerfile / devcontainer / compose 等环境配置。',
        recommendation: '补 devcontainer/Dockerfile/compose，降低本地与 CI 环境差异。',
        evaluate: (snapshot) =>
          hasAnyEntry(snapshot.rootEntries, ['dockerfile', 'docker-compose.yml', 'docker-compose.yaml']) ||
          snapshot.rootEntries.includes('.devcontainer') ||
          snapshot.docsEntries.includes('devcontainer.json'),
        evidence: (snapshot) => `rootEntries=${snapshot.rootEntries.join(', ') || '∅'}`,
      },
      {
        id: 'tooling.workflow-depth',
        label: 'Workflow depth',
        description: 'workflow 不止一条，说明自动化覆盖更全面。',
        recommendation: '把 test / release / metrics / publish 等拆成明确 workflow，形成工程杠杆。',
        evaluate: (snapshot) => snapshot.workflowFiles.length >= 2,
        evidence: (snapshot) => `workflowCount=${snapshot.workflowFiles.length}`,
      },
      {
        id: 'tooling.publish-scripts',
        label: 'Publish/build scripts',
        description: 'manifest 中存在 build/release scripts。',
        recommendation: '在 package/build scripts 中显式声明 build/release/publish 入口。',
        evaluate: (snapshot) =>
          containsAny(snapshot.packageJsonText, [/\"build\"\s*:/i, /\"release\"\s*:/i, /\"publish\"\s*:/i]),
        evidence: () => 'package.json scanned for build/release/publish scripts',
      },
    ],
  },
];
