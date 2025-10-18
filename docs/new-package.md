# New Package / App

## 目录与初始化

- 在 `packages/` 或 `apps/` 下创建目录
- 初始化 `package.json`（按需设置 `private`、`name`、`version` 等）

## tsconfig

- 在包内创建 `tsconfig.json` 并继承：

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

## 构建配置

- 复用 `rollup.config.shared.mjs/.ts`
- 在包根创建 `rollup.config.mjs`：

```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
import { createConfig } from '../../rollup.config.shared.mjs';

export default createConfig({ input: 'src/index.ts', pkg });
```

- 为需要 Vue 的包启用共享配置中的 Vue 选项（如有）

## 脚本与产物

- 在包的 `package.json` 添加脚本：

```json
{
  "scripts": {
    "build": "rollup -c && tsc --emitDeclarationOnly",
    "dev": "rollup -c -w",
    "test": "echo \"No tests yet\""
  }
}
```

- 产物建议：`main`（CJS）、`module`（ESM）、`types`（声明）、`exports`（入口映射）

## 依赖与版本

- 包间依赖使用 `workspace:*`，避免硬编码版本
- 对外依赖区分 `dependencies` 与 `peerDependencies`

## 示例与文档

- 在包根添加 `README.md`（将显示在示例应用 `/readme`）
- 在包内 `examples/` 添加示例文件：`*.example.vue`

## 验证与发布

- 本地验证：`pnpm --filter example run dev`
- 变更记录：`pnpm changeset` → `pnpm -w changeset version`
- 发布（如需）：`pnpm -w changeset publish` 或使用 Release 工作流
