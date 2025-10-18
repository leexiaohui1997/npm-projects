# Style Guide

## 文档风格

- 简短句、主动语态，每段只讲一件事
- 标题层级清晰，列表化呈现（4–6 条要点为佳）
- 所有命令、路径、文件名用反引号：如 `pnpm -r build`、`apps/example`
- 术语统一：工作空间、包/应用、Changesets、路由、预览

## 代码风格

- ESLint/Prettier：按仓库根配置执行
- TypeScript：严格模式、声明与 SourceMap 开启；继承 `tsconfig.base.json`
- 目录命名：小写-kebab；示例目录建议 `examples/`
- 文件命名：Vue 组件 `*.vue`；示例 `*.example.vue`

## 提交风格

- conventional commits：`type(scope?): subject`
- 常用类型：`feat`、`fix`、`docs`、`refactor`、`test`、`build`、`chore`
- 保持主题简短、明确，不超过 72 字符

## PR 风格

- 标题简要概述改动
- 描述包含动机、改动点、验证方式与影响范围
- 截图/日志（如涉及 UI 或构建输出）
