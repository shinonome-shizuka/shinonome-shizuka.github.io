# 迁移日志 · 已执行 + 回退点

## 0.1 前置清理

| 动作 | 回退方式 |
|------|-------|
| `.gitmodules` 删除 `lightbi-hugo` / `FeelIt` / `dream` 死引用 | `git checkout .gitmodules` |
| 删 `assets/images/default-cover.svg` 重复副本（主题侧已托管） | `git checkout HEAD~ -- assets/images/default-cover.svg` |

## 0.2 主题 partials 抽取

```
git mv layouts/partials/article-link/card.html       themes/blowfish-shore/layouts/partials/article-link/card.html
git mv layouts/partials/article-link/timeline.html   themes/blowfish-shore/layouts/partials/article-link/timeline.html
git mv layouts/partials/recent-articles/cardview.html themes/blowfish-shore/layouts/partials/recent-articles/cardview.html
```

新增主题 `layouts/partials/extend-head.html`（原先主题没有），由 12 行改为加载 vendor via Hugo Pipes。

站点根 `layouts/partials/extend-head.html` 改为 5 行 stub：留作将来站点级 head 注入用。

回退：`git checkout HEAD~ -- layouts/partials/extend-head.html` + `git mv` 反向即可。

## 0.3 核心 layout 抽取

```
git mv -f layouts/404.html                    themes/blowfish-shore/layouts/404.html
git mv -f layouts/_default/list.html          themes/blowfish-shore/layouts/_default/list.html
git mv -f layouts/_default/term.html          themes/blowfish-shore/layouts/_default/term.html
git mv -f layouts/taxonomy/terms.html         themes/blowfish-shore/layouts/taxonomy/terms.html
```

`git mv -f` 因为主题侧同名文件（stock Blowfish）已存在。

## 0.4 shortcodes 抽取 + bug 修复

```
git mv -f layouts/shortcodes/bandcamp.html      themes/blowfish-shore/layouts/shortcodes/bandcamp.html
git mv -f layouts/shortcodes/friendlink.html    themes/blowfish-shore/layouts/shortcodes/friendlink.html
git mv -f layouts/shortcodes/music163.html      themes/blowfish-shore/layouts/shortcodes/music163.html
git mv -f layouts/shortcodes/strava.html        themes/blowfish-shore/layouts/shortcodes/strava.html
git mv -f layouts/shortcodes/rss-episode.html   themes/blowfish-shore/layouts/shortcodes/rss-episode.html
```

### `music163.html` L16 修复

```diff
- src="https://music.163.com/outchain/player?type=type={{ $type }}&id={{ $id }}&auto={{ $auto }}&height=32"
+ src="https://music.163.com/outchain/player?type={{ $type }}&id={{ $id }}&auto={{ $auto }}&height=32"
```

原 bug：`slim` 分支 URL 多一个 `type=` 前缀，导致 iframe 永远加载错误。该 bug 影响 `content/post/note/05.md` 等用 slim 模式渲染的位置。

## 0.5 vendor + JS 抽取

```
git mv static/vendor/imagesloaded/imagesloaded.pkgd.min.js themes/blowfish-shore/assets/vendor/imagesloaded/
git mv static/vendor/masonry/masonry.pkgd.min.js             themes/blowfish-shore/assets/vendor/masonry/
git rm static/js/hitokoto.js
```

新增主题 `assets/js/verse-reveal.js` —— 合并原 `hitokoto.js`（一言 fetch）与原 `extend-head.html` 内联 IIFE（ASCII noise 渐显）为单个模块。

extend-head.html 改为 Hugo Pipes 加载：

```go
{{ $verse := resources.Get "js/verse-reveal.js" | resources.Minify | resources.Fingerprint "sha256" }}
<script src="{{ $verse.RelPermalink }}" integrity="{{ $verse.Data.Integrity }}" defer></script>
```

`resources.Fingerprint "sha256"` 输出 Subresource Integrity，浏览器可验证。

## 0.6 默认封面

```
git rm assets/images/default-cover.svg     # 站点重复副本（MD5 与主题侧完全相同）
```

主题侧 `assets/images/default-cover.svg` 已存在，是文件真正的归属地。

`config.toml` 的 `defaultFeaturedImage` 从站点绝对路径 `/images/default-cover.svg` 改为 asset pipeline 相对路径 `images/default-cover.svg`。

## 0.7 数据 schema 文档化

新增 `docs/TAGS_SCHEMA.md`：描述 `data/tags.yaml` 与 `data/category_history.json` 的 schema、何处主题强制 / 何处可选。**该文档不放进主题 `data/`**（Hugo 会尝试解析为数据文件并 fail）。

`themes/blowfish-shore/layouts/taxonomy/terms.html` 早就用 `$.Site.Taxonomies` 反射 + `$taxonomyName` 抽象，不绑死 "tags"/"categories" 字符串。

## 0.8 i18n 整并 + powered_by 参数化

```
git rm i18n/zh.yaml
git rm i18n/zh.toml
```

新增主题 `themes/blowfish-shore/i18n/zh.yaml`：合并站点级 6 个键（`article.reading_time`、`word_count`、`views`、`likes`、`shortcode.recent_articles`、`recent.show_more`）。`footer.powered_by` 从硬编码 `-shore` 改为参数化：

```yaml
footer:
  powered_by: '由 {{ .Hugo }} 和 {{ .Site.Params.themeDisplayName | default "Blowfish" }} 强力驱动'
```

`config.toml` 新增 `[params] themeDisplayName = 'Blowfish Shore'`。其他主题不再受 `-shore` 字面量约束。

YAML 解析坑：双引号串内嵌双引号会歧义，改用单引号外套。

## 0.9 CI 整理

`.github/workflows/hugo.yml`：

- `HUGO_VERSION: latest` → `0.163.3`（与主题 `theme.toml` `[hugoVersion] max` 对齐）。
- 删除 `Install Dart Sass` 步骤（主题用 Tailwind v4，无 Sass）。
- Python 预生成脚本路径修复：
  - `content/posts` → `content/post`（项目实际是单数路径）
  - glob `**/index.md` → `**/*.md` + 过滤 `**/_index.md`（项目是 leaf bundle，不是 page bundle）
- Node setup 与 npm ci 步骤保留（主题未来若引入 npm 工具链会被 `submodules: recursive` 拉入）。

## 1.0 验证

构建：
- `hugo --templateMetrics --minify` → 181 页，~370ms，无 error。
- `Pages: 181`, `Paginator pages: 23` 与迁移前一致。

迁移完成后，主仓库 `layouts/` 仅剩两个文件：
- `partials/extend-head.html`（5 行 stub）
- `partials/home/podcast.html`（站点硬编码播客）
