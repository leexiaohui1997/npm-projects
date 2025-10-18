# CI / Pages

## CI（构建与检查）

- 触发：任意分支 push 与 PR（`.github/workflows/ci.yml`）
- 步骤：
  - Checkout → 安装 pnpm → 安装 Node 20（缓存 pnpm）
  - 安装依赖：`pnpm install --frozen-lockfile`
  - Lint：`pnpm -w lint`
  - 构建库：`pnpm -r --filter ./packages/** run build`

## Pages（部署示例应用）

- 触发：推送到 `main` 或手动（`.github/workflows/pages.yml`）
- 步骤：
  - 安装依赖与准备环境
  - 计算 Vite `base`：仓库为 `user.github.io` 时使用 `/`，否则 `/<repo>/`
  - 类型检查示例应用：`pnpm --filter ./apps/example exec vue-tsc -b`
  - 构建示例应用：`pnpm --filter ./apps/example exec vite build --base "$BASE_PATH"`
  - 上传构建产物并部署到 GitHub Pages（`apps/example/dist`）
- 调整建议：若需要构建多个库或示例，请在工作流中添加相应的 `filter`

## Release（自动发布）

- 触发：推送到 `main` 或手动（`.github/workflows/release.yml`）
- 步骤：
  - 安装依赖与构建所有包
  - 复制根 [LICENSE](../LICENSE) 到每个包
  - 运行 Changesets Action：`version` 与 `publish`
  - 所需机密：`NPM_TOKEN`（npm 发布权限）

## 常见修改

- Node 版本或 pnpm 版本：在 `actions/setup-node` 与 `pnpm/action-setup` 块中调整
- 工作空间过滤：将 `./packages/**` 或 `./apps/example` 改为你的目录结构
- Pages 基础路径：可直接设置固定 `--base`，或保持自动推导
