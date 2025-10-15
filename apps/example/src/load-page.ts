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
    definePage({
      component: module.default,
      options: module.meta,
    });
  }
});
