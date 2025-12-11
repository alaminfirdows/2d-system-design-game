import { Handle, type NodeProps } from '@xyflow/react';

import { NodeIcon } from './node-icon';
import { nodeConfigs, type NodeType } from './node-config';
import { Activity } from 'react';

export interface InfraNodeData {
	label?: string;
	subtitle?: string;
	[key: string]: unknown;
}

interface InfraNodeProps extends NodeProps {
	nodeType: NodeType;
}

export function InfraNode({ nodeType, isConnectable }: InfraNodeProps) {
	const config = nodeConfigs[nodeType];
	const label = config.shortLabel || config.label;

	return (
		<div>
			<NodeIcon
				icon={config.icon}
				label={label}
				iconClassNames={config.iconClassNames}
			/>

			{config.handles.in && (
				<Handle
					type='target'
					className='bg-background/70 p-1'
					position={config.handles.in!}
					isConnectable={isConnectable}
				/>
			)}

			{config.handles.out && (
				<Handle
					type='source'
					className='bg-background/70 p-1'
					position={config.handles.out!}
					isConnectable={isConnectable}
				/>
			)}
		</div>
	);
}

// Individual node components
export const LoadBalancerNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='loadbalancer' />
);

export const ComputeNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='compute' />
);

export const DatabaseNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='database' />
);

export const CacheNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='cache' />
);

export const QueueNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='queue' />
);

export const StorageNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='storage' />
);

export const FirewallNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='firewall' />
);

export const CDNNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='cdn' />
);

export const ApiGatewayNode = (props: NodeProps) => (
	<InfraNode {...props} nodeType='apigateway' />
);

export const Start = (props: NodeProps) => (
	<InfraNode {...props} nodeType='start' />
);

// Node types mapping for React Flow
export const infraNodeTypes = {
	start: Start,
	loadbalancer: LoadBalancerNode,
	compute: ComputeNode,
	database: DatabaseNode,
	cache: CacheNode,
	queue: QueueNode,
	storage: StorageNode,
	firewall: FirewallNode,
	cdn: CDNNode,
	apigateway: ApiGatewayNode,
};
