# CONTEXT — 长滩后院

> 项目代号：TheWorldR4.github.io（域: `shinonome-shizuka.github.io`）
> 作者：東雲閑 @shinomone-shizuka
> 起站：2020

## 1. 站点速记

- **平台**：Hugo 静态站 + Blowfish 主题（`themes/blowfish-shore/` 是 git submodule）
- **内容语言**：纯中文 (`defaultContentLanguage = 'zh'`，en disabled)
- **字体**：NotoSansSC + SourceHanSerifSC（已 vendor 化到 `themes/blowfish-shore/static/fonts/`）
- **数量**：71 篇 posts + 多 list/term 页
- **零后端**：评论靠 utterances（GitHub Issue 模式），无 auth，无 CMS
- **部署**：GitHub Pages → 静态文件

## 2. 设计系统

- 主入口：`themes/blowfish-shore/assets/css/custom.css`（1.9K 行自有 CSS）
- Token：`tokens.css` + `dark-mode.css` + `schemes/shore.css`
- 视觉风格：蒸汽波 + 日式文学（"长滩后院"调性）
- 背景：双层 55° 透视网格，CSS `body::before/after` 伪元素，无 JS（[custom.css:183-242](themes/blowfish-shore/assets/css/custom.css#L183-L242)）
- Tailwind 集成：主题自带 + 多 component

## 3. 关键决策记录

- 留在 Hugo（不整站转 React / Astro / Next.js）→ [decisions/react-vs-hugo.md](docs/decisions/react-vs-hugo.md)
- 蒸汽波背景设计语言 → [decisions/home-steamwave-bg.md](docs/decisions/home-steamwave-bg.md)
- 内容创作规范 → [decisions/content-guide.md](docs/decisions/content-guide.md)
- 标签系统 → [decisions/tags-schema.md](docs/decisions/tags-schema.md)
- Hugo 工程标准 → [decisions/hugo-standards.md](docs/decisions/hugo-standards.md)

## 4. 工程边界

### 哪些文件属于主题层（submodule 仓库）
- `themes/blowfish-shore/` 整个子树
- 改动走 submodule 分支 + 父仓库 SHA bump

### 哪些文件属于父仓库
- `docs/`、`config.toml`、`content/`、`static/`、`archetypes/`、`layouts/`（父仓库的镜像覆盖）
- 仓库根一切

## 5. 已知约束

- CJK 排版要求 `<html lang="zh-Hans">` 与 `hasCJKLanguage = true`
- defaultDark = true（dark mode 优先）
- GitHub Pages 不支持 build step（`.github/workflows/` 用 `peaceiris/actions-hugo`）
- 评论系统：utterances（基于 `pathname` 作为 issue-term）→ 71 篇 = 71 个 GitHub issue
