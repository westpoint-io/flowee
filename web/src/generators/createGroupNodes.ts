import _ from "lodash";
import { createGroup } from "./createGroup";
import { createResourceNodes } from "./createResourceNodes";

export const createGroupNodes = (groups: string[], elements: any) => {
    const groupNodes: any = [];
    const resourceNodes: any = [];

    groups.forEach((group: string, index: number) => {
        const newGroup = createGroup({
            id: group,
            position: {
                x: index * 100,
                y: 0
            },
            heightMultiplier: elements[group].length,
            widthMultiplier: 1
        });

        const subgroups = _.groupBy(elements[group], 'group');
        Object.keys(subgroups).forEach((subgroup: string, index: number) => {
            const subGroupResourceNodes = createResourceNodes(group, subgroups[subgroup], index, subgroup === 'undefined');
            resourceNodes.push(...subGroupResourceNodes);
        });


        groupNodes.push({
            ...newGroup,
            data: {
                ...newGroup.data,
                heightMultiplier: Object.keys(subgroups).length > 1 ? Object.keys(subgroups).length : newGroup.data.heightMultiplier,
            }
        });


    });

    groupNodes.forEach((node: any, index: number) => {
        if (index > 0) {
            node.position.x = groupNodes[index - 1].position.x + groupNodes[index - 1].data.widthMultiplier * 100 + 50;
        }
    });

    if (groupNodes.length > 1) {

        const biggestGroup = groupNodes.reduce((prev: any, current: any) => (prev.data.heightMultiplier > current.data.heightMultiplier) ? prev : current);

        const height = biggestGroup.data.heightMultiplier * 110;

        // Vertical alignment

        groupNodes.forEach((node: any) => {
            node.position.y = height / 2 - node.data.heightMultiplier * 55;
        });

    }

    return [
        ...groupNodes,
        ...resourceNodes
    ];
}