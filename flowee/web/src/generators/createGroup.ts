import { GroupNodeProps } from '../@types/node';

/**
 * Creates a group node with the given properties.
 * @param groupProps - The properties of the group node.
 * @returns The created group node.
 */
export const createGroup = (groupProps: GroupNodeProps) => {
  const { id, position } = groupProps;

  return {
    id,
    position,
    data: { label: id, heightMultiplier: groupProps.heightMultiplier, widthMultiplier: groupProps.widthMultiplier },
    type: 'resourceGroup',
  };
};
