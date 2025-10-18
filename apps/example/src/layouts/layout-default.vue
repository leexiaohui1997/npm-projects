<template>
  <div class="layout-container">
    <div class="layout-aside">
      <docs-menu />
    </div>
    <div class="layout-main">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocsMenu from '../components/docs-menu/index.vue';
</script>

<style lang="scss" scoped>
.layout {
  &-container {
    height: 100dvh;
    display: flex;
  }

  &-aside {
    width: 200px;
    height: 100%;
    background: rgba($primary-color, 0.2);
    overflow: auto;
  }

  &-main {
    flex: 1;
    height: 100%;
    background: $bg-body;
  }
}
</style>
