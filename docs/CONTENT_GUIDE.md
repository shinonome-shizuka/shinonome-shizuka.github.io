# 内容创作指南 · 作者侧 frontmatter 规范

## 一篇标准 markdown 文章

存放：`content/post/<section>/<slug>.md`。`<section>` 是子目录：`note/`、`prose/`、`poem/`、`novel/`、`review/book/`、`review/game/`、`review/movie/`、`critc/society/`、`guide/game/<game>/`、`memory/`、`post/`。

```markdown
---
title: '文章标题（中英文皆可，单引号包裹）'
date: 2024-01-01T12:00:00+08:00
lastmod: 2024-01-02T08:00:00+08:00
draft: false
cover: 'https://images.unsplash.com/...'   # 远程 URL；本地 cover 一般不用
categories: [随笔]
tags: [思考, 人生]
callout: '一句话引言（出现在卡片顶部）'
color: '#005CFF'                            # 可选 · timeline 视图强调色
associate:                                  # 可选 · 关联商品卡
  name: '...'
  link: 'https://...'
referlink: 'https://...'                    # 可选 · 微信 / 公众号原文链接
---

正文……
```

## frontmatter 字段对照

| 键 | 类型 | 必填 | 主题依赖 |
|---|------|------|--------|
| `title` | string | ✓ | 无 |
| `date` | RFC3339 | ✓ | 无 |
| `lastmod` | RFC3339 | × | 无 |
| `draft` | bool | × | 无 |
| `cover` | URL | × | 无；用 `params.defaultFeaturedImage` 兜底 |
| `categories` | list of string | × | 参与 taxonomy 索引 |
| `tags` | list of string | × | 参与 taxonomy 索引 |
| `callout` | string | × | 显示在卡片顶部，被 `params.calloutInPost` 控制 |
| `color` | CSS color | × | **blowfish-shore**：timeline 视图强调色 |
| `associate` | object | × | **blowfish-shore**：卡片关联商品 |
| `referlink` | URL | × | **blowfish-shore**：转跳外链按钮 |
| `view` | `default\|timeline` | × | **blowfish-shore**：强制列表视图 |
| `cardView` | bool | × | **blowfish-shore**：卡片 vs 列表 |
| `groupByYear` | bool | × | **blowfish-shore**：按年分桶 |
| `shortTitle` / `subtitle` | string | × | 部分卡片 header 使用 |

## 主题形字段的迁移影响

标 ⚠️ 的字段仅在 blowfish-shore 主题下生效：

- `color`, `associate`, `referlink`, `view`, `cardView`, `groupByYear` — 其他主题会安静忽略。
- 切主题时建议：保留这些字段在 frontmatter 里（不破坏内容），但它们不再被渲染。

## shortcodes

| 主题形 shortcode | 例子 |
|------|------|
| `{{< music163 id=... type=... layout="player\|card\|slim" auto="0\|1" >}}` | 网易云音乐嵌入 |
| `{{< bandcamp id=... layout="small\|large\|card\|image" >}}` | Bandcamp 专辑 |
| `{{< strava id=... token=... type="activity-summary\|latest-rides" >}}` | Strava 活动 |
| `{{< friendlink name="..." link="..." desc="..." avat="..." color="..." >}}` | 友链卡 |
| `{{< rss-episode src="..." title="..." height="..." fallback="..." >}}` | RSS.com 节目卡 |

短代码可与 markdown 混用。迁移到其他主题时，shortcode 调用保留为纯文本会被 markdown 解析器显示成 `<music163 id=...>` 字面量，需要人工替换为对应的 `<iframe>` 嵌入。

## 写作风格

- 中文逗号 `，`、句号 `。` 全角；英文用半角，单引号优先。
- 引用用 `>` 块引。
- 代码块用三个反引号包代码块，blowfish-shore 主题已配 `highlightjs`（gruvbox-light / gruvbox-dark 配色）；额外加 `ocaml`。
- 链接：站内用 `/foo/` 相对路径；站外用完整 URL。
- 配图：远程 URL 优先（unsplash / 微博图床）；不上传到 `content/post/<slug>/` 资源 bundle。

## 日期格式

`date` 与 `lastmod` 用 RFC3339 + `+08:00` 时区：

```yaml
date: 2024-01-01T12:00:00+08:00
```

不要裸写 `2024-01-01`，Hugo 会按站点默认时区解析，与用户期望的"北京时间"有差。

## Taxonomy 词汇

- tags 和 categories 是 Hugo 默认 taxonomy；站点形实例在 `data/tags.yaml` 维护父子关系。
- 推荐 tags 用 1-3 字短词；categories 用 1-2 字标签（与 `data/tags.yaml` 中 `group` 桶大致对齐）。
- 主题形 CLOUD 视图按文章数加权字号，tags 加到 ≥5 个时会被裁剪（`params.maxTags = 5`）。

## archetype

执行 `hugo new post/note/07.md` 用 `archetypes/default.md`：

```yaml
---
title: '{{ replace .Name "-" " " | title }}'
date: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
lastmod: {{ .Date.Format "2006-01-02T15:04:05-07:00" }}
draft: true
cover: ''
categories: [随笔]
tags: [笔记]
---
```

可按作者习惯改 `categories: [随笔]` / `tags: [笔记]` 默认值。
