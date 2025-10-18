# Monorepo（pnpm workspace）

本仓库采用 pnpm 工作空间管理多包与应用，统一规范、脚本与 CI/CD。根文档只介绍工作空间与协作，不讨论任何具体包的功能或 API。

## 快速开始

- 环境：`Node >= 18`，`pnpm >= 8`
- 安装依赖：`pnpm i`
- 启动示例应用：`pnpm --filter example run dev`（默认 `http://localhost:5173`）
- 更多入门：见 [docs/getting-started.md](docs/getting-started.md)

## 示例添加（\*.example.vue）

- 放置：在目标包内创建 `examples/` 目录，文件名以 `.example.vue` 结尾
- 自动注册：示例应用会扫描 `packages/**/*.example.vue` 与包根 `README.md`
- 路由：包页 `/docs/<包-kebab>`；示例页 `/docs/<包-kebab>/<示例-kebab>`；Readme 页 `/docs/<包>/readme`
- 最小示例与规则：见 [docs/examples.md](docs/examples.md)

## 常用工作空间命令

- 全仓构建：`pnpm -r build`
- 全仓检查：`pnpm -r typecheck`、`pnpm -r lint`、`pnpm -r test`
- 过滤执行：`pnpm --filter <name> run <script>`（在指定包或应用运行脚本）

## 开发与协作

- 脚本约定：每个包建议提供 `build`、`dev`、`test`、`lint`、`typecheck`、`format`
- 依赖：跨包使用 `workspace:*`；构建顺序由依赖图决定
- 共享构建：复用 `rollup.config.shared.*`，按需启用 Vue 构建
- 详细流程：见 [docs/development.md](docs/development.md)

## 版本与发布

- 版本策略：SemVer；使用 Changesets 管理变更
- 本地流程：`pnpm changeset` → `pnpm -w changeset version` → `pnpm -w changeset publish`
- CI 自动发布：见 [docs/releasing.md](docs/releasing.md)

## CI/CD 与 Pages

- CI：push/PR 触发，安装→lint→构建
- Pages：构建示例应用并部署到 GitHub Pages，自动计算 `base`
- Release：基于 Changesets 的版本与发布
- 细节与修改指引：见 [docs/ci.md](docs/ci.md)

## 贡献与规范

- 提交规范：commitlint（通过 husky 强制校验）
- 代码规范：ESLint、Prettier、TypeScript 继承 `tsconfig.base.json`
- 贡献流程与分支策略：见 [docs/contributing.md](docs/contributing.md)、[docs/style.md](docs/style.md)

## 常见问题与新增包

- 排错指南：见 [docs/troubleshooting.md](docs/troubleshooting.md)
- 新增包/应用最小清单与模板：见 [docs/new-package.md](docs/new-package.md)

## 许可证

- MIT（见 [LICENSE](LICENSE)）
