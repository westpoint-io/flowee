import { createResource } from "./createResource";

export const createResourceNodes = (group: string, resourceData: any[], columnMultiplier: number = 1, manyItems: boolean) => {
    const newNodes: any = [];
    resourceData.forEach((resource: any, index: number) => {
        const newResource = createResource({
            id: resource.id,
            position: {
                x: 30,
                y: 100 * (manyItems ? index : columnMultiplier)
            },
            group,
            type: resource.type

        });
        newNodes.push(newResource);
    });

    return newNodes;
}