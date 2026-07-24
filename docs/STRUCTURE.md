# 仓库结构 · 迁移后

抽取后仓库被切分成 **站点 + 主题** 两层。

## 主仓库 (本仓库)

```
.
├── content/                # 全部文章（71 篇以上，含 paginator 与 section 列表页共 181 页）
│   ├── _index.md           # 首页 frontmatter
│   ├── about/              # 关于分区
│   ├── me/                 # 身份与友链 bundle
│   ├── post/               # 主体内容（review/note/prose/poem/novel/...）
│   └── ...                 # 站点自定义类型可继续添加
├── config.toml             # 站点级：baseURL · title · language · params.*(themeDisplayName 等) · languages.zh
├── data/
│   ├── tags.yaml           # 实例树：{slug, parent?, group?}
│   └── category_history.json  # GH Actions 生成 · 主题根据"上次快照"做新增高亮
├── assets/me/              # 站点形身份资源（avatar.png, background@zetsubo.jpg）
├── archetypes/default.md
├── layouts/
│   ├── partials/extend-head.html  # 站点级 head 注入（当前为空 stub）
│   └── partials/home/podcast.html # 站点硬编码播客（按站点形态保留）
├── docs/                   # 本目录：设计 + 抽取文档
├── .github/workflows/hugo.yml   # Hugo 0.163.3+extended 构建 + Pages 部署
├── .gitmodules             # 仅保留 themes/blowfish-shore
├── .hugo_build.lock
└── themes/blowfish-shore/  # git submodule（保留）
```

## 主题仓库 (themes/blowfish-shore, 独立仓库)

```
themes/blowfish-shore/
├── layouts/
│   ├── 404.html
│   ├── _default/list.html         # 含 view: timeline 分支
│   ├── _default/term.html         # 含 view: timeline + entrance-hero rail
│   ├── taxonomy/terms.html        # CLOUD + HIERARCHY + DISTRIBUTION
│   ├── partials/
│   │   ├── article-link/{card,timeline}.html   # entrance-* 变体
│   │   ├── recent-articles/cardview.html       # 3 列卡片栅格
│   │   └── extend-head.html                    # vendor 资源 + reveal 加载
│   └── shortcodes/
│       ├── bandcamp.html
│       ├── friendlink.html
│       ├── music163.html         # 已修 type=type= bug
│       ├── strava.html
│       └── rss-episode.html
├── assets/
│   ├── css/{custom.css (1987L), tokens.css, dark-mode.css, schemes/shore.css, components/*}
│   ├── images/default-cover.svg    # 主题形默认封面
│   ├── js/verse-reveal.js          # 一言 + ASCII noise 渐显
│   └── vendor/{imagesloaded,masonry}/*.min.js
├── i18n/zh.yaml                    # 含 powered_by (themeDisplayName 参数化)
├── data/*.json                     # stock blowfish，主题自带
├── static/{fonts,favicons}/
├── config/_default/{hugo.toml, params.toml, languages.en.toml, menus.en.toml, markup.toml, module.toml}
├── theme.toml
└── go.mod
```

## 责任分工

| 关注点 | 站点根 | 主题 |
|------|------|------|
| 文章 / 内容 | ✓ |  |
| 文章 frontmatter | ✓ |  |
| 站点身份 (avatar/socials) | ✓ |  |
| 站点标题、author.links | ✓ |  |
| 数据实例 (tags.yaml, category_history.json) | ✓ |  |
| 主题品牌色 / 调色板 |  | ✓ |
| 设计 tokens / 自定义 CSS |  | ✓ |
| ASCII noise / 诗签 reveal |  | ✓ |
| 短代码 |  | ✓ |
| 404 编辑式 |  | ✓ |
| 列表 / 分类 / 时间轴 view |  | ✓ |
| Vendor 资源 |  | ✓ |
| 站点形 head 注入 / 站点形 home | ✓ |  |
