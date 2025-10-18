import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
import { createConfig } from '../../rollup.config.shared.mjs';

export default createConfig({ input: 'src/index.ts', pkg });
