import { memo, useMemo } from 'react';
import {
    ReactFlow,
    type Edge,
    type Node,
    type OnConnectStart,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AnimatedEdge } from '@/components/AnimatedEdge';
import { infraNodeTypes } from './nodes/infra-node';
import { type NodeType } from './nodes/node-config';

type Mode = 'select' | 'remove-node' | 'remove-edge' | NodeType;

interface CanvasProps {
    nodes: Node[];
    edges: Edge[];
    mode: Mode;
    requests: Array<{
        id: string;
        progress: number;
        edgeId: string;
        path: string[];
        done?: boolean;
    }>;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (params: any) => void;
    onConnectStart: OnConnectStart;
    onConnectEnd: () => void;
    onPaneClick: (event: React.MouseEvent) => void;
    onNodeClick: (_: React.MouseEvent, node: Node) => void;
    onEdgeClick: (_: React.MouseEvent, edge: Edge) => void;
}

// Wrapper component to pass requests prop to AnimatedEdge
const AnimatedEdgeWithRequests = memo((props: any) => {
    return <AnimatedEdge {...props} requests={props.data?.requests || []} />;
});

AnimatedEdgeWithRequests.displayName = 'AnimatedEdgeWithRequests';

const nodeTypes = infraNodeTypes;

export const Canvas = memo(function Canvas({
    nodes,
    edges,
    mode,
    requests,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onConnectStart,
    onConnectEnd,
    onPaneClick,
    onNodeClick,
    onEdgeClick,
}: CanvasProps) {
    // Memoize edgeTypes to avoid React Flow warnings
    const memoizedEdgeTypes = useMemo(
        () => ({
            animated: AnimatedEdgeWithRequests,
        }),
        [],
    );

    // Map edges with current request data
    const edgesWithRequests = useMemo(
        () =>
            edges.map((edge) => ({
                ...edge,
                data: {
                    ...edge.data,
                    requests: requests.filter((r) => r.edgeId === edge.id && !r.done),
                },
            })),
        [edges, requests],
    );

    return (
        <div className="relative flex-1">
            <ReactFlow
                nodes={nodes}
                edges={edgesWithRequests}
                nodeTypes={nodeTypes}
                edgeTypes={memoizedEdgeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onPaneClick={onPaneClick}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                defaultEdgeOptions={{
                    type: 'animated',
                }}
                nodesDraggable={mode === 'select'}
                nodesConnectable={mode === 'select'}
                minZoom={0.3}
                maxZoom={2}
                fitView
                fitViewOptions={{ maxZoom: 1 }}
            />
        </div>
    );
});
