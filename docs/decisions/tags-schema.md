# 主题数据 schema · longbeach-shore

本目录是主题形数据 schema 的参考文档。**实例数据仍归站点根** `data/`，主题不强制要求存在。

## `data/tags.yaml`

主题 `layouts/taxonomy/terms.html` 在以下两种视图下读取此文件：

1. **TREES**（仅 tags 路由可见）：按 `group` 分桶 → 每桶内列出无 `parent` 的根级 slug → 嵌套显示有 `parent` 的子级 slug（最多 3 层）。
2. **CATEGORIES 分布图**：仅 categories 路由可见。读 `category_history.json`，与"上次构建快照"对比增长。

### Schema

```yaml
# data/tags.yaml （站点形实例 · 主题不内置）
- slug: rust                # 必填，taxonomy term 的字面 key，与 content/post/**/*.md 的 tags 数组里的字符串严格相等
  parent: lang              # 可选，slug（lower-case 匹配），被引用为父节点
  group: 技术               # 可选，TREES 视图的分桶名
```

字段要求：
- `slug` 必填。
- `parent` 可选；存在时表示该 slug 是别的 slug 的子节点。父 slug 也必须出现在表里。
- `group` 可选；存在时该 slug 出现在 TREES 视图的对应桶里。Categories 视图忽略 `group`。

### 主题不强制存在

若站点省略 `data/tags.yaml`，TREES 视图整块静默不渲染，CATEGORIES 视图继续正常工作。CLOUD 视图也独立工作（只用 `site.Taxonomies`）。

## `data/category_history.json`

GH Actions 在每次构建前扫 content/，重写该文件：

```json
{
  "generated_at": "2025-01-01T00:00:00Z",
  "snapshot": {
    "随笔": 12,
    "散文": 7
  }
}
```

主题 `terms.html` 在 categories 路由下用 `snapshot` 对比本期与"上次构建"的差值，给"最近新增"绿色圆点。文件缺失或 `snapshot` 为空时差值 = 0（不出错）。

### 主题不强制存在

缺失时全部差值显示为 0，无新增圆点。
