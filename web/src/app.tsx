import ReactFlow, { Background, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { Edges, Items } from './test.json';
import GroupNode from './components/GroupNode';
import ResourceNode from './components/ResourceNode';
import SubGroupNode from './components/SubGroupNode';
import { useEffect, useState } from 'preact/hooks';
import { createGroupNodes } from './generators/createGroupNodes';
import { removeDuplicates } from './utils';

const nodeTypes = {
  resourceGroup: GroupNode,
  resourceNode: ResourceNode,
  subGroupNode: SubGroupNode,
};

type TypeServices = typeof Items;
type ServiceNames = keyof TypeServices;

const Elements = Items;

export function App() {
  const [elements, setElements] = useState<TypeServices>({} as TypeServices);
  const [nodes, setNodes] = useState<any>([]);
  const [edges, setEdges] = useState<any>([]);
  const [groups, setGroups] = useState<any>([]);

  useEffect(() => {
    // const Elements = Items;
    console.log(Elements);
    setElements(Elements);
    // setNodes([]);
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
    }));

    setEdges(newEdges);

    const sortedServiceNames = Object.keys(Elements).reverse();
    const filteredServiceNames = sortedServiceNames.filter((serviceName) => Elements[serviceName as ServiceNames].length > 0);

    setGroups(filteredServiceNames);
  }, []);

  useEffect(() => {
    const newNodes: any = createGroupNodes(groups, elements);
    setNodes(newNodes);
  }, [groups]);

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </>
  );
}
