import { Handle, type NodeProps } from '@xyflow/react';

import { useConnection } from '@/context/connection-context';
import { nodeConfigs, type NodeType } from './node-config';
import { NodeIcon } from './node-icon';

export interface InfraNodeData {
    label?: string;
    subtitle?: string;
    [key: string]: unknown;
}

interface InfraNodeProps extends NodeProps {
    nodeType: NodeType;
}

export function InfraNode({ nodeType, isConnectable, selected }: InfraNodeProps) {
    const config = nodeConfigs[nodeType];
    const label = config.shortLabel || config.label;
    const { connectionState } = useConnection();

    // Determine if this node can be a valid connection target
    const isValidConnectionTarget = () => {
        if (!connectionState.isConnecting) return true;

        // When connecting from a source handle, check if this node can receive the connection
        if (connectionState.handleType === 'source' && connectionState.sourceNodeType) {
            return config.allowedIncoming.includes(connectionState.sourceNodeType);
        }

        // When connecting from a target handle, check if this node can provide the connection
        if (connectionState.handleType === 'target' && connectionState.sourceNodeType) {
            const targetConfig = nodeConfigs[connectionState.sourceNodeType];
            return targetConfig.allowedIncoming.includes(nodeType);
        }

        return true;
    };

    // Determine if the target handle should be visible
    const shouldShowTargetHandle = () => {
        if (!config.handles.in) return false;
        if (!connectionState.isConnecting) return true;

        // When connecting from a source handle, show target handles that can receive this connection
        if (connectionState.handleType === 'source' && connectionState.sourceNodeType) {
            // Check if source can connect to this node AND this node can receive from source
            return config.allowedIncoming.includes(connectionState.sourceNodeType);
        }

        return true;
    };

    // Determine if the source handle should be visible
    const shouldShowSourceHandle = () => {
        if (!config.handles.out) return false;
        if (!connectionState.isConnecting) return true;

        // When connecting from a target handle, show source handles that can provide this connection
        if (connectionState.handleType === 'target' && connectionState.sourceNodeType) {
            const targetConfig = nodeConfigs[connectionState.sourceNodeType];
            // Check if this node can connect to target AND target can receive from this node
            return targetConfig.allowedIncoming.includes(nodeType);
        }

        return true;
    };

    const isValid = isValidConnectionTarget();

    return (
        <div className={`transition-opacity duration-200 ${!isValid ? 'pointer-events-none opacity-30' : ''}`}>
            <NodeIcon icon={config.icon} label={label} iconClassNames={config.iconClassNames} selected={selected} />

            {shouldShowTargetHandle() && (
                <Handle type="target" className="bg-background/70 p-1" position={config.handles.in!} isConnectable={isConnectable} />
            )}

            {shouldShowSourceHandle() && (
                <Handle type="source" className="bg-background/70 p-1" position={config.handles.out!} isConnectable={isConnectable} />
            )}
        </div>
    );
}

// Individual node components
export const LoadBalancerNode = (props: NodeProps) => <InfraNode {...props} nodeType="loadbalancer" />;

export const ComputeNode = (props: NodeProps) => <InfraNode {...props} nodeType="compute" />;

export const DatabaseNode = (props: NodeProps) => <InfraNode {...props} nodeType="database" />;

export const CacheNode = (props: NodeProps) => <InfraNode {...props} nodeType="cache" />;

export const QueueNode = (props: NodeProps) => <InfraNode {...props} nodeType="queue" />;

export const StorageNode = (props: NodeProps) => <InfraNode {...props} nodeType="storage" />;

export const FirewallNode = (props: NodeProps) => <InfraNode {...props} nodeType="firewall" />;

export const CDNNode = (props: NodeProps) => <InfraNode {...props} nodeType="cdn" />;

export const ApiGatewayNode = (props: NodeProps) => <InfraNode {...props} nodeType="apigateway" />;

export const Start = (props: NodeProps) => <InfraNode {...props} nodeType="start" />;

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
