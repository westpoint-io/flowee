import { NodeProps } from "reactflow";
import { omit } from "../utils";
import { GroupNodeProps } from "./createGroup";

export const createSubGroup = (groupProps: GroupNodeProps, extraProps: NodeProps | {} = {}) => {

    const { id, position } = groupProps;
    const _extraProps = omit(["position", "id", "data"], extraProps);

    return {
        id,
        position,
        data: { label: id },
        type: 'subGroupNode',
        style: {
            color: 'white',
        },
        ..._extraProps,
    };
}