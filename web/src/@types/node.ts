import { CoordinateExtent, NodeProps } from 'reactflow';

type Position = { x: number; y: number };

export interface CustomNodeProps extends NodeProps {
  position: Position;
  parentId: string;
  extent?: 'parent' | CoordinateExtent;
}

export interface GroupNodeProps {
  id: string;
  position: Position;
  heightMultiplier?: number;
  widthMultiplier?: number;
}
