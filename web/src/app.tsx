import ReactFlow, { Background, EdgeMarker, MarkerType, EdgeProps } from 'reactflow';
import 'reactflow/dist/style.css';
import { Edges, Items } from './schema.json';
import GroupNode from './components/GroupNode';
import ResourceNode from './components/ResourceNode';
import SubGroupNode from './components/SubGroupNode';
import { useEffect, useState } from 'preact/hooks';
import { createGroupNodes } from './generators/createGroupNodes';
import { removeDuplicates } from './utils';
import { CustomNodeProps } from './@types/node';

const nodeTypes = {
  resourceGroup: GroupNode,
  resourceNode: ResourceNode,
  subGroupNode: SubGroupNode,
};
const Elements = Items;

type TypeServices = typeof Elements;
type ServiceNames = keyof TypeServices;
interface EdgeProperties extends Omit<EdgeProps, 'markerStart' | 'id'> {
  markerStart: string | EdgeMarker;
  id: string;
}

export function App() {
  const [elements, setElements] = useState<TypeServices>({} as TypeServices);
  const [nodes, setNodes] = useState<CustomNodeProps[]>([]);
  const [edges, setEdges] = useState<EdgeProperties[]>([]);
  const [groups, setGroups] = useState<ServiceNames[]>([]);

  useEffect(() => {
    console.log(Elements);
    setElements(Elements);

    const noDuplicates = removeDuplicates(Edges);
    const newEdges = noDuplicates.map((edge) => ({
      ...edge,
      id: `${edge.source}-${edge.target}`,
      markerStart: {
        type: MarkerType.ArrowClosed,
        fill: '#C0C0C0',
        width: 50,
        height: 50,
        color: '#C0C0C0',
      },
      style: {
        stroke: '#C0C0C0',
        strokeWidth: 0.5,
      },
    })) as unknown as EdgeProperties[];

    setEdges(newEdges);

    const sortedServiceNames = Object.keys(Elements).reverse() as ServiceNames[];
    const filteredServiceNames = sortedServiceNames.filter((serviceName) => Elements[serviceName as ServiceNames].length > 0);

    setGroups(filteredServiceNames);
  }, []);

  useEffect(() => {
    const newNodes = createGroupNodes(groups, elements);
    setNodes(newNodes);
  }, [groups]);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </>
  );
}
