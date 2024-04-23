import ReactFlow, { Background } from 'reactflow';
import GroupNode from '../../components/GroupNode';
import ResourceNode from '../../components/ResourceNode';
import SubGroupNode from '../../components/SubGroupNode';
import { Edges, Items } from '../../test.json';
import { CustomNodeProps } from '../../@types/node';
import { createGroup, createSubGroup } from '../../utils/createGroups';

const nodeTypes = {
  resourceGroup: GroupNode,
  resourceNode: ResourceNode,
  subGroupNode: SubGroupNode
};

type GroupList = {
  [key: string]: any[];
};

type Groups = keyof typeof Items;

const nodes: CustomNodeProps[] = [];
const edges: { id: string; source: string; target: string }[] = [];

export function MainPage() {
  const data = Items;

  const groups = Object.keys(data) as unknown as Groups[];
  const groupsList: GroupList = {};
  let maxChildren = 0;

  groups.reverse().forEach((group, index: number) => {
    const groupNode = createGroup({
      id: group,
      position: { x: index * 200, y: 0 }
    });

    nodes.push(groupNode);

    groupsList[group] = [];
    const groupData = data[group];
    const subGroups: string[] = [];
    groupData.forEach((element) => {
      if ('group' in element) {
        if (!subGroups.includes(element.group)) {
          subGroups.push(element.group);
          nodes.push(
            createSubGroup(
              {
                id: element.group,
                position: { x: 0, y: subGroups.length * 100 }
              },
              { parentId: group } as CustomNodeProps
            )
          );
          // _group = element.group ;
        }
        groupsList[group].push(element.name);
        nodes.push({
          id: element.id,
          position: {
            x: 60,
            y: 100 * subGroups.length
          },
          data: {
            label: element.name,
            type: element.type
          },
          parentId: group,
          extent: 'parent',
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'resourceNode'
        } as CustomNodeProps);
      } else {
        groupsList[group].push(element.name);
        const groupListLength = groupsList[group].length;
        nodes.push({
          id: element.id,
          position: {
            x: 60,
            y: 100 * groupListLength
          },
          data: {
            label: element.name,
            type: element.type
          },
          parentId: group,
          extent: 'parent',
          sourcePosition: 'right',
          targetPosition: 'left',
          type: 'resourceNode'
        } as CustomNodeProps);
      }

      if (subGroups.length > maxChildren) {
        maxChildren = subGroups.length;
      }
    });

    if (maxChildren < 5) {
      maxChildren = 5;
    }
    nodes.forEach((node: any) => {
      node.data.count = maxChildren;
    });
  });

  // Centralize the nodes
  groups.reverse().forEach((group: string) => {
    const filteredNodes = nodes.filter((node) => node.parentId === group);
    const totalHeight = maxChildren * 110;
    const centerY = totalHeight / 2;
    const nodeCenterIndex = Math.floor(filteredNodes.length / 2);
    const newY = centerY - nodeCenterIndex * 110;
    console.log(nodeCenterIndex);

    if (filteredNodes.length <= 5) {
      filteredNodes
        .filter((node) => ['resourceNode', 'subGroupNode'].includes(node.type))
        .forEach((node, index: number) => {
          console.log(
            `${group} :::: totalheight: ${totalHeight} / howManyGroups: ${filteredNodes.length} = ${totalHeight / filteredNodes.length}`
          );

          if (node.type === 'resourceNode') {
            console.log('node', node);
            const subGroup = nodes.find((n) => n.id === node.id);
            (subGroup as CustomNodeProps)['position']['y'] = newY + index * 110;
          }
        });
    }
  });

  Edges.forEach((edge) => {
    edges.push({
      id: `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target
    });
  });

  return (
    <section style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background gap={16} />
      </ReactFlow>
    </section>
  );
}
