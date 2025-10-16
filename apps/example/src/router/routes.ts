import { kebabCase } from 'lodash-es';
import type { RouteRecordRaw } from 'vue-router';
import { pages } from '../utils/define-page';

const pageRoutes: RouteRecordRaw[] = [];
pages.forEach((page) => {
  pageRoutes.push({
    name: `${page.projectName}#${page.exampleName}`,
    path: `/example/${kebabCase(page.projectName)}/${kebabCase(page.exampleName)}`,
    component: page.component,
  });
});

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: pageRoutes[0]?.path || '/example',
  },
  {
    path: '/example',
    component: import('../layouts/layout-default.vue'),
    children: [...pageRoutes],
  },
];

console.log({ routes });
