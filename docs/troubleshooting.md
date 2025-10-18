# Troubleshooting

## 安装失败

- 检查版本：`node -v`（>=18）、`pnpm -v`（>=8）
- 使用锁文件：`pnpm install --frozen-lockfile`

## 构建失败

- 统一脚本是否存在：包内需提供 `build`、`typecheck`、`lint`
- 依赖循环：检查包间依赖是否出现环；优先拆分或提升公共依赖
- 工作空间过滤：确认 `--filter` 路径正确（如 `./packages/**`）

## 端口被占用

- 示例应用端口冲突时，Vite 会自动切换；按终端提示访问

## 示例未出现

- 文件名后缀必须为 `.example.vue`
- 路径需在 `packages/` 下；建议放在包内 `examples/`
- 刷新左侧菜单（路由列表来源于包与示例扫描）

## Pages 路径错误

- GitHub Pages 需要正确的 `base`：`user.github.io` 用 `/`，其他仓库用 `/<repo>/`
- 可在工作流中固定 `--base` 或使用自动推导

## npm 发布失败

- 权限：检查 `NPM_TOKEN` 是否配置在仓库机密中
- 包名与作用域：确保拥有对应作用域的发布权限
- 版本：确保已通过 `changeset version` 更新版本号
