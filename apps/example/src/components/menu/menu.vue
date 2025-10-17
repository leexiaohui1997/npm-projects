<template>
  <div class="menu">
    <MenuItem v-for="item in items" :key="item.id" :item="item" />
  </div>
</template>

<script setup lang="ts">
import type { CfgMenuItem } from '../../constants/menu';
import { useMenuContext } from './menu-context';
import MenuItem from './menu-item.vue';

const props = withDefaults(
  defineProps<{
    items?: CfgMenuItem[];
  }>(),
  {
    items: () => [],
  }
);

const menuContext = useMenuContext({ menu: props.items });

defineExpose({
  menuContext,
});
</script>

<style lang="scss" scoped>
.menu {
  padding: 4px 8px;
}
</style>
