# 不引入 React · 留 Hugo + 蒸汽波透视网格 · 接 reactbits LineSidebar vanilla port

> Status: ACCEPTED · 2026-07-25 · 作者: 香椎花凛 + Claude
> 适用范围: `themes/blowfish-shore/` 子模块 + 父仓库 docs/

## 1. Problem

手机访问文章页**过热**（30-60°C），主因是 grid-mist 的 canvas 重绘 + mousemove 全文档监听 + 20ms setInterval。

同时需求新增：
- 卡片悬停效果（已经有 `:hover`，不增加 island）
- 阅读进度条（用 CSS-only，无 is_required）
- 文章页面**左侧 line-index 目录**（reactbits.dev/components/line-sidebar）
- 评论区从**右侧 card 4**下移到**文章页尾**，让读者不必读完就能留言

## 2. Solution

### 性能 (Phase 1)
- 删 `themes/blowfish-shore/layouts/partials/grid-mist.html`（195 行 inline JS）
- 删 `themes/blowfish-shore/layouts/partials/grain.html`（已停用，0 caller）
- 删 `themes/blowfish-shore/layouts/partials/article-aside/comments.html`（card 4）
- 删 `themes/blowfish-shore/assets/js/article-aside-comments.js`（utterances 注入脚本）
- 清 `themes/blowfish-shore/assets/css/custom.css` 两段废选择器
- 改 `themes/blowfish-shore/layouts/_default/baseof.html` 删 line 42-44
- 改 `themes/blowfish-shore/layouts/_default/single.html` 行 113

### LineSidebar (Phase 4)
- 新 `themes/blowfish-shore/assets/css/components/line-sidebar.css`（reactbits 原版 CSS + 主题 token 替换 accentColor → `var(--color-primary-500)`）
- 新 `themes/blowfish-shore/assets/js/line-sidebar.js`（reactbits LineSidebar.jsx 1:1 vanilla port，~80 行）
- 新 `themes/blowfish-shore/layouts/partials/line-sidebar.html`（左侧 sticky 挂载，items 数据从 `.Page.TableOfContents` 注入）
- 改 `themes/blowfish-shore/layouts/_default/single.html` —— 在 `<aside class="article-aside">` 之前挂 LineSidebar

### 评论区下移 + 70vh 折叠 (Phase 3)
- 70vh 折叠：`.article-content` 在视口高度内不折叠，超 100vh 时 add CSS class `article-content--collapse` + 文末 `<button>` 触发 `data-expanded="true"` 全展开。**约 8 行 vanilla JS** 决定是否启用
- 评论区：`<footer>` 之后 `</article>` 之前放 `<details id="comments">` 默认折叠，按需加载 utterances iframe
- 新 `themes/blowfish-shore/assets/js/article-comments.js`（按新 selector `.article-comments__mount` 注入）

### docs 整理 (Phase 2)
- 父仓库 `docs/` 重构成 `docs/{agents,adr,decisions,design,engineering,content}/`
- 原 10 个 .md 进 `docs/decisions/`，重命名 lower-kebab
- 新 `CONTEXT.md`（项目根）登记站点属性
- 新 `docs/agents/{domain,issue-tracker-github}.md`（mattpocock skill 标准产物）
- 改根 `CLAUDE.md` 加 `## Agent skills` block

## 3. User Stories

1. 作为移动端读者，我希望打开文章页不烫手手机，以便长时间阅读不发热
2. 作为读者，我希望评论区出现在我文章**末尾**而非右下角，以便我读到一半想吐槽时不被右下小框干扰
3. 作为站点维护者，我希望所有 vanilla/island 走 `assets/js` + Hugo Pipes 工程路径，跟现有 20 个 vendor 化组件一致
4. 作为读者，我希望左侧看到 line index 目录（reactbits 风格），鼠标靠近高亮，点击平滑滚到锚点
5. 作为站点维护者，我希望新组件加 docs/agents 配置后，上游引擎能自动定位 issue tracker 和 domain vocab
6. 作为读者，我希望短文章不被强制折叠（70vh 才生效）

## 4. Implementation Decisions

