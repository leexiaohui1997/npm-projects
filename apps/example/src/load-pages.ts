import { camelCase, kebabCase } from 'lodash-es';
import { type Component } from 'vue';

const pkgs = import.meta.glob('../../../packages/*/package.json', { eager: true });
const examples = import.meta.glob('../../../packages/**/*.example.vue');
const readmes = import.meta.glob('../../../packages/*/README.md');

export type PackageInfo = {
  name: string;
  version: string;
  [key: string]: any;
};

export type DemoInfo = {
  name: string;
  path: string;
  project: string;
  fileName: string;
  component: Component;
};

export type ExamplePage = {
  name: string;
  path: string;
  pkgInfo: PackageInfo;
  Readme: Component | null;
  demos: Record<string, DemoInfo>;
};

export const examplePages: Record<string, ExamplePage> = {};

Object.keys(pkgs).forEach((pkgPath) => {
  const [, pkgName] = pkgPath.match(/\/([^/]+)\/package\.json$/)!;
  const name = camelCase(pkgName);
  const path = `/docs/${kebabCase(pkgName)}`;
  const pkgInfo = pkgs[pkgPath] as PackageInfo;
  const pkgDir = pkgPath.replace('/package.json', '');
  const readmePath = `${pkgDir}/README.md`;
  const Readme = readmes[readmePath] as Component | null;
  const demos: Record<string, DemoInfo> = {};
  Object.keys(examples)
    .filter((examplePath) => examplePath.includes(pkgDir))
    .forEach((examplePath) => {
      const [, exampleName] = examplePath.match(/\/([^/]+)\.example\.vue$/)!;
      const demoName = camelCase(`${pkgName}-${exampleName}`);
      const path = `/${kebabCase(demoName)}`;
      demos[demoName] = {
        name: demoName,
        path,
        project: name,
        fileName: camelCase(exampleName),
        component: examples[examplePath] as Component,
      };
    });

  examplePages[name] = {
    name,
    path,
    pkgInfo,
    Readme,
    demos,
  };
});
