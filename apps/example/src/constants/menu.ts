import { kebabCase } from 'lodash-es';
import { pages } from '../utils/define-page';

export type CfgMenuItem = {
  id: string;
  path: string;
  title: string;
  children?: CfgMenuItem[];
};

export const menu = pages.reduce((acc, item) => {
  if (!acc.some((i) => i.id === item.projectName)) {
    acc.push({
      id: item.projectName,
      title: item.projectName,
      children: [],
      path: '',
    });
  }

  const parent = acc.find((i) => i.id === item.projectName)!;
  parent.children?.push({
    id: `${item.projectName}#${item.exampleName}`,
    path: `/example/${kebabCase(item.projectName)}/${kebabCase(item.exampleName)}`,
    title: item.exampleName,
  });

  return acc;
}, [] as CfgMenuItem[]);
