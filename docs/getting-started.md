# Getting Started

## 环境

- Node >= 18
- pnpm >= 8

## 安装依赖

```bash
pnpm i
```

## 启动本地预览

```bash
pnpm --filter example run dev
```

默认访问：`http://localhost:5173`

## 常用工作空间命令

- 全仓构建：`pnpm -r build`
- 全仓检查：`pnpm -r typecheck`、`pnpm -r lint`、`pnpm -r test`
- 过滤运行：`pnpm --filter <name> run <script>`

## 发布与版本（概览）

- 版本策略：SemVer，使用 Changesets 管理
- 本地：`pnpm changeset` → `pnpm -w changeset version` → `pnpm -w changeset publish`
- 详细流程：见 [docs/releasing.md](releasing.md)
