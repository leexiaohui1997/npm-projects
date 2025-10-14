import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export function createConfig({ input, pkg, tsconfig = 'tsconfig.json', enableVue = false, cssModules = false }) {
  const externalDeps = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'react',
    'react-dom',
    'vue',
  ]);

  const external = (id) => {
    if (externalDeps.has(id)) return true;
    if (/^@[^/]+\//.test(id)) return true;
    return false;
  };

  const isProd = globalThis?.process?.env?.NODE_ENV === 'production';
  const cssPlugins = [autoprefixer(), ...(isProd ? [cssnano({ preset: 'default' })] : [])];

  const basePlugins = [
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

  let vuePlugin = null;
  if (enableVue) {
    try {
      const mod = require('rollup-plugin-vue');
      vuePlugin = mod && (mod.default || mod);
    } catch (e) {
      throw new Error('Vue build requested but rollup-plugin-vue is not available. Install it and @vue/compiler-sfc.');
    }
  }
  const vuePlugins = enableVue && vuePlugin ? [vuePlugin({ compileTemplate: true })] : [];

  const outputBase = { sourcemap: true };

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