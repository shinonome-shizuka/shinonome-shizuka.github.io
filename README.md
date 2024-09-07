# shinonome-shizuka.github.io

HUGO BLOG on github pages.

杂文码字为主，没什么技术含量。

> 重新审视表达，重新审视世界。

Control is Power.

## To-do

- [x] 需要调整白天模式下callout的样式
  - [x] 琢磨明白原有主题的颜色切换原理
    - [x] 启动深色界面时增加`.inverted`
    - [x] 启动深色界面时`Avatar`也一起更换 
- [x] 增加两个音乐引用的shortcodes
  - [x] Bandcamp
    - `id`: track 或 album 的 `id`
    - `layout` 输出的样式
      - `small` 小条
      - `large` 大条
      - `card` 单个图
      - `image` 专辑列表
  - [x] 163
    - `id`: 音乐的id
    - `type`: 不明，但参数填不对无法引用
    - `layout`
      - `player` 专辑播放器样式
      - `card` 带专辑图的小播放器
      - `slim` 小条播放器
    - `auto`
      - `1` 自动播放
      - `0` 手动播放
- [x] 友链shortcodes
  - `name`：链接主标题
  - `link`：跳转链接
  - `desc`：链接副标题
  - `color`：边框及背景色
  - `avat`：主头像，50x50
- [x] Strava数据shortcodes
  - `id`：strava账号id，从小组件src里复制即可
  - `token`：授权token，从小组件src里复制即可
  - `type`：`activity-summary`或者`latest-rides`
- [x] static-shortcodes
  - 用来调用非md格式的md页面，主要为Fountain语法写的剧本

## Articles To-do

- [x] 处理草稿
- [x] 搬运其他地方的稿子
- [x] 街霸6教学的图要加
- [x] 七牛云海外图床域名配置完成
- [ ] 准备VAM的折腾新文章
- [ ] 准备一篇《蝇王》读后感
- [ ] 准备一篇《骆驼祥子》读后感
- [ ] 把炸了的图都换成七牛云图床

## Time to Rewrite

- [ ] 重写DJMAX新手入坑指南
- [ ] 重写IIDX好弟弟笔记
