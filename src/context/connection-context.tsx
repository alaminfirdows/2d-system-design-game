import { createContext, useContext, useState, type ReactNode } from 'react';
import type { NodeType } from '@/components/nodes/node-config';

interface ConnectionState {
	isConnecting: boolean;
	sourceNodeType: NodeType | null;
	handleType: 'source' | 'target' | null;
}

interface ConnectionContextValue {
	connectionState: ConnectionState;
	startConnection: (
		nodeType: NodeType,
		handleType: 'source' | 'target'
	) => void;
	endConnection: () => void;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
	const [connectionState, setConnectionState] = useState<ConnectionState>({
		isConnecting: false,
		sourceNodeType: null,
		handleType: null,
	});

	const startConnection = (
		nodeType: NodeType,
		handleType: 'source' | 'target'
	) => {
		setConnectionState({
			isConnecting: true,
			sourceNodeType: nodeType,
			handleType,
		});
	};

	const endConnection = () => {
		setConnectionState({
			isConnecting: false,
			sourceNodeType: null,
			handleType: null,
		});
	};

	return (
		<ConnectionContext.Provider
			value={{ connectionState, startConnection, endConnection }}>
			{children}
		</ConnectionContext.Provider>
	);
}

export function useConnection() {
	const context = useContext(ConnectionContext);
	if (!context) {
		throw new Error('useConnection must be used within a ConnectionProvider');
	}
	return context;
}
