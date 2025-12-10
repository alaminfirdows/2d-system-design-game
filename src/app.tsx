import {
	applyNodeChanges,
	applyEdgeChanges,
	addEdge,
	ReactFlow,
	type Node,
	type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { opaqueId } from './lib/utils';

function App() {
	const initialNodes: Node[] = [
		{
			id: opaqueId('node'),
			position: { x: 0, y: 100 },
			data: { label: 'Node 2' },
		},
		{
			id: opaqueId('node'),
			position: { x: 100, y: 100 },
			data: { label: 'Node 2' },
		},
	];

	const initialEdges: Edge[] = [];

	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);

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
		setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
	}, []);

	return (
		<div style={{ width: '100vw', height: '100vh' }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
			/>
		</div>
	);
}

export default App;
