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

Object.values(matches).forEach((module) => {
  if (module.meta) {
    const res = (module.default as { __file: string }).__file.match(
      /packages\/([^/]+)\/src\/([^/]\/)*([^.]+)\.example\.vue$/
    );

    const projectName = camelCase(res?.[1] || '');
    const exampleName = camelCase(res?.[3] || '');

    definePage({
      component: module.default,
      options: module.meta,
      projectName,
      exampleName,
    });
  }
});
