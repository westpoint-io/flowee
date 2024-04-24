import _ from 'lodash';
import { createGroup } from './createGroup';
import { createResourceNodes } from './createResourceNodes';
import { CustomNodeProps, Resource, SubGroupElement } from '../@types/node';

/**
 * Creates group nodes based on the provided groups and elements.
 *
 * @template T - The type of the elements.
 * @template K - The type of the keys in the elements.
 * @param {K[]} groups - An array of keys representing the groups.
 * @param {T} elements - An object containing the elements.
 * @returns  An array of group nodes and resource nodes.
 */
export const createGroupNodes = <T extends object, K extends keyof T>(groups: K[], elements: T) => {
  const groupNodes = [] as CustomNodeProps[];
  const resourceNodes: Resource[] = [];

  groups.forEach((group, index: number) => {
    const newGroup = createGroup({
      id: group as string,
      position: {
        x: index * 100,
        y: 0,
      },
      heightMultiplier: (elements[group] as [])?.length,
      widthMultiplier: 1,
    });

    const subgroups = _.groupBy(elements[group] as [], 'group');

    Object.keys(subgroups).forEach((subgroup: string, index: number) => {
      const subGroupResourceNodes = createResourceNodes(
        group as string,
        subgroups[subgroup] as unknown as SubGroupElement[],
        index,
        subgroup === 'undefined',
      );
      resourceNodes.push(...subGroupResourceNodes);
    });

    const newGroupNode = {
      ...newGroup,
      data: {
        ...newGroup.data,
        heightMultiplier: Object.keys(subgroups).length > 1 ? Object.keys(subgroups).length : newGroup.data.heightMultiplier,
      },
    } as CustomNodeProps;

    groupNodes.push(newGroupNode);
  });

  groupNodes.forEach((node: any, index: number) => {
    if (index > 0) {
      node.position.x = groupNodes[index - 1].position.x + groupNodes[index - 1].data.widthMultiplier * 100 + 50;
    }
  });

  if (groupNodes.length > 1) {
    const biggestGroup = groupNodes.reduce((prev, current) =>
      prev.data.heightMultiplier > current.data.heightMultiplier ? prev : current,
    );

    const height = biggestGroup.data.heightMultiplier * 110;

    // Vertical alignment

    groupNodes.forEach((node) => {
      node.position.y = height / 2 - node.data.heightMultiplier * 55;
    });
  }

  return [...groupNodes, ...resourceNodes] as CustomNodeProps[];
};
