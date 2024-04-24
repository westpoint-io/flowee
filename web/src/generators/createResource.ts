export interface GroupNodeProps {
    id: string;
    position: { x: number; y: number };
    group: string;
    type: string
}

export const createResource = (groupProps: GroupNodeProps) => {

    const { id, position, group, type } = groupProps;

    return {
        id: id,
        position,
        parentId: group,
        extent: 'parent',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: {
            widthMultiplier: 1,
            type,
            heightMultiplier: 1,
        },
        type: 'resourceNode'
    };
}