# home / profile.html 重构与渲染修复笔记

> 记录一次对 `/` 首页迭代式调试的状态、踩过的坑、最终落地的样式与组件结构。
> 用途：将来碰类似问题（hero/masonry/诗签）时快速对照已知正确形态。

---

## 1. 起点

- 主题：`themes/blowfish-shore/`（submodule）
- 入口 partial：`layouts/partials/home/profile.html`
- 站点样式：`themes/blowfish-shore/assets/css/custom.css`（在 submodule 内直接编辑）
- vendor JS：`static/vendor/masonry/`、`static/vendor/imagesloaded/`（本地化，避免 unpkg 链接被 GFW 重置）

---

## 2. 迭代时间线（按修改先后）

| #  | 改了什么 | 文件 | 出现的新 bug |
| --- | --- | --- | --- |
| 1  | 补 `i18n/zh.yaml` 的 `article:` 段，时间/阅读时长/字数等 key 让中文版 fallback 不空 | `i18n/zh.yaml` | — |
| 2  | meta 行（时间、字数、阅读时长）现在被中文填充 | (build output) | — |
| 3  | masonry 初始化 + 本地 vendor，本地化避免 `ERR_CONNECTION_CLOSED` | `layouts/partials/extend-head.html` | vendor 之前在 unpkg，加载被 RST，断流后页面只有 hero 没瀑布流 |
| 4  | `.entrance-hero__card` 卡片宽度 + 媒体查询三档 | `themes/blowfish-shore/assets/css/custom.css` | — |
| 5  | masonry 第一张卡 2×1.4 hero 卡 width=colWidth*2+20 | `extend-head.html` | 标题被 `style.height` 截掉 |
| 6  | 移除 `style.height`，加 `.article-link--hero` class 改 thumbnail 撑卡 | `custom.css` + `extend-head.html` | — |
| 7  | 让 hero 卡 width=colWidth*2+gutter，CSS 加 `aspect-ratio` 让图本身撑高度 | 同上 | — |
| 8  | masonry `columnWidth: '.article-link--card'` 显式 selector | `extend-head.html` | 仍算 1 列 |
| 9  | masonry `columnWidth: colWidth` 显式数字（用 grid 父 innerW 算） | `extend-head.html` | 卡片高度 `16777213` （2^24）— 用了 blowfish 自带 `min-h-full` |
| 10 | `.entrance-recent .article-link--card { min-height: 0 }` 覆盖 min-h-full | `custom.css` | 高度修好 |
| 11 | masonry 改 fitWidth:false，grid 容器 width:100% | 二处 | 卡片宽度被 fitWidth 收窄 |
| 12 | 卡片 CSS `width: calc((100%-40px)/3)` + 媒体查询 | `custom.css` | — |
| 13 | `.entrance-hero__meta` flex → column、CTA pill 升级 (阴影/hover/箭头)、CTA 独立容器 `entrance-hero__cta-row` | `custom.css` + `profile.html` | — |
| 14 | `@[params.author].links` 嵌套数组（把顶层 github/twitter/email 等移过来），social 图标显示 | `config.toml` | — |
| 15 | 诗签 90° rotate + 128px + color-mix translucent，`.entrance-hero__verse-wrap` | `custom.css` | overflow 切掉 |
| 16 | 移除 overflow:hidden | `custom.css` | — |
| 17 | ASCII noise 拆 `.hr-char`，每字独立 inline-block 1ch | `extend-head.html` | hr-char `width:1ch` 在 128px 字号下 = 128px，每字独占一行，撑出 9 行 |
| 18 | **撤回 17**：noise 不拆 span，整段 `textContent` 替换，pool 用几何符号（·∴∵•◦▢△▲▼□◇○●）+ ASCII 字母 + 标点（行宽=final 字数，不撑 width） | `extend-head.html` | OK |
| 19 | JS init 改成 `if (document.readyState === "loading") addEventListener("DOMContentLoaded", bootVerse); else bootVerse();` | `extend-head.html` | 之前的"wrap not found"问题原因：`fonts.ready` callback 比 DOMContentLoaded 更早触发；defer script 在 head 末尾时 body 还没 parse 完 |
| 20 | VERSES POOL 12 句短诗，随机选一首（不重复上次，sessionStorage 留 last） | `extend-head.html` | — |
| 21 | 移除 CTA hover padding-right 扩宽（让 arrow 不撑 pill） | `custom.css` | — |
| 22 | 移除 `margin-right: -16px`（不要 negative margin 把箭头拉进 padding） | `custom.css` | — |
| 23 | `entrance-hero__cta-socials` 用 `inline-flex` 自适应内容宽，不撑 100% parent | `custom.css` | OK |
| 24 | `entrance-hero__cta-row` flex-wrap: nowrap + width: fit-content（CTA + icons 严格同 row） | `custom.css` | OK |

---

