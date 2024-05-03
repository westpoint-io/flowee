import { CoordinateExtent, NodeProps, Position } from 'reactflow';

type Location = { x: number; y: number };

export interface CustomNodeProps extends NodeProps {
  position: Location;
  parentId?: string;
  extent?: 'parent' | CoordinateExtent;
}

export interface GroupNodeProps {
  id: string;
  position: Location;
  heightMultiplier?: number;
  widthMultiplier?: number;
}

export interface ResourceNodeProps {
  id: string;
  position: Location;
  group: string;
  type: string;
}

export interface Resource {
  position: Location;
  id: string;
  parentId: string;
  extent?: 'parent' | CoordinateExtent;
  sourcePosition: Position;
  targetPosition: Position;
  type: string;
}

export interface SubGroupElement {
  id: string;
  name: string;
  properties: object;
  tier: string;
  type: string;
}
