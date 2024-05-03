import { omit } from '../utils';
import { GroupNodeProps, CustomNodeProps } from '../@types/node';

/**
 * Creates a sub-group node with the given group properties and optional extra properties.
 * @param groupProps - The properties of the group node.
 * @param extraProps - Optional extra properties for the sub-group node.
 * @returns The created sub-group node.
 */
export const createSubGroup = (groupProps: GroupNodeProps, extraProps = {} as CustomNodeProps) => {
    const { id, position } = groupProps;
    const _extraProps = omit(['position', 'id', 'data'], extraProps);

    return {
        id,
        position,
        data: { label: id },
        style: {
            color: 'white',
        },
        ..._extraProps,
        type: 'subGroupNode',
    };
};
