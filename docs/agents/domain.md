# Domain Docs

> 产物位置：`docs/agents/`。上游 skill 调用本文件了解仓库 domain vocab。

## Read these first

1. [`/CONTEXT.md`](../../CONTEXT.md) — 项目速记（站点、设计系统、决策索引）
2. [`/docs/decisions/`](../../decisions/) — 历史决策仓库（含 react-vs-hugo, home-steamwave-bg 等 11 个 .md）
3. [`/docs/adr/`](../../adr/) — Architecture Decision Records（**当前为空**，未来 ADRs 进这里）

## File structure

```
.
├── CONTEXT.md             ← 项目 1-page 速记
├── docs/
│   ├── agents/            ← 本目录，mattpocock skill 输出
│   ├── adr/               ← 架构决策记录（空）
│   ├── decisions/         ← 历史决策、评估、规范（10 个老 .md + 本次新 PRD）
│   ├── design/            ← 视觉设计
│   ├── engineering/       ← 工程规范
│   └── content/           ← 内容创作
├── themes/
│   └── blowfish-shore/    ← git submodule，独立仓库
│       ├── assets/css/    ← 自有 design system（custom.css 1.9K）
│       └── layouts/       ← Hugo template
├── content/
│   └── post/              ← 71 篇 markdown
├── config.toml            ← Hugo 站点配置
├── CLAUDE.md              ← AI agent 入口
└── AGENTS.md              ← 未来 multi-agent 入口
```

## Use the glossary's vocabulary

术语映射（避免 PR review 时为命名争议）：

| 术语 | 含义 |
|---|---|
| `blowfish-shore` | 主题名（submodule 仓库名）|
| `DotField` | grid-mist partial 旧名（已删）|
| `HalfBeach` | 站点作者"東雲閑"给自己的代号 |
| `LongBeach` | "长滩后院"站名另一译 |
| `Steamwave` | 蒸汽波视觉风格代号 |
| `LineSidebar` | reactbits 组件名（本项目 vanilla port）|
| `bento` | 暂未启用（bento grid 风格，本仓库用 cardView 5-col）|

## Flag ADR conflicts

未来写新设计 / 工程决策前，查 `docs/adr/` 与 `docs/decisions/`。**冲突**就在 PR review 时说明。
