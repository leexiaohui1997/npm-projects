import { computed, inject, provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { CfgMenuItem } from '../../constants/menu';
import { pageRoutes } from '../../router/routes';

const key = Symbol('MenuContext');

export type CreateMenuContextParams = {
  menu: CfgMenuItem[];
};
export function createMenuContext(params: CreateMenuContextParams) {
  const { menu } = params;
  const route = useRoute();
  const router = useRouter();

  const openFolderIds = ref(new Set<string>());
  const openFileId = computed(() => route.name as string);

  const checkIsOpen = (id: string) => {
    return openFolderIds.value.has(id) || openFileId.value === id;
  };
  const openFolder = (id: string) => {
    openFolderIds.value.add(id);
  };
  const closeFolder = (id: string) => {
    openFolderIds.value.delete(id);
  };
  const toggleFolder = (id: string) => {
    if (checkIsOpen(id)) {
      closeFolder(id);
    } else {
      openFolder(id);
    }
  };

  const openFile = (id: string) => {
    if (id !== openFileId.value && pageRoutes.some((route) => route.name === id)) {
      router.push({ name: id });
    }
  };

  return {
    menu,
    openFolderIds,
    openFolder,
    closeFolder,
    checkIsOpen,
    toggleFolder,
    openFile,
  };
}

export type MenuContext = ReturnType<typeof createMenuContext>;

export function useMenuContext(params?: CreateMenuContextParams): MenuContext {
  const context = inject(
    key,
    () => {
      const ctx = createMenuContext(params!);
      provide(key, ctx);
      return ctx;
    },
    true
  );
  return context;
}
