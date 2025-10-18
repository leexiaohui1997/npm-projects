<template>
  <div class="layout-container">
    <div class="layout-aside">
      <docs-menu />
    </div>
    <div class="layout-content">
      <div class="layout-main">
        <router-view />
      </div>
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

  &-content {
    flex: 1;
    width: 0;
    height: 100%;
    background: $bg-body;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  &-main {
    padding: 16px;
  }
}
</style>
