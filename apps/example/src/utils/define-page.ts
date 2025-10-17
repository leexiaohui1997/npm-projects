import type { Component } from 'vue';

export type PageOptions = {
  name: string;
};

export type PageConfig = {
  component: Component;
  options: PageOptions;
  projectName: string;
  exampleName: string;
};

export const pages: PageConfig[] = [];

export default function definePage(config: PageConfig) {
  pages.push(config);
}
