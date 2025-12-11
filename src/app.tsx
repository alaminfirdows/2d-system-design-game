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

import { AnimatedEdge } from '@/components/AnimatedEdge';
import { Button } from '@/components/ui/button';
import { opaqueId } from '@/lib/utils';

type Mode = 'dnd' | 'add';

const initialNodes: Node[] = [
	{
		id: opaqueId('node'),
		position: { x: 0, y: 100 },
		data: { label: 'Node 1' },
	},
	{
		id: opaqueId('node'),
		position: { x: 200, y: 200 },
		data: { label: 'Node 2' },
	},
	{
		id: opaqueId('node'),
		position: { x: 250, y: 250 },
		data: { label: 'Node 3' },
	},
];

const initialEdges: Edge[] = [
	{
		id: opaqueId('edge'),
		source: initialNodes[0].id,
		target: initialNodes[1].id,
		type: 'animated',
	},
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

	const onConnect = useCallback((params: any) => {
		console.log('onConnect', params);

		setEdges((edgesSnapshot) =>
			addEdge({ ...params, type: 'animated' }, edgesSnapshot)
		);
	}, []);

	const onPaneClick = useCallback(
		(event: React.MouseEvent) => {
			if (mode !== 'add') return;

			const position = screenToFlowPosition({
				x: event.clientX,
				y: event.clientY,
			});

			const newNode: Node = {
				id: opaqueId('node'),
				position,
				data: { label: `Node ${nodeCount}` },
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
					edgeTypes={edgeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					onPaneClick={onPaneClick}
					defaultEdgeOptions={{
						type: 'straight',
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
			{/* <Scene3D /> */}
		</ReactFlowProvider>
	);
}

export default App;
