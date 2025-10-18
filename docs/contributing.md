# Contributing

## 提交规范

- 采用约定式提交（conventional commits），示例：
  - `feat: 添加示例自动加载`
  - `fix: 修复构建脚本过滤路径`
- 强制校验：husky `commit-msg` 钩子运行 `pnpm commitlint --edit "$1"`

## 分支策略

- 主分支：`main`
- 功能分支：`feat/<短名>`；修复分支：`fix/<短名>`；文档分支：`docs/<短名>`
- PR 说明：清晰描述改动范围、影响面与测试方式

## 代码要求

- Lint 通过：`pnpm -w lint`
- 类型检查：`pnpm -r typecheck`
- 保持风格一致：见 [docs/style.md](style.md)

## 变更与发布

- 对外变更：使用 Changesets 创建记录：`pnpm changeset`
- 合并至 `main` 后由 Release 工作流自动处理版本与发布

## 本地开发建议

- 修改包后，在示例应用中验证：`pnpm --filter example run dev`
- 每个包至少提供统一脚本：`build/dev/test/lint/typecheck/format`
