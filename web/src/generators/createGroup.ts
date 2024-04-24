export interface GroupNodeProps {
    id: string;
    position: { x: number; y: number };
    heightMultiplier?: number;
    widthMultiplier?: number;
}

export const createGroup = (groupProps: GroupNodeProps) => {

    const { id, position } = groupProps;

    return {
        id,
        position,
        data: { label: id, heightMultiplier: groupProps.heightMultiplier, widthMultiplier: groupProps.widthMultiplier},
        type: 'resourceGroup',
    };
}