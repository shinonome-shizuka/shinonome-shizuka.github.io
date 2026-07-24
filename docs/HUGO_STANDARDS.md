# Hugo 代码规范 · 主题仓库与主仓库对账

## 1. 文件命名

| 实践 | 推荐 |
|------|------|
| Section landing | `_index.md`（非 `index.md`） |
| 模板文件名 | `snake_case.html` |
| partial | `partials/<name>.html` 或 `partials/<group>/<name>.html` |
| shortcode | `shortcodes/<name>.html` |
| data | `data/*.yaml` / `*.json` |
| theme metadata | `theme.toml` |

## 2. 模板函数大小写

Hugo v0.146 起 `site` / `hugo` 小写为官方推荐，`.Site` / `.Hugo` 保留为别名。

```go
{{ site.Data.tags }}      ✓ 推荐
{{ .Site.Data.tags }}    ✓ 兼容
{{ site.Hugo.version }}  ✓ 推荐
{{ .Hugo.version }}      ✓ 兼容
```

**站点根的 `layouts/_default/list.html` (现 blowfish-shore) 主题规范**：使用 `site.Params.*` 与 `default` filter 的级联。

## 3. params cascade

```go
{{/* 当前 frontmatter → 站点全局默认值 → 内置默认 */}}
{{ $cardView := .Params.cardView | default (site.Params.list.cardView | default false) }}
{{ $groupByYear := .Params.groupByYear | default (site.Params.list.groupByYear | default false) }}
```

比单纯 `{{ $cardView := .Params.cardView | default false }}` 多了一环"主题默认"，主题作者可写默认，站点作者可覆盖。

## 4. 防御性 guard

```go
{{/* 范围迭代时保护 data 为空 */}}
{{ $tree := default (slice) (site.Data.tags | default (slice)) }}
{{ range $tree }}…{{ end }}
```

## 5. Asset pipeline

```go
{{/* 不用 <script src="/static/.."> 老式；统一走 resources 管线 */}}
{{ $verse := resources.Get "js/verse-reveal.js" | resources.Minify | resources.Fingerprint "sha256" }}
<script src="{{ $verse.RelPermalink }}"
        integrity="{{ $verse.Data.Integrity }}"
        defer></script>
```

`resources.Fingerprint "sha256"` 输出 SRI 完整性值，浏览器可验证资源未被改。

## 6. theme.toml 元数据

主题必须在 `theme.toml` 至少声明：

```toml
name = "blowfish-shore"
description = "长滩后院定制版"
license = "MIT"
[author]
  name = "shinonome-shizuka"
[module]
  # 主题最多支持哪个 Hugo 版本；CI 钉住这个版本
[hugoVersion]
  extended = true
  min = "0.158.0"
  max = "0.163.3"
```

blowfish-shore 的 `theme.toml` 当前 `name = "Blowfish"`（与 upstream 撞），是历史欠账。应改为 `name = "blowfish-shore"`。

## 7. i18n key 命名

snake_case + hierarchical：

```yaml
# themes/<theme>/i18n/zh.yaml
article:
  reading_time:
    one: "{{ .Count }} 分钟"
    other: "{{ .Count }} 分钟"
```

模板调用：`{{ i18n "article.reading_time" . }}`，`.` 让 Hugo 注入 `.Count`。

## 8. frontmatter 键

lowerCamel：

```yaml
# content/post/**/*.md
---
title: '...'
date: 2024-01-01T12:00:00+08:00
cover: 'https://...'
categories: [随笔]
tags: [思考]
callout: '...'
showHero: false
view: timeline
cardView: false
groupByYear: true
color: '#005CFF'
associate:
  name: '...'
  link: '...'
---
```

`view`, `cardView`, `groupByYear`, `color`, `associate` 是 blowfish-shore 扩展字段。其他主题遇这些字段会安静忽略；迁移前在 `docs/CONTENT_GUIDE.md` 标明，让作者知道它们绑死了主题选择。

## 9. archetypes/default.md

```yaml
---
title: '{{ replace .Name "-" " " | title }}'
date: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
lastmod: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
draft: true
cover: ''
categories: [随笔]
tags: []
---
```

裸 `{{ .Date }}` 在 YAML 里默认格式化方式不可控；显式用 Go time format string。

## 10. Hugo 模块 vs git submodule

| 方案 | 适用 |
|------|------|
| Hugo Module | 主题频繁升级、希望 `hugo mod get` 自动同步、希望跨仓库引用 |
| Git submodule | 主题修改频繁、希望本地原子提交、希望与上游 commit 隔离 |

本仓库选 git submodule（用户决定）。`themes/blowfish-shore` 升级：`cd themes/blowfish-shore && git pull && cd ../.. && git add themes/blowfish-shore && git commit`。

## 11. Sass vs Tailwind

本仓库主题已选 Tailwind v4，不需要 Dart Sass。CI 不再 `sudo snap install dart-sass`。

模板中如需补充组件级样式，用 `<style>...</style>` 内嵌 + Hugo Pipes 处理：

```go
{{ $css := resources.Get "css/components/foo.css" | resources.Minify }}
<style>{{ $css.Content | safeCSS }}</style>
```

## 12. 模板 output formats

默认 `rss.xml` + `html` + `json` 已足够，不要添加未使用的 output（增加构建时间且没有意义）。

## 13. CJK 处理

```toml
# 站点 config.toml
defaultContentLanguage = 'zh'
languageCode = 'zh-Hans'
hasCJKLanguage = true
[languages.zh]
  languageName = '中文'
  weight = 1
[languages.en]
  disabled = true
  weight = 2
```

`hasCJKLanguage = true` 让 Hugo 用 zh 的字数计算（200 字/分钟）；不发往 Google 搜索时关一些国际化逻辑（zh/en 共享 CSS bundle 容易串扰）。

## 14. Markdown options

```toml
# themes/blowfish-shore/config/_default/markup.toml
[goldmark.renderer]
  unsafe = true   # blowfish-shore 允许 raw HTML，需配合 goldmark
[markup.goldmark.parser.attribute]
  block = true
  title = true
[markup.highlight]
  guessSyntax = true
  noClasses = false
```

blowfish-shore 已配置；本仓库主题形 `ignoreLogs = ['warning-goldmark-raw-html']` 已开。
