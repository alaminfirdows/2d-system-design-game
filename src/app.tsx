import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	ReactFlow,
	ReactFlowProvider,
	useReactFlow,
	type Edge,
	type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Hand, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Toaster } from 'sonner';

import { AnimatedEdge } from '@/components/AnimatedEdge';
import { Button } from '@/components/ui/button';
import { notifyError } from '@/lib/toast';
import { opaqueId } from '@/lib/utils';
import { infraNodeTypes } from './components/nodes/infra-node';
import { nodeConfigs, type NodeType } from './components/nodes/node-config';

type Mode = 'dnd' | 'add';

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

function Flow() {
	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);
	const [mode, setMode] = useState<Mode>('dnd');
	const [nodeCount, setNodeCount] = useState(3);

	const { screenToFlowPosition } = useReactFlow();

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

			// Check if the source node can connect to the target node type
			if (!sourceConfig.allowedOutgoing.includes(targetType)) {
				notifyError(
					`${sourceConfig.label} cannot connect to ${targetConfig.label}`
				);
				return;
			}

			// Check if the target node can receive connections from the source node type
			if (!targetConfig.allowedIncoming.includes(sourceType)) {
				notifyError(
					`${targetConfig.label} cannot receive connections from ${sourceConfig.label}`
				);
				return;
			}

			setEdges((edgesSnapshot) =>
				addEdge({ ...params, type: 'animated' }, edgesSnapshot)
			);
		},
		[nodes]
	);

	const onPaneClick = useCallback(
		(event: React.MouseEvent) => {
			if (mode !== 'add') return;

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			const randomType: NodeType =
				nodeConfigs[
					Object.keys(nodeConfigs)[
						Math.floor(Math.random() * Object.keys(nodeConfigs).length)
					] as NodeType
				].type;
			const newNode: Node = {
				id: opaqueId('node'),
				type: randomType,
				position,
				data: {
					label: randomType.charAt(0).toUpperCase() + randomType.slice(1),
				},
			};

			setNodes((nds) => [...nds, newNode]);
			setNodeCount((c) => c + 1);
		},
		[mode, screenToFlowPosition, nodeCount]
	);

	return (
		<div className='flex h-screen w-screen flex-col'>
			<div className='relative flex-1'>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onPaneClick={onPaneClick}
					defaultEdgeOptions={{
						type: 'animated',
					}}
					nodesDraggable={mode === 'dnd'}
					fitView
				/>
			</div>
			<div className='flex h-16 items-center justify-center gap-4 border-t border-border bg-background'>
				<Button
					onClick={() => setMode('dnd')}
					variant={mode === 'dnd' ? 'default' : 'secondary'}
					size='lg'>
					<Hand className='size-4' />
					Drag & Drop
				</Button>
				<Button
					onClick={() => setMode('add')}
					variant={mode === 'add' ? 'default' : 'secondary'}
					size='lg'>
					<Plus className='size-4' />
					Add Node
				</Button>
			</div>
		</div>
	);
}

function App() {
	return (
		<ReactFlowProvider>
			<Flow />
			<Toaster />
			{/* <Scene3D /> */}
		</ReactFlowProvider>
	);
}

export default App;
