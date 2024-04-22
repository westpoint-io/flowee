import { CustomNodeProps, GroupNodeProps } from "../@types/node";
import { omit } from "./omitKeys";

/**
 * Creates a group node with the given properties.
 * @param groupProps - The properties of the group node.
 * @param extraProps - Additional properties for the group node (optional).
 * @returns The created group node.
 */
export const createGroup = (
  groupProps: GroupNodeProps,
  extraProps = {} as CustomNodeProps
) => {
  const { id, position } = groupProps;
  const _extraProps = omit(["position", "id", "data", "type"], extraProps);

  return {
    id,
    position,
    data: { label: id },
    type: "resourceGroup",
    style: {
      width: 170,
      height: 540,
      fontSize: 32,
      color: "white",
    },
    ..._extraProps,
  };
};

/**
 * Creates a sub-group node with the given group properties and optional extra properties.
 * @param groupProps - The properties of the group node.
 * @param extraProps - Optional extra properties for the sub-group node.
 * @returns The created sub-group node.
 */
export const createSubGroup = (
  groupProps: GroupNodeProps,
  extraProps = {} as CustomNodeProps
) => {
  const { id, position } = groupProps;
  const _extraProps = omit(["position", "id", "data", "type"], extraProps);

  return {
    id,
    position,
    data: { label: id },
    type: "subGroupNode",
    style: {
      color: "white",
    },
    ..._extraProps,
  };
};