### D-1: React runtime 不进
reactbits LineSidebar 是 .jsx → vanilla port 1:1，~80 行 JS。引入 Preact + compat = +50KB JS，违反"性能优化"原意。**结论**：vanilla porting。Q5=β、Q8=I 已锁。

### D-2: 子模块工作流
`themes/blowfish-shore/` 是 git submodule（仓库 `shinonome-shizuka/blowfish-shore.git`）。所有主题层改动在 submodule `feat/perf-no-react-line-sidebar` 分支，提交后由父仓库做 SHA bump。一次性 push（P-B 路线）。

### D-3: docs 重命名
原 10 个 .md 改名 lower-kebab + 进 `docs/decisions/`。git log `--follow` 能追历史。**不重写内容**。

### D-4: 70vh 折叠触发
用 JS 跑 `article.scrollHeight > window.innerHeight * 0.9` 决定是否折叠。短文（< 90vh）按钮直接隐藏。~8 行 vanilla JS，被 Q18=A 锁。

### D-5: LineSidebar 颜色 token
原 reactbits accent `#A855F7` (purple) → 替换为 `var(--color-primary-500)`（仓库现有 token），跟 55° 蒸汽波网格同色。视觉语言统一。

### D-6: GH triage labels
mattpocock 默认：`needs-triage` / `needs-info` / `ready-for-agent` / `ready-for-human` / `wontfix`。**新增到仓库 labels**（与已有 9 个 label 共存，`wontfix` 不重复创建）。

## 5. Files

| 路径 | 状态 | Phase |
|---|---|---|
| `themes/blowfish-shore/layouts/partials/grid-mist.html` | DELETE | 1 |
| `themes/blowfish-shore/layouts/partials/grain.html` | DELETE | 1 |
| `themes/blowfish-shore/layouts/partials/article-aside/comments.html` | DELETE | 1 |
| `themes/blowfish-shore/assets/js/article-aside-comments.js` | DELETE | 1 |
| `themes/blowfish-shore/layouts/_default/baseof.html` | MODIFY (-2 lines) | 1 |
| `themes/blowfish-shore/layouts/_default/single.html` | MODIFY (-1, +line-sidebar partial, +70vh button, +comments details) | 1, 3, 4 |
| `themes/blowfish-shore/assets/css/custom.css` | MODIFY (-61 lines) | 1 |
| `themes/blowfish-shore/assets/css/components/line-sidebar.css` | NEW | 4 |
| `themes/blowfish-shore/assets/js/line-sidebar.js` | NEW | 4 |
| `themes/blowfish-shore/assets/js/article-comments.js` | NEW | 4 |
| `themes/blowfish-shore/layouts/partials/line-sidebar.html` | NEW | 4 |
| `themes/blowfish-shore/assets/css/components/article-expand.css` | NEW (or inline in custom.css) | 3 |
| `docs/CONTEXT.md` (parent repo) | NEW | 2 |
| `docs/agents/{domain,issue-tracker-github}.md` | NEW | 2 |
| `CLAUDE.md` (parent repo) | MODIFY (+ ## Agent skills block) | 2 |
| `docs/{adr,decisions,design,engineering,content}/` | NEW dirs + .gitkeep | 2 |
| `docs/decisions/{content-guide,css-refactor-plan,…,tags-schema,no-react-and-line-sidebar}.md` | RENAME 10 + NEW 1 | 2 |

## 6. Out of Scope

- Triage skill 启用（labels 创好，skill 本身不装）
- Astro / Next.js 评估（已废止，见 `docs/decisions/react-vs-hugo.md`）
- 文章侧 ChatGPT 风格评论总结（giscus 替代 utterances 评估）

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Submodule 推送失败 | low (代理 OK) | P-B 攒齐一次性推 |
| LinSidebar vanilla port React 等价性偏差 | medium | 单元测试 pointer events 进/出 |
| 70vh 折叠在 tailwind prose 排版不对 | low | 单文章验证长文触发 |
| `data-items='{{ .TableOfContents | jsonify }}'` 解析失败 | low | Hugo build 后看产物 |
