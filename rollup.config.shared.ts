import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import type { OutputOptions, Plugin, RollupOptions } from 'rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

// Optional Vue support. This will only be used when enabled per-package.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import vue from 'rollup-plugin-vue';

type CreateConfigOptions = {
  input: string;
  pkg: {
    name?: string;
    dependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  tsconfig?: string;
  enableVue?: boolean;
  cssModules?: boolean;
};

export function createConfig(options: CreateConfigOptions): RollupOptions[] {
  const { input, pkg, tsconfig = 'tsconfig.json', enableVue = false, cssModules = false } = options;

  const externalDeps = new Set<string>([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'react',
    'react-dom',
    'vue',
  ]);

  const external = (id: string) => {
    if (externalDeps.has(id)) return true;
    // Treat workspace scoped packages as external as well
    if (/^@[^/]+\//.test(id)) return true;
    return false;
  };

  const isProd = process.env.NODE_ENV === 'production';

  const cssPlugins = [autoprefixer(), ...(isProd ? [cssnano({ preset: 'default' })] : [])];

  const basePlugins: Plugin[] = [
    peerDepsExternal(),
    nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts', '.tsx', '.vue'] }),
    commonjs(),
    postcss({
      extract: true,
      modules: cssModules ? { generateScopedName: '[local]__[hash:base64:5]' } : false,
      use: ['sass'],
      plugins: cssPlugins,
      minimize: isProd,
      sourceMap: true,
    }),
    typescript({ tsconfig }),
  ];

  const vuePlugins: Plugin[] = enableVue ? [vue()] : [];

  const outputBase: OutputOptions = { sourcemap: true };

  return [
    {
      input,
      external,
      plugins: [...vuePlugins, ...basePlugins],
      output: [
        { ...outputBase, format: 'esm', file: 'dist/index.mjs' },
        { ...outputBase, format: 'cjs', file: 'dist/index.cjs', exports: 'named' },
      ],
    },
  ];
}
