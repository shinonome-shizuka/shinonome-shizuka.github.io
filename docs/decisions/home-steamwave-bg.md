# home / 蒸汽波背景设计语言

> 三层叠加：双层透视网格 + 中间 DotField 鼠标交互雾气。
> 颜色：扎染蓝 `#0900a7` / 青绿 `#00d4ff` / magenta `#ff00c8`。
> 用途：后续调整参考 + 防止误改甜点参数。

---

## 1. 三层结构（顶层到底层）

```
┌─────────────────────────────────────────────────┐
│  body::before  上层天花板（top: -10vh, height 80vh）  │
│  ────────────────────────────────────────  │
│                                                 │
│         .grid-mist  全 viewport + mask          │
│  ────────────────────────────────────────  │
│  body::after   下层地平面（bottom: 0, height 70vh）   │
└─────────────────────────────────────────────────┘
```

| 层 | z-index | 来源 | 形态 |
| --- | --- | --- | --- |
| 上层天花板 | -1 | `body::before` | 80px tile，rotateX -55°，magenta 上方远端光晕 |
| DotField 雾气 | -1 | `partials/grid-mist.html` | 鼠标 bulge + 扎染蓝 glow |
| 下层地平面 | -1 | `body::after` | 80px tile，rotateX 55°，顶部远端光晕 |

三层都用 `z-index: -1` 在所有内容下；内容层（main/header/footer）z-index auto 自然在上。

---

## 2. 上层天花板 `body::before`

```css
position: fixed;
top: -10vh;
left: -50vw;
right: -50vw;
width: 200vw;
height: 80vh;
transform: perspective(1500px) rotateX(-55deg) translateZ(0);
transform-origin: 50% 0%;
background-image:
  /* 远端辉光 · 底部 radial 光晕 */
  radial-gradient(ellipse 80% 60% at 50% 100%,
    rgba(9, 0, 167, 0.4) 0%,
    rgba(9, 0, 167, 0.2) 30%,
    transparent 65%),
  /* 锐利线条网格 */
  linear-gradient(rgba(9, 0, 167, 0.5) 1px, transparent 1px),
  linear-gradient(90deg, rgba(9, 0, 167, 0.5) 1px, transparent 1px);
background-size: 100% 100%, 80px 80px, 80px 80px;
animation: moveGrid80 3s linear infinite;
mask-image: linear-gradient(to bottom,
  transparent 0%, rgba(0,0,0,0.5) 10%,
  rgba(0,0,0,1) 40%, rgba(0,0,0,1) 70%,
  rgba(0,0,0,0.5) 90%, transparent 100%);
```

**关键参数**：

- `top: -10vh` + `height: 80vh` → 顶部溢出 10vh，制造"天花板更高"纵深感
- `width: 200vw` + `left/right: -50vw` → 左右溢出 viewport 50vw，旋转后远端网格不切边
- `perspective(1500px)` + `rotateX(-55deg)` → 上倾 55° 形成天花板效果
- `animation: moveGrid80` 步进 80px，对齐 tile（错位会跳）
- mask 中央 40%~70% 实色 + 上下 30% 渐隐 → 让 DotField 衔接处平滑

---

## 3. 下层地平面 `body::after`

```css
position: fixed;
bottom: 0;
left: -50vw;
right: -50vw;
height: 70vh;
width: 200vw;
transform: perspective(1500px) rotateX(55deg) translateZ(0);
transform-origin: 50% 100%;
background-image:
  /* 远端辉光 · 顶部 radial 光晕替代 subpixel 抖动 */
  radial-gradient(ellipse 80% 60% at 50% 0%,
    rgba(9, 0, 167, 0.45) 0%,
    rgba(9, 0, 167, 0.22) 30%,
    transparent 65%),
  linear-gradient(rgba(9, 0, 167, 0.55) 1px, transparent 1px),
  linear-gradient(90deg, rgba(9, 0, 167, 0.55) 1px, transparent 1px);
background-size: 100% 100%, 80px 80px, 80px 80px;
animation: moveGrid80 3s linear infinite;
mask-image: linear-gradient(to top,
  transparent 0%, rgba(0,0,0,0.5) 10%,
  rgba(0,0,0,1) 40%, rgba(0,0,0,1) 70%,
  rgba(0,0,0,0.5) 90%, transparent 100%);
```

**和上层的差异**：

- `bottom: 0` 锚定底部（origin 50% 100% 旋转出向上倾斜）
- 远端辉光位置改到顶部 0%（向上淡出）
- mask 方向 `to top`

---

## 4. 中间 DotField 雾气层

### 4.1 DOM 结构（partials/grid-mist.html）

```html
<div class="grid-mist" aria-hidden="true">
  <div class="grid-mist__inner">
    <canvas class="grid-mist__canvas"></canvas>
    <svg class="grid-mist__svg" aria-hidden="true">
      <defs>
        <radialGradient id="dotFieldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(9, 0, 167, 0.12)"/>
          <stop offset="35%" stop-color="rgba(9, 0, 167, 0.07)"/>
          <stop offset="70%" stop-color="rgba(9, 0, 167, 0.03)"/>
          <stop offset="100%" stop-color="rgba(9, 0, 167, 0)"/>
        </radialGradient>
      </defs>
      <circle class="grid-mist__glow" cx="-9999" cy="-9999" r="260" fill="url(#dotFieldGlow)"/>
    </svg>
  </div>
</div>
```

