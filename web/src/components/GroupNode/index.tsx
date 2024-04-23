import { NodeProps } from 'reactflow';

function GroupNode(props: NodeProps) {
  console.log(props.data.count);
  return (
    <div
      class="resource-group"
      style={{
        height: 110 * props.data.count,
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }}
    >
      <div
        class="resource-group-title"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22
        }}
      >
        <label htmlFor="text">{props.data.label}</label>
      </div>
    </div>
  );
}

export default GroupNode;
