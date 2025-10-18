module.exports = {
  extends: ['../../.eslintrc.cjs'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  globals: {
    ElMessage: 'readonly',
  },
};