## 3. 最终 hero 结构（profile.html）

```
<article class="entrance-hero flex flex-col justify-end min-h-[78vh] py-12">
  <div class="entrance-hero__rail">00 / BACKYARD</div>

  <div class="entrance-hero__title-row">
    <h1 class="entrance-hero__title">长滩后院</h1>
    <div class="entrance-hero__socials">
      <span class="entrance-hero__socials-name">@東雲閑</span>
    </div>
  </div>

  <div class="entrance-hero__verse-wrap" aria-hidden="true">
    <p class="entrance-hero__verse" data-final="无上清凉花满席。">{{ headline }}</p>
  </div>

  <div class="entrance-hero__cta-row">
    <a class="entrance-hero__cta" href="/posts/">
      <span class="entrance-hero__cta-label">去看文章</span>
      <span class="entrance-hero__cta-arrow">→</span>
    </a>
    <div class="entrance-hero__cta-socials">
      {{ partialCached "author-links.html" . }}
    </div>
  </div>
</article>

{{ with .Content }}<section class="entrance-prose prose dark:prose-invert mt-12">{{ . }}</section>{{ end }}

<section class="entrance-recent">{{ partial "recent-articles/main.html" . }}</section>
```

### 3.1 CSS 选择器地图

| 选择器 | 责任 |
| --- | --- |
| `.entrance-hero` | 海报容器，padding L/R = `clamp(16px, 6vw, 96px)`，flex flex-col justify-end min-h 78vh |
| `.entrance-hero__rail` | mono 字号 "00 / BACKYARD" |
| `.entrance-hero__title` | `font-size: clamp(2.5rem, 7vw, 5.5rem)` Source Han Serif, `line-height:1`, letter-spacing -0.035em |
| `.entrance-hero__socials` `@title-row 内 | `display:flex align-items:flex-end gap:8px`，图标 opacity 0.6→1 on hover |
| `.entrance-hero__socials-name` | `@東雲閑` mono 0.875rem 灰色 |
| `.entrance-hero__verse-wrap` | `position:absolute; left:0; top:0; transform:rotate(90deg); width:100vh` 左缘旋转锚 |
| `.entrance-hero__verse` | 128px Source Han Serif, `color-mix(in srgb, rgb(var(--color-neutral-400)) 15%, transparent)`, `letter-spacing:0.04em` |
| `.entrance-hero__verse.is-final` | 终态 color 18% 透明 |
| `.entrance-hero__cta-row` | `display:flex; flex-direction:row; flex-wrap:nowrap; width:fit-content; align-items:center` + padding-top 24px |
| `.entrance-hero__cta-row::before` | 顶 64–160px primary 渐变软线（HUD 风） |
| `.entrance-hero__cta` | inline-flex pill, padding 8/16, border-radius 999px, layered gradient + 阴影 |
| `.entrance-hero__cta-label` | label 文本 |
| `.entrance-hero__cta-arrow` | `display:inline-block`, width:0 → `:hover { width:1.1em; margin-left:var(--rhythm-2); opacity:1; transform:translateX(0) }` |
| `.entrance-hero__cta-socials` | `display:inline-flex; align-items:center; flex-wrap:wrap; gap:8px` — 不撑 100% |
| `.article-link--card` | min-width:0（覆盖 blowfish min-w-full），width `calc((100%-40px)/3)` + 媒体查询 ≤1023 / ≤639，margin-bottom:20px 给 masonry row gap |
| `.entrance-recent > section.grid` | `display:block; width:100%; max-width:100%; position:relative; box-sizing:border-box`（masonry fitWidth:false） |

### 3.2 config.toml 关键块

```toml
[params.author]
name = '长滩后院'                 # h1 显示
image = '/me/avatar.png'
headline = '横剑夜听雨浸溪，无上清凉花满席。'   # 模板默认 verse；JS 启动后会被诗池随机一句覆盖

  [[params.author.links]]        # 不要省略这套数组结构：模板按 Author.links 遍历
  email = "shizuka@writeme.com"
  facebook = "Shinonome.Shizuka"
  instagram = "whitemage.null"
  twitter = "Kakoii_Souryo"
  bandcamp = "maira_yuki"
  cowlevel = "Shinonomeshizuka"
  github = "shinonome-shizuka"
  playstation = "SrvenX-07"
  steam = "shinonomeshizuka"

[languages.zh]
languageName = '中文'
weight = 1

