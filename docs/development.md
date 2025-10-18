# Development

## 脚本约定

- 每个包建议提供：`build`、`dev`、`test`、`lint`、`typecheck`、`format`
- 根级常用：
  - 全仓构建：`pnpm -r build`
  - 全仓检查：`pnpm -r typecheck`、`pnpm -r lint`、`pnpm -r test`
  - 过滤运行：`pnpm --filter <name> run <script>`

## 依赖与构建顺序

- 跨包依赖使用 `workspace:*`，确保版本对齐与正确的构建顺序
- pnpm 会根据依赖图决定构建与安装顺序，无需手工排程

## 共享构建配置

- 复用 `rollup.config.shared.mjs/.ts`：统一入口、格式与插件
- 可选 Vue 支持：按需启用（共享配置内已包含 Vue 插件选项）
- 输出格式：ESM/CJS 与 SourceMap；类型声明由 `tsc --emitDeclarationOnly` 生成

## TypeScript 继承

- 各包 `tsconfig.json` 继承 `tsconfig.base.json`
- 公共配置包含：`strict`、`declaration`、`paths`（如 `@example/*`）、`skipLibCheck`

## 本地验证流程

- 修改包代码 → 在示例应用中验证：`pnpm --filter example run dev`
- 示例自动扫描 `packages/**/*.example.vue` 与包 `README.md`
- 推荐将示例放在包的 `examples/` 目录

## 质量保障

- Lint：`eslint . --ext .ts,.tsx,.vue`
- 格式化：`prettier --write .`
- 提交前自动执行：`lint-staged`（通过 husky `pre-commit` 钩子）
