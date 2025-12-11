import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    ReactFlow,
    ReactFlowProvider,
    useReactFlow,
    type Edge,
    type Node,
    type OnConnectStart,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Hand, Trash2, Unlink } from 'lucide-react';
import { Toaster } from 'sonner';

import { AnimatedEdge } from '@/components/AnimatedEdge';
import { Button } from '@/components/ui/button';
import { ConnectionProvider, useConnection } from '@/context/connection-context';
import { notifyError } from '@/lib/toast';
import { opaqueId } from '@/lib/utils';
import { infraNodeTypes } from './components/nodes/infra-node';
import { getAvailableNodes, nodeConfigs, type NodeType } from './components/nodes/node-config';

type Mode = 'select' | 'remove-node' | 'remove-edge' | NodeType;

const nodeTypes = infraNodeTypes;

const initialNodes: Node[] = [
    {
        id: opaqueId('node'),
        type: 'start',
        position: { x: 0, y: 0 },
        data: { label: 'Load Balancer' },
    },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'compute',
    // 	position: { x: 200, y: 120 },
    // 	data: { label: 'Compute' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'database',
    // 	position: { x: 400, y: 0 },
    // 	data: { label: 'Database' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'cache',
    // 	position: { x: 400, y: 120 },
    // 	data: { label: 'Cache' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'queue',
    // 	position: { x: 600, y: 0 },
    // 	data: { label: 'Queue' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'storage',
    // 	position: { x: 600, y: 120 },
    // 	data: { label: 'Storage' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'firewall',
    // 	position: { x: -200, y: 0 },
    // 	data: { label: 'Firewall' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'cdn',
    // 	position: { x: -200, y: 120 },
    // 	data: { label: 'CDN' },
    // },
    // {
    // 	id: opaqueId('node'),
    // 	type: 'apigateway',
    // 	position: { x: 200, y: -100 },
    // 	data: { label: 'API Gateway' },
    // },
];

const initialEdges: Edge[] = [
    // {
    // 	id: opaqueId('edge'),
    // 	source: initialNodes[0].id,
    // 	target: initialNodes[1].id,
    // 	type: 'animated',
    // },
];

const edgeTypes = {
    animated: AnimatedEdge,
};

// Wrapper component to pass requests prop to AnimatedEdge
const AnimatedEdgeWithRequests = (props: any) => {
    return <AnimatedEdge {...props} requests={props.data?.requests || []} />;
};

