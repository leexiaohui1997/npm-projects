import { computed } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
import { pageRoutes } from '../../router/routes';

export type MenuItem = {
  name: string;
  path: string;
};

export function useDocsMenu() {
  const route = useRoute();
  const router = useRouter();

  const menuItems = computed<MenuItem[]>(() =>
    pageRoutes
      .filter((r: RouteRecordRaw) => !!r.name && !!r.path)
      .map((r: RouteRecordRaw) => ({ name: String(r.name), path: r.path }))
  );

  function isActive(item: MenuItem): boolean {
    return route.matched.some((m) => m.name === item.name);
  }

  function goTo(item: MenuItem): void {
    if (!isActive(item)) {
      router.push(item.path);
    }
  }

  return {
    menuItems,
    isActive,
    goTo,
  };
}
