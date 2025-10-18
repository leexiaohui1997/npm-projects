# Examples（\*.example.vue）

## 放置与命名

- 目录：在目标包内创建 `examples/`
- 文件名：以 `.example.vue` 结尾；示例名采用 kebab-case

## 自动扫描与注册

- 示例应用会扫描 `packages/**/*.example.vue` 与包根 `README.md`
- 路由：
  - 包页：`/docs/<包-kebab>`
  - 示例页：`/docs/<包-kebab>/<示例-kebab>`
  - Readme 页：`/docs/<包>/readme`

## 最小示例

```vue
<template>
  <div>hello example</div>
</template>
<script setup lang="ts">
// 需要时在此导入包并演示用法
</script>
```

## 调试建议

- 启动示例应用：`pnpm --filter example run dev`
- 如未出现：确认文件名后缀为 `.example.vue` 且位于包的 `examples/` 下

## 加载逻辑

- 示例应用的扫描与路由注册逻辑在仓库 `apps/example/src` 中实现（例如 `load-pages.ts`）