[languages.en]
disabled = true
weight = 2
```

---

## 4. 已踩过的坑（防御性记忆）

### 4.1 theme 是 submodule，编辑要在 submodule 内
`themes/blowfish-shore/...` 的修改不进主 repo commit；但 hugo build 时直接读 submodule 实时文件。
**坑**：在主仓找文件读不到 → 实际在 `themes/blowfish-shore/`。所有 custom.css 编辑都是在这个路径下做的。

### 4.2 `hugo server` vs `hugo --gc`
- `hugo server` 启动内存模板缓存，**监听文件变化自动 rebuild，但启动后不会重新加载某些依赖结构**
- `hugo --gc` 写到 `public/`，但 dev server serve 来自内部模板，不从 `public/` 读
- **工作流**：编辑 extend-head.html / theme CSS → `hugo server` 已经自动 rebuild 并 reload 浏览器即可
- **当 reload 浏览器看不出变化**：可能 dev server 模板缓存没感知；要 `pkill -f 'hugo server'; hugo server` 重启
- 验证 dev server 是否 serve 新内容：`curl http://127.0.0.1:1313/ | grep <关键字>`；或用 CDP `evaluate_script` 查 DOM

### 4.3 vendor JS 本地化
`unpkg.com` 在某些网络环境（GFW / 公司代理）会 `ERR_CONNECTION_CLOSED`。
→ `static/vendor/masonry/`、`static/vendor/imagesloaded/` 放本地；HTML 引用 `/vendor/...`。hugo build 自动复制到 `public/vendor/...`。

### 4.4 masonry 卡片高度 = 2^24 (16777213) 的根因
blowfish 自带 `.article-link--card { min-h-full }`（Tailwind 的 `min-height:100%`）。masonry 把 article 设 `position:absolute` 后父级高度无明确值 → `min-height: 100%` fallback 到 16777213px (CSS spec overflow)。
**修复**：`.entrance-recent .article-link--card { min-height: 0 }` 覆盖。

### 4.5 Tailwind purge 合并 selector
写 `.foo:hover .bar, .foo.is-hover .bar { ... }` 时 purgecss 把 `:hover` 符号干掉，合并成 `.foo:hover .bar, .foo.is-hover .bar` = `.bar`。结果 base 即应用 hover 样式。
**避免**：拆成两条独立规则。

### 4.6 `color: rgb(var(--token-x) / 0.5)` 不工作
blowfish shore 颜色变量本身就是 `rgb(R, G, B)`；再包一层 `rgb(... / α)` 找不到第二个 rgb 函数。
**改用**：`color-mix(in srgb, rgb(var(--token-x)) 50%, transparent)`
或把变量声明成 `R, G, B` 数字列表，自己用 `rgba(var(--token-x), 0.5)`。

### 4.7 `.hr-char { width: 1ch }` 在大字号把字撑死
1ch 在 128px 字号 = 128px，每个字符 1ch 占位 → 单字独立一行。
**撤回**：noise 拆 span 思路放弃。改为**整段 textContent 替换**，pool 用几何符号 + ASCII + 标点，行宽 = final 字符串长度。

### 4.8 `document.fonts.ready` callback 比 DOMContentLoaded 早
defer script 在 head 末尾时执行，body 还没 parse 完。
**必须等 DOM**：用 `if (document.readyState === "loading") addEventListener("DOMContentLoaded", bootVerse); else bootVerse();`；fonts.ready 在 bootVerse 内 await 即可。

### 4.9 改完 CSS 没生效 → dev server 缓存
即使保存了文件 + 浏览器 `Ctrl+Shift+R`，dev server 还可能 serve 旧 bundle hash。
验证：CDP `evaluate_script` 读 `href` 拿到 css bundle 文件名，与 `themes/blowfish-shore/assets/css/` 编译产物对比。

---

## 5. 截图里程碑

1. **第一版正常瀑布流** + 中文时间/字数/阅读时长：i18n zh.yaml 后
2. **小字卡片（166×202）**：fitWidth:false + colWidth 算错导致卡片窄成 1 列
3. **第一张卡 2:1.4 hero**：colWidth*2+gutter 宽度 + thumbnail 设高 + 文字不被截
4. **CTA pill 升级**：阴影 + 渐变 + hover 箭头从雾浮出 + 顶部 ::before 软线
5. **诗签 ASCII noise**：左缘 90° 旋转 + 几何符号 noise 池 + 随机短诗
6. **最终 hero + CTA 同行 social**：CTA pill 右侧 inline-flex 排 9 个 social icons，@東雲閑 单独在 title 旁

---

## 6. 残留 TODO（不属于本次任务但已发现）

- [ ] `.entrance-hero__cta-row::before` 软线：可能与 `.entrance-hero__meta::before` 旧规则混淆，**meta 已重命名为 .entrance-hero__cta-row 但 CSS 里 `entrance-hero__meta` 仍有一些 `.entrance-hero__meta-sep` 规则**残留
- [ ] `.entrance-hero__verse` 在 viewport 变小（< 800px）时 128px 会撑出 hero：没加 clamp fallback
- [ ] 诗签 ASCII noise 是装饰，关掉也不影响视觉
- [ ] `.article-link--card` 的 margin-bottom:20px 在 masonry 跑后 row gap = 20，但 hover 时 hover 阴影 vs margin 视觉关系没测
