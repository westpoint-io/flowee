import { Handle, NodeProps, Position } from 'reactflow';

function ResourceNode(props: NodeProps) {
  return (
    <div style={{ width: '50px', height: '50px' }}>
      <Handle type="target" position={Position.Right} isConnectable={props.isConnectable} />
      <img style={{ width: '100%', height: '100%' }} src={`./assets/${props.data.type}.png`} />
      <Handle type="source" position={Position.Left} id="b" isConnectable={props.isConnectable} />
    </div>
  );
}

export default ResourceNode;
