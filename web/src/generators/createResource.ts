import { Position } from 'reactflow';
import { ResourceNodeProps } from '../@types/node';
/**
 * Creates a resource node object based on the provided group properties.
 * @param groupProps - The properties of the group node.
 * @returns The created resource node object.
 */
export const createResource = (groupProps: ResourceNodeProps) => {
  const { id, position, group, type } = groupProps;

  return {
    id: id,
    position,
    parentId: group,
    extent: 'parent' as 'parent',
    sourcePosition: 'right' as Position,
    targetPosition: 'left' as Position,
    data: {
      widthMultiplier: 1,
      type,
      heightMultiplier: 1,
    },
    type: 'resourceNode',
  };
};