function Flow() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [mode, setMode] = useState<Mode>('select');
    const [nodeCount, setNodeCount] = useState(3);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    // Game controller state
    const [gameStatus, setGameStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');
    const [gameSpeed, setGameSpeed] = useState<1 | 2 | 3>(1);
    // Game requests state
    // Each request tracks its current edge and progress
    const [requests, setRequests] = useState<
        {
            id: string;
            progress: number;
            edgeId: string;
            path: string[]; // edge ids to traverse
            done?: boolean;
        }[]
    >([]);

    // Generate initial requests when game starts, and clear on stop
    useEffect(() => {
        if (gameStatus === 'running') {
            // Initial burst
            const count = Math.floor(Math.random() * 11) + 5;
            const startNode = nodes.find((n) => n.type === 'start');
            function getPathFromNode(nodeId: string): string[] {
                const path: string[] = [];
                let currentNodeId = nodeId;
                let depth = 0;
                while (depth < 10) {
                    const nextEdge = edges.find((e) => e.source === currentNodeId);
                    if (!nextEdge) break;
                    path.push(nextEdge.id);
                    currentNodeId = nextEdge.target;
                    depth++;
                }
                return path;
            }
            const newRequests = Array.from({ length: count }, (_, i) => {
                const path = startNode ? getPathFromNode(startNode.id) : [];
                return {
                    id: `req-${Date.now()}-${i}`,
                    progress: 0,
                    edgeId: path[0],
                    path,
                };
            });
            setRequests(newRequests);
        } else if (gameStatus === 'stopped') {
            setRequests([]);
        }
    }, [gameStatus]);

    // Continuously generate requests while running
    useEffect(() => {
        if (gameStatus !== 'running') return;
        const interval = setInterval(() => {
            const startNode = nodes.find((n) => n.type === 'start');
            function getPathFromNode(nodeId: string): string[] {
                const path: string[] = [];
                let currentNodeId = nodeId;
                let depth = 0;
                while (depth < 10) {
                    const nextEdge = edges.find((e) => e.source === currentNodeId);
                    if (!nextEdge) break;
                    path.push(nextEdge.id);
                    currentNodeId = nextEdge.target;
                    depth++;
                }
                return path;
            }
            const path = startNode ? getPathFromNode(startNode.id) : [];
            if (path.length > 0) {
                setRequests((reqs) => [
                    ...reqs,
                    {
                        id: `req-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                        progress: 0,
                        edgeId: path[0],
                        path,
                    },
                ]);
            }
        }, 1000); // every second
        return () => clearInterval(interval);
    }, [gameStatus, nodes, edges]);

    // Game loop: update request progress
    useEffect(() => {
        if (gameStatus !== 'running' || requests.length === 0) return;
        const interval = setInterval(() => {
            setRequests((reqs) =>
                reqs.map((r) => {
                    if (r.done) return r;
                    if (r.progress < 1) {
                        return { ...r, progress: Math.min(1, r.progress + 0.01 * gameSpeed) };
                    } else {
                        // Move to next edge in path
                        const currentIndex = r.path.indexOf(r.edgeId);
                        const nextEdgeId = r.path[currentIndex + 1];
                        if (nextEdgeId) {
                            return { ...r, edgeId: nextEdgeId, progress: 0 };
                        } else {
                            return { ...r, done: true };
                        }
                    }
                }),
            );
        }, 50);
        return () => clearInterval(interval);
    }, [gameStatus, gameSpeed, requests.length, edges]);

    const { screenToFlowPosition } = useReactFlow();
    const { startConnection, endConnection } = useConnection();

    const availableNodes = useMemo(() => getAvailableNodes(), []);

    // Memoize edgeTypes to avoid React Flow warnings
    const memoizedEdgeTypes = useMemo(
        () => ({
            ...edgeTypes,
            animated: AnimatedEdgeWithRequests,
        }),
        [],
    );

    const handleModeChange = useCallback((newMode: Mode) => {
        setMode(newMode);
        setSelectedNodeId(null); // Clear selection when mode changes
    }, []);

    const onNodesChange = useCallback((changes: any) => {
        console.log('onNodesChange', changes);
        setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));
    }, []);

    const onEdgesChange = useCallback((changes: any) => {
        console.log('onEdgesChange', changes);
        setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
    }, []);

    const onConnect = useCallback(
        (params: any) => {
            console.log('onConnect', params);

            // Find source and target nodes
            const sourceNode = nodes.find((n) => n.id === params.source);
            const targetNode = nodes.find((n) => n.id === params.target);

            if (!sourceNode || !targetNode) {
                notifyError('Invalid connection: nodes not found');
                return;
            }

            const sourceType = sourceNode.type as NodeType;
            const targetType = targetNode.type as NodeType;

            const sourceConfig = nodeConfigs[sourceType];
            const targetConfig = nodeConfigs[targetType];

            // Check if the target node can receive connections from the source node type
            if (!targetConfig.allowedIncoming.includes(sourceType)) {
                notifyError(`${targetConfig.label} cannot receive connections from ${sourceConfig.label}`);
                return;
            }

            setEdges((edgesSnapshot) => addEdge({ ...params, type: 'animated' }, edgesSnapshot));
        },
        [nodes],
    );

    const onConnectStart: OnConnectStart = useCallback(
        (_, { nodeId, handleType }) => {
            if (nodeId && handleType) {
                const node = nodes.find((n) => n.id === nodeId);
                if (node?.type) {
                    startConnection(node.type as NodeType, handleType);
                }
            }
        },
        [nodes, startConnection],
    );

    const onConnectEnd = useCallback(() => {
        endConnection();
    }, [endConnection]);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            if (mode === 'remove-node') {
                // Don't allow removing system nodes (like start)
                const config = nodeConfigs[node.type as NodeType];
                if (config?.isSystemNode) {
                    notifyError('Cannot remove system nodes');
                    return;
                }
                setNodes((nds) => nds.filter((n) => n.id !== node.id));
                // Also remove connected edges
                setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
            } else if (mode === 'select') {
                // Click-to-connect: first click selects source, second click creates edge
                if (selectedNodeId === null) {
                    // First click - select the source node
                    setSelectedNodeId(node.id);
                } else if (selectedNodeId === node.id) {
                    // Clicked the same node - deselect
                    setSelectedNodeId(null);
                } else {
                    setSelectedNodeId(null);
                }
            }
        },
        [mode, selectedNodeId, nodes, edges],
    );

    const onEdgeClick = useCallback(
        (_: React.MouseEvent, edge: Edge) => {
            if (mode === 'remove-edge') {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
        },
        [mode],
    );

    const onPaneClick = useCallback(
        (event: React.MouseEvent) => {
            // Clear node selection when clicking on pane
            setSelectedNodeId(null);

            // If in select mode or remove modes, don't add nodes
            if (mode === 'select' || mode === 'remove-node' || mode === 'remove-edge') return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // mode is a NodeType when not 'select' or remove modes
            const nodeType = mode as NodeType;
            const config = nodeConfigs[nodeType];

            const newNode: Node = {
                id: opaqueId('node'),
                type: nodeType,
                position,
                data: {
                    label: config.label,
                },
            };

            setNodes((nds) => [...nds, newNode]);
            setNodeCount((c) => c + 1);
            setMode('select');
        },
        [mode, screenToFlowPosition, nodeCount],
    );

    return (
        <div className="flex h-screen w-screen flex-col">
            {/* Game Controller Bar */}
            <div className="flex h-14 items-center justify-center gap-2 border-b border-border bg-background px-4">
                <Button
                    onClick={() => {
                        setGameStatus('running');
                    }}
                    variant={gameStatus === 'running' ? 'default' : 'secondary'}
                    size="sm"
                >
                    Start
                </Button>
                <Button
                    onClick={() => {
                        setGameStatus('paused');
                    }}
                    variant={gameStatus === 'paused' ? 'default' : 'secondary'}
                    size="sm"
                >
                    Pause
                </Button>
                <Button
                    onClick={() => {
                        setGameSpeed(2);
                    }}
                    variant={gameSpeed === 2 ? 'default' : 'secondary'}
                    size="sm"
                >
                    2x
                </Button>
                <Button
                    onClick={() => {
                        setGameSpeed(3);
                    }}
                    variant={gameSpeed === 3 ? 'default' : 'secondary'}
                    size="sm"
                >
                    3x
                </Button>
                <Button
                    onClick={() => {
                        setGameStatus('stopped');
                        setGameSpeed(1);
                    }}
                    variant={gameStatus === 'stopped' ? 'default' : 'secondary'}
                    size="sm"
                >
                    Stop
                </Button>
                <span className="ml-4 text-xs text-muted-foreground">
                    Status: {gameStatus} | Speed: {gameSpeed}x
                </span>
            </div>
            <div className="relative flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges.map((edge) => ({
                        ...edge,
                        data: {
                            ...edge.data,
                            requests: requests.filter((r) => r.edgeId === edge.id && !r.done),
                        },
                    }))}
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
            <div className="flex h-16 items-center justify-center gap-2 overflow-x-auto border-t border-border bg-background px-4">
                <Button onClick={() => handleModeChange('select')} variant={mode === 'select' ? 'default' : 'secondary'} size="sm">
                    <Hand className="size-4" />
                    Select
                </Button>
                <Button onClick={() => handleModeChange('remove-node')} variant={mode === 'remove-node' ? 'default' : 'secondary'} size="sm">
                    <Trash2 className="size-4" />
                    Remove Node
                </Button>
                <Button onClick={() => handleModeChange('remove-edge')} variant={mode === 'remove-edge' ? 'default' : 'secondary'} size="sm">
                    <Unlink className="size-4" />
                    Remove Edge
                </Button>
                <div className="mx-2 h-8 w-px bg-border" />
                {availableNodes.map((config) => (
                    <Button
                        key={config.type}
                        onClick={() => handleModeChange(config.type)}
                        variant={mode === config.type ? 'default' : 'secondary'}
                        size="sm"
                        className="gap-1"
                    >
                        <img src={config.icon} alt={config.label} className="size-4" />
                        {config.shortLabel || config.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

function App() {
    return (
        <ReactFlowProvider>
            <ConnectionProvider>
                <Flow />
                <Toaster />
                {/* <Scene3D /> */}
            </ConnectionProvider>
        </ReactFlowProvider>
    );
}

export default App;
