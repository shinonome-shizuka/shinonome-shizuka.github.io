# React 迁移评估 · 是否把 Hugo 转 React

## TL;DR

**留在 Hugo**。本仓库 71 篇文章、零后端、CJK 排版 + 自有设计系统是核心价值，React 不带来对应收益。80-160 人时整站转化成本换不到功能升级。

如果将来真有 React-only 需求（CMS、登录、互动可视化），先用 **Hugo + React islands**（8-16 人时起），不要直接整站转换。

---

## 1. 项目特殊性

### 价值驱动

1. **长篇中文排版**：CJK 字体（NotoSansSC + SourceHanSerifSC）已嵌进主题 `static/fonts/`；Hugo 在 CJK 字数统计、goldmark 中文段落处理上原生良好。
2. **1.9K 行自有设计系统**：`themes/blowfish-shore/assets/css/custom.css` + `tokens.css` + `dark-mode.css` + `schemes/shore.css` + 8 个 component CSS。换成 JS 栈要把这套**重写为 JSX + CSS Modules / Tailwind 组件**。
3. **71 篇内容 + 干净的中文标签树**：内容很简单，frontmatter 字段 ~10 个，全部 lowerCamel，机械迁移即可。
4. **零后端**：没有 auth、没有 CMS、没有动态 API、没有评论系统后端（Utterances 是 GitHub Issue 模式）。

### 现有交互

- Masonry 错位瀑布流（用 imagesLoaded + masonry，约 30KB 已 vendorize）。CSS Grid `grid-template-rows: masonry` 已可替代（Safari 17 之前需 fallback）。
- 一言诗签 + ASCII noise 渐显（`hitokoto.cn` + 7-pass × 90ms 字符替换）。vanilla JS 已实现。
- Utterances 评论（GitHub Issue）由主题集成的 `<script>` 标签加载。
- 中文 typography（行高、字距、章节分隔）全靠主题 CSS class。

**没有任何组件需要 React 状态、虚拟 DOM、声明式更新或 hooks 模型**。

---

## 2. 路径对比

### Path A：维持 Hugo + 加 React islands（React 局部增强）

| 描述 | 估算（人时） |
|---|---|
| 设计：哪些 UI 必须 React 化 | 1-2 |
| esbuild + Hugo Pipes 集成 | 4-8 |
| 一两个 island demo + 接通 hydration | 4-8 |
| **小计** | **8-16** |

模式：esbuild 输出 ESM bundle 到 `assets/js/react-islands.js`，Hugo 模板挂载 `<div id="island-X" data-props='{{ jsonify ... }}'></div>` + `<script type="module" src="..."></script>`。

适用：评论系统升级、互动可视化（如时间轴动画）、客户端实时搜索（Astro Search / Fuse.js）。

### Path B：整站 → Astro

| 步骤 | 估算 |
|---|---|
| 内容迁移 71 篇 | 2 |
| shortcode → component (5 站点 + ~20 stock) | 20-30 |
| layout 模板 → JSX | 24-40 |
| 设计系统 → Astro component + Tailwind v4 | 8-16 |
| 数据 + taxonomy | 2 |
| CI/CD 重建 | 4 |
| i18n → astro-i18n | 4 |
| 视觉回归（Playwright） | 4-8 |
| **小计** | **66-120** |

适用：Astro 是 "JSX-化的 Hugo"，最接近本仓库的工作流。失败模式：
- CJK + 长篇文章用 Astro layout 文件 + components/ 嵌套层级深时调试麻烦。
- Astro View Transitions 与 Hugo 的 URL 即页面心智模型不一致。
- 与 GitHub Pages deploy（仅静态文件）适配需要适配器。

### Path C：整站 → Next.js (SSG)

| 步骤 | 估算 |
|---|---|
| 内容迁移 | 2 |
| shortcode → component | 24-40 |
| layout → React component | 24-48 |
| 设计系统 → Tailwind v4 + shadcn 风格 | 16-24 |
| 数据 + taxonomy | 4 |
| CI/CD (`next build && next export`) | 4-8 |
| i18n (`next-intl`) | 8 |
| 视觉回归 | 4-8 |
| **小计** | **86-140** |