### 4.2 CSS（grid-mist 部分）

```css
.grid-mist {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom,
    transparent 0%, rgba(0,0,0,0.5) 10%,
    rgba(0,0,0,1) 40%, rgba(0,0,0,1) 70%,
    rgba(0,0,0,0.5) 90%, transparent 100%);
}
```

### 4.3 JS 行为

- 全 viewport canvas 点阵，`DOT_RADIUS=1.5, DOT_SPACING=14, CURSOR_RADIUS=500, BULGE_STRENGTH=67`
- 每个点存 `ax/ay` (rest 位置) + `sx/sy` (draw 位置)
- mousemove 跟踪鼠标，速度 `speed = sqrt(dx² + dy²)` 平滑
- `engagement = speed/5` 限速到 [0,1]，0.06 缓动
- 鼠标附近点被推开：`push = (1 - dist/cursorRadius)² × bulgeStrength × engagement`
- 离开后点用 0.1 系数缓动回原位
- 每帧 `clearRect` + 用线性 gradient（GRAD_FROM → GRAD_TO）填充所有点
- SVG `<circle>` 跟鼠标位置 + `glowOpacity` 缓动同步（鼠标移动时才显示）

### 4.4 颜色映射

| 用途 | 值 |
| --- | --- |
| canvas gradient start | `rgba(9, 0, 167, 0.32)` |
| canvas gradient end | `rgba(0, 212, 255, 0.22)` |
| glow 4 段渐变 | 0.12 / 0.07 / 0.03 / 0 |
| glow 半径 | r=260 |

---

## 5. 防 subpixel 抖动三件套

| 措施 | 作用 |
| --- | --- |
| `image-rendering: pixelated` | 远端线条不做 AA，要么 0 要么 1 |
| `translateZ(0)` | 强制 GPU 合成层，subpixel 误差小 |
| `will-change: background-position` | 提示浏览器把 bg-position 提到合成层 |

**外加**：动画步进必须 = tile 整数倍（80px tile → `moveGrid80` keyframes 走 80px）。错位会跳。

---

## 6. 甜点参数（不要随便改）

| 参数 | 值 | 来源 |
| --- | --- | --- |
| rotateX 角度 | ±55° | 30° 太弱、60° 太强 |
| perspective | 1500px | 500/1000 太抖、2000 透视消失、1500 平衡 |
| tile 间距 | 80px | 50 抖、120 太疏 |
| 上层高度 | 80vh | 上下溢出 +10vh，让天花板更高 |
| 下层高度 | 70vh | |
| 动画时长 | 3s linear | 太慢看不出流动，太快刺眼 |
| DotField dot radius | 1.5 | |
| DotField spacing | 14 | |
| DotField cursor radius | 500 | 太小 bulge 太近 |
| DotField bulge strength | 67 | 太大点飞太远 |
| Glow 半径 | 260 | 太大失去焦点 |

---

## 7. 关键文件位置

```
themes/blowfish-shore/
├── assets/css/custom.css          # body::before / body::after / .grid-mist
├── layouts/partials/grid-mist.html # DotField partial（HTML + SVG + JS）
├── layouts/partials/grain.html     # 空 placeholder（已废弃 grain.js）
└── assets/js/grain.js             # 已废弃（之前的 halftone canvas 实现）
```

---

## 8. 已废弃方案（避免重复尝试）

| 方案 | 失败原因 |
| --- | --- |
| `grain.js` canvas halftone | "没有美感" |
| `border-left` 实体几何线段 | 渲染不出来 |
| 纯 CSS gradient `<svg>` tile | 被 DotField 取代 |
| 单层 30vh 网格 | 太薄，蒸汽波感不足 |
| 3px 网格 + 0.5 alpha | 太弱 |
| perspective 200/500/1000/2000 | 1500 是甜点 |
| aurora WebGL shader | 用户回退到 DotField |
| 鼠标跟踪闪电特效 | 被移除 |
| 雾气层 noise 纹理 + 8s 漂移动画 | 被 DotField 取代 |
| SVG `<pattern>` 复古纹章 | 密度不均，无美感 |

---

## 9. 调参流程（防回归）

1. 改任意层之前先确认其他两层没动（避免三处同时漂移）
2. 颜色变量若要改，必须同步更新：
   - 两层 `body::before/after` 的 radial 光晕 + linear-gradient
   - DotField 的 `GRAD_FROM/GRAD_TO`
   - Glow 的 4 段 stop-color
3. 角度 / perspective / tile 改 → 必测远端是否抖动
4. 改 tile → 必同步改 `moveGrid80` keyframes 终点
5. `git push` 到 `shinonome-shizuka/blowfish-shore.git`（submodule 独立仓库）

---

## 10. 相关文档

- `HOME_REDESIGN.md` — 首页 hero / masonry / 诗签调试笔记
- `memory/feedback-steamwave-bg.md` — 同名 memory，简短摘要
- `memory/feedback-ponytail.md` — 用户偏好（Ponytail full + Caveman 中文 + 视觉细节）