# 可移植性说明 · "换 theme" 配方

## 目标检验

主仓库 `content/` + `config.toml` + `data/` + `assets/me/` 应当能在仅修改 `theme` 一行 + 几个 `[params]` 键的情况下迁移到任意兼容的 Hugo 主题。

## 步骤

### Step 1 · 改 `theme = '...'`

```toml
# config.toml
theme = '<新主题>'
```

### Step 2 · 对照 `[params]` 键

主题形键（迁移后应删除或留作站点覆盖）：
- `defaultFeaturedImage` — 主题默认 `images/default-cover.svg`，站点可改。
- `themeDisplayName` — 必填（被 `footer.powered_by` 渲染）。

站点形键（保留）：
- 身份：`siteName`, `title`, `description`, `headerTitle`, `motto`, `avatar`, `darkAvatar`, `author.*`, `email`, `social-handles`。
- 行为：`enableSearch`, `highlightjs*`, `defaultDark`, `darkNav`, `rss`, `accessCount`, `hotlinkFeatureImage`, `collapseBySummary`, `collapsibleTags`, `showSummaryCoverInPost`, `calloutInPost`, `maxTags`。
- 主题浏览器偏好（高风险）：`params.term.view = "simple"` 被 blowfish-shore 模板解读为默认 view；新主题可能忽略。
- CJK：`i18n = 'zh'`, `languageCode = 'zh-Hans'`, `hasCJKLanguage = true` 仍必须是站点级。

### Step 3 · shortcode 映射

| 主题形 shortcode | 在其他主题下的兜底 |
|----------------|-----------------|
| `bandcamp` | 缺则保留 `{{< bandcamp >}}` 调用会渲染为原始文本。可用 markdown 嵌入 `<iframe>` 替代。 |
| `music163` | 同上。 |
| `friendlink` | 同上。 |
| `strava` | 同上。 |
| `rss-episode` | 同上。 |

站内 71 篇文章中有 6 篇使用了上述 shortcode，迁移时建议保留 `layouts/shortcodes/` 兜底（最小 5 行 stub 输出原样调用文本），或人工逐篇替换为 `<iframe>`。

### Step 4 · 数据文件

- `data/tags.yaml` schema（`{slug, parent?, group?}`）由 blowfish-shore 模板消费；其他主题忽略。
- `data/category_history.json` 同上。

切主题时建议直接删除这两个数据文件，其他主题不需要它们。`category_history.json` 是 GH Actions 生成的，删除后下次构建自动重写（前提是 build script 的 glob 没被主题切换破坏）。

### Step 5 · 封面路径

| 资源 | 主题形 | 站点形 |
|------|------|------|
| `images/default-cover.svg` | 主题 assets 提供 | 可通过 `params.defaultFeaturedImage = '/images/foo.png'` 覆盖 |

若新主题不内置默认封面，要么把封面放 `static/images/` + 用站点 params 覆盖，要么让 `params.defaultFeaturedImage = ""` 关闭覆盖。

## 约束清单

不会因换主题而改变：

1. `[languages.en] disabled = true` — 站点级，CJK 需要独占 bundle。
2. `hasCJKLanguage = true` — Hugo 默认不会给 zh/zh-CN 用专门的 CJK 处理，必须显式开启。
3. `ignoreLogs = ['warning-goldmark-raw-html']` — Blowfish 站点习惯，其他主题可能接受更多 raw HTML。
4. `params.experimental.jsDate = true` + `jsDateFormat = "yyyy年MM月dd日"` — 站点偏好，相对浏览器运行时格式化日期。

迁移到不关心这些的主题时，可放心删。

## 验收（drop-in portability gates）

按 plans 文件 F 节：

1. 5 个主题形 shortcode 在主题 `layouts/shortcodes/` 下。
2. `params.defaultFeaturedImage` 主题默认提供。
3. `data/tags.yaml` schema 解耦。
4. `taxonomy/terms.html` 不绑死 taxonomy 名。
5. 所有 i18n key 都有 `default` filter 兜底。
6. `config.toml` 仅保留 site-shape 字段，没有 `path = themes/...` 引用。
7. `[languages.en] disabled` 与 `hasCJKLanguage = true` 在本文档标注。
8. `footer.powered_by` 通过 `{{ .Site.Params.themeDisplayName }}` 拼。
9. `theme.toml` 在主题目录声明 `[hugoVersion] min/max`。
10. CI 用 Hugo `0.163.3`，不使用 `latest`。