失败模式：
- frontmatter 字段不严格兼容（Next.js MDX 是相对宽松，但 `taxonomies` 与 Blowfish 风格不同）。
- App Router 与 Pages Router 选择混乱。
- 与 GitHub Pages 适配：`next export` deprecated，要用 App Router 的 `output: export`。

### Path D：整站 → 纯 React (Vite + React Router DOM)

| 步骤 | 估算 |
|---|---|
| 内容迁移 | 2 |
| shortcode → React component | 24-40 |
| layout → React component | 32-64 |
| 设计系统 → Tailwind v4 + 自写 | 16-24 |
| 数据 + taxonomy | 4 |
| 构建链 + 部署 | 8 |
| **小计** | **86-148** |

完全失去 Hugo 静态部署的简洁度（GitHub Pages 直接吃 `public/`，React SPA 需要 history fallback 400.html 兜底）。

### Path E：Hugo 全量抽取（本仓库本次做的）

| 步骤 | 估算 |
|---|---|
| 主题代码搬运 + 整合 + 测试 | 6-10 |

无收益损失，无功能损失。

---

## 3. 关键成本项分析

| 成本项 | 占整站成本 | 说明 |
|------|---------|------|
| 设计系统移植 | **~30%** | 1.9K custom.css + 8 components + tokens + dark-mode，CSS-to-JSX 不可自动 |
| shortcode → component | ~25% | 每短代码 ~30-100 行 component，写 props 接口 + types |
| layout 翻译 | ~25% | 174 行 list + 210 行 taxonomy + 113 行 extend-head × 3 框架版本 |
| 内容迁移 | ~5% | Python frontmatter lib 一遍过；71 篇 |
| CI / 部署 | ~5% | 框架切换影响 deployment target |
| i18n | ~5% | 框架各自的 i18n lib |
| 测试 / 视觉回归 | ~5% | Playwright + Lighthouse CI |

---

## 4. 真实 React 收益场景

只在这些需求出现时引入 React（推荐 Path A islands）：

- **CMS 集成**：Decap / Sanity / Contentful，前端需要编辑 UI。
- **评论系统需要客户端**：Giscus 替代切换、其他（Disqus、live 评论流）。
- **用户画像 / 订阅**：登录、付费墙、订阅管理。
- **跨页面共享复杂客户端状态**：多面板、协作文档、A/B 实验面板。
- **互动可视化**：Cytoscape.js 3D 图、D3 实时 dashboard、WebGL 交互。
- **动态数据 API**：CMS fetched at runtime、RSS hub、TODO-Lists 等。

本仓库**当前不需要任何一项**。

---

## 5. 最终推荐

### 留在 Hugo

理由：

1. 内容 + 设计系统 + CJK 排版三位一体，Hugo 处理最简洁。
2. 整站转化 86-148 人时成本换不到对应收益（站点无 React-only 功能需求）。
3. 主题已与 Hugo 深度集成（BEM 类、CSS 变量、Hugo Pipes），转其他栈等于重写设计系统。

### 引入 React 仅在需要时（Path A islands）

Hugo 静态壳 + esbuild islands 是最便宜的弹性方案。先出一个 island demo 验证 hydration 与 `data-props` 流水线；扩展到任意 React 组件。

### 不要整站转换

Astro 看起来"最像 Hugo"，但 CJK + 长篇 + 自写 CSS 体系都让重写成本消化不掉。Next.js / 纯 React 收益更不抵成本。

---

## 6. 决策流程

```
有 React-only 功能需求？
├── 否 → 留 Hugo ✓
└── 是 →
    ├── 用户量 / 状态复杂度低 → Hugo + React islands（Path A）
    └── 用户量 / 状态复杂度高 →
        ├── SEO 关键 + 多页 → Astro
        ├── 服务端动态需求 → Next.js (App Router + RSC)
        └── 纯前端单页 → Vite + React Router
```

任何"为了 React 而 React"的迁移都是亏损的。
