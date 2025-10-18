import { kebabCase } from 'lodash-es';
import { defineComponent, h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { pages } from '../utils/define-page';

export const pageRoutes: RouteRecordRaw[] = [];
pages.forEach((page) => {
  const name = `${page.projectName}#${page.exampleName}`;
  pageRoutes.push({
    name,
    path: `/example/${kebabCase(page.projectName)}/${kebabCase(page.exampleName)}`,
    component: defineComponent({
      name,
      render: () => h(page.component),
    }),
  });
});

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/example',
  },
  {
    path: '/example',
    component: () => import('../layouts/layout-default.vue'),
    children: [...pageRoutes],
  },
];
