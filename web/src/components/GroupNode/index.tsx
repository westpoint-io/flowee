import { NodeProps } from 'reactflow';
import { ResourceGroup, ResourceGroupTitle, ResourceGroupTitleLabel } from './styles';

function GroupNode(props: NodeProps) {
  return (
    <ResourceGroup style={{
        height: 100 * props.data.heightMultiplier,
        width: 110 * props.data.widthMultiplier,
        marginTop: -30,
    }}>
      <ResourceGroupTitle>
        <ResourceGroupTitleLabel htmlFor="text">{props.data.label}</ResourceGroupTitleLabel>
      </ResourceGroupTitle>
    </ResourceGroup>
  );
}

export default GroupNode;
