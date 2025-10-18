import { camelCase } from 'lodash-es';
import type { Component } from 'vue';
import type { PageOptions } from './utils/define-page';
import definePage from './utils/define-page';

const matches = import.meta.glob<{
  meta?: PageOptions;
  default: Component;
}>('../../../packages/**/*.example.vue', {
  eager: true,
});

Object.entries(matches).forEach(([filePath, module]) => {
  if (!module.meta) return;

  const res = filePath.match(/packages\/([^/]+)\/src\/([^/]+\/)*([^.]+)\.example\.vue$/);

  const projectName = camelCase(res?.[1] || '');
  const exampleName = camelCase(res?.[3] || '');

  definePage({
    component: module.default,
    options: module.meta,
    projectName,
    exampleName,
  });
});
