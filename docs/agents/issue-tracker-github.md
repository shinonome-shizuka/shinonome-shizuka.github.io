# Issue Tracker: GitHub

> 仓库：`shinonome-shizuka/shinonome-shizuka.github.io`
> 默认分支：`master`
> 本文件登记 issue tracker 约定，被工程 skill 系列读取。

## Conventions

### Labels
mattpocock 默认 triage labels 已创建（与站点原 9 个 label 共存）：

| Label | Purpose |
|---|---|
| `needs-triage` | 新 issue，未分类 |
| `needs-info` | 等作者补充信息 |
| `ready-for-agent` | AI agent 可领走 |
| `ready-for-human` | 等人类拍板 |
| `wontfix` | 不修（与同名的 GH 默认 label 共存）|

预存 GH labels（保留）：
- `bug`、`documentation`、`duplicate`、`enhancement`、`good first issue`、`help wanted`、`invalid`、`question`、`wontfix`

### 命名约定
- 标题用 `动词 + 范围`，例："删除 grid-mist partial"
- 内容含：动机、改动文件、验收条件
- 用 checkbox `- [ ]` 而非 `* [ ]` 作任务清单

### Milestones
不使用。

## Pull requests as a triage surface

- PR 默认用 `<!--  closes #N  -->` 闭合相关 issue
- PR review 用本地 commit message 模式（Co-Authored-By）

## When a skill says "publish to the issue tracker"

1. 用 `gh issue create --repo shinonome-shizuka/shinonome-shizuka.github.io` 
2. 加 `--label ready-for-agent` （除非另有说明）
3. 标题用现状→期望格式
4. 体末尾带 `Co-Authored-By: AI <noreply@anthropic.com>`

## When a skill says "fetch the relevant ticket"

```bash
gh issue view <n> --repo shinonome-shizuka/shinonome-shizuka.github.io
```

## Auth

- `gh auth status` 已确认 108920216 shinonome-shizuka
- Git proxy: `http://127.0.0.1:7890`（全局）
