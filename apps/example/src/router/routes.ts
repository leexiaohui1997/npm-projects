import { h } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { examplePages } from '../load-pages';

export const pageRoutes: RouteRecordRaw[] = [];
Object.values(examplePages).forEach((page) => {
  pageRoutes.push({
    name: page.name,
    path: page.path,
    redirect: `${page.path}/readme`,
    component: () => import('../layouts/layout-docs.vue'),
    children: [
      ...Object.values(page.demos).map((info) => ({
        name: info.name,
        path: info.path,
        component: info.component,
      })),
      {
        name: `${page.name}Readme`,
        path: `${page.path}/readme`,
        component: page.Readme || h('div'),
      },
    ],
  });
});

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/layout-default.vue'),
    children: [...pageRoutes],
  },
];

console.log(routes);
