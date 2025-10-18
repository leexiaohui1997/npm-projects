# Releasing

## 版本策略

- 使用 SemVer：`major.minor.patch`
- 通过 Changesets 管理变更与版本

## 本地发布流程

1. 创建变更：

```bash
pnpm changeset
```

2. 版本更新（批量写入所有受影响包）：

```bash
pnpm -w changeset version
```

3. 发布到 npm（需要 npm token）：

```bash
pnpm -w changeset publish
```

## CI 自动发布

- 触发：推送到 `main` 或手动 `workflow_dispatch`
- 工作流：`.github/workflows/release.yml`
  - 安装依赖与构建所有包
  - 将根 [LICENSE](../LICENSE) 复制到所有包目录
  - 运行 Changesets Action 执行 `version` 与 `publish`
  - 需要机密：`NPM_TOKEN`（写入 npm 认证）与默认 `GITHUB_TOKEN`
- Changesets 配置：`.changeset/config.json`
  - `access: public`、`baseBranch: main`、关闭 `changelog/commit`

## 注意事项

- 首次发布需要在 npm 上存在组织或包名的权限
- 工作流内使用 Node 20 与 pnpm 8；保持本地环境一致可减少差异
- 发布前建议在 CI 中通过构建与 lint/typecheck
