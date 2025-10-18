<template>
  <div class="layout-docs">
    <el-tabs v-model="activePath" class="docs-tabs">
      <el-tab-pane :label="'README'" :name="readmePath" />
      <el-tab-pane
        v-for="demo in demoList"
        :key="demo.path"
        :label="demoLabel(demo.fileName)"
        :name="demo.path"
      />
    </el-tabs>
    <div class="docs-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { demoNameTranslate } from '../constants/translate';
import { examplePages } from '../load-pages';

const route = useRoute();
const router = useRouter();

const pageName = computed(() => {
  const matched = route.matched;
  const parent = matched[matched.length - 2];
  return String(parent?.name || '');
});

const page = computed(() => examplePages[pageName.value]);

const readmePath = computed(() => (page.value ? `${page.value.path}/readme` : ''));

const demoList = computed(() => (page.value ? Object.values(page.value.demos) : []));

function demoLabel(fileName: string): string {
  return (demoNameTranslate as Record<string, string>)[fileName] ?? fileName;
}

const activePath = computed({
  get() {
    return route.path;
  },
  set(name: string) {
    if (name && name !== route.path) {
      router.push(name);
    }
  },
});
</script>

<style scoped lang="scss">
.layout-docs {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.docs-tabs {
  --el-tabs-header-height: 50px;
  ::v-deep(.el-tabs__header) {
    padding: 0 16px;
    margin-bottom: 0;
  }
}

.docs-content {
  flex: 1;
  height: 0;
  padding: 12px;
  overflow: auto;
  background: $bg-body;

  ::v-deep(.markdown-body) {
    --bgColor-default: #{$bg-body} !important;
  }
}
</style>
