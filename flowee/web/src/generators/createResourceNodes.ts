import { Resource, SubGroupElement } from '../@types/node';
import { createResource } from './createResource';

/**
 * Creates resource nodes based on the provided data.
 *
 * @param group - The group of the resource nodes.
 * @param resourceData - An array of resource data.
 * @param columnMultiplier - The column multiplier for the y-position of the nodes. Default is 1.
 * @param manyItems - A boolean indicating whether there are many items.
 *                    If true, the y-position of each node will be multiplied by the index.
 * @returns An array of created resource nodes.
 */
export const createResourceNodes = (group: string, resourceData: SubGroupElement[], columnMultiplier: number = 1, manyItems: boolean) => {
  const newNodes = resourceData.map((resource: any, index: number) => {
    const newResource = createResource({
      id: resource.id,
      position: {
        x: 30,
        y: 100 * (manyItems ? index : columnMultiplier),
      },
      group,
      type: resource.type,
    });

    return newResource;
  }) as Resource[];

  return newNodes;
};
