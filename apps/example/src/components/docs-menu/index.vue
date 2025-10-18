<template>
  <nav class="docs-menu">
    <ul class="docs-menu-list">
      <li
        v-for="item in menuItems"
        :key="item.name"
        :class="['docs-menu-item', { 'is-active': isActive(item) }]"
        @click="goTo(item)"
      >
        <span class="docs-menu-label">{{ item.name }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useDocsMenu } from './useDocsMenu';

const { menuItems, isActive, goTo } = useDocsMenu();
</script>

<style scoped lang="scss">
.docs-menu {
  padding: 8px 0;
}

.docs-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-menu-item {
  cursor: pointer;
  padding: 8px 12px;
  color: #333;

  &.is-active {
    font-weight: 600;
    color: $primary-color;
    background-color: rgba($primary-color, 0.15);
    border-left: 3px solid $primary-color;
  }

  &:hover {
    background-color: rgba($primary-color, 0.1);
  }
}

.docs-menu-label {
  display: inline-block;
}
</style>
