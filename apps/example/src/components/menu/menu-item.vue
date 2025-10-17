<template>
  <div class="menu-item">
    <div
      class="menu-item-inner"
      :class="{ 'is-open': isOpen, 'is-folder': isFolder }"
      @click="onClickInner"
    >
      <div class="menu-item-icon">
        <el-icon :size="14">
          <component :is="menuIcon" />
        </el-icon>
      </div>
      <div class="menu-item-title">
        <span>{{ item.title }}</span>
      </div>
    </div>

    <template v-if="isFolder && item.children?.length">
      <div v-show="isOpen" class="menu-item-children">
        <MenuItem v-for="child in item.children" :key="child.id" :item="child" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Document, Folder, FolderOpened } from '@element-plus/icons-vue';
import { computed } from 'vue';
import type { CfgMenuItem } from '../../constants/menu';
import { useMenuContext } from './menu-context';

const props = defineProps<{
  item: CfgMenuItem;
}>();

const { checkIsOpen, toggleFolder, openFile } = useMenuContext();

const isFolder = computed(() => !!props.item.children);
const isOpen = computed(() => checkIsOpen(props.item.id));
const menuIcon = computed(() => {
  if (isFolder.value) {
    return isOpen.value ? FolderOpened : Folder;
  }
  return Document;
});

const onClickInner = () => {
  if (isFolder.value) {
    toggleFolder(props.item.id);
    return;
  }
  openFile(props.item.id);
};
</script>

<style lang="scss" scoped>
.menu-item {
  &-inner {
    gap: 4px;
    display: flex;
    align-items: center;
    line-height: 1;
    height: 24px;
    cursor: pointer;
    color: #333;
    user-select: none;
    &:hover {
      color: #000;
    }
    &.is-open:not(.is-folder) {
      color: $primary-color;
    }
  }

  &-children {
    padding-left: 18px;
  }
}
</style>
