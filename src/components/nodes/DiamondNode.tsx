import { Handle, Position, type NodeProps } from '@xyflow/react';

export function DiamondNode({ data }: NodeProps) {
	return (
		<div className='relative flex size-16 items-center justify-center'>
			<div className='absolute inset-0 rotate-45 border-2 border-primary bg-background shadow-md' />
			<Handle type='target' position={Position.Top} className='!bg-primary' />
			<span className='relative z-10 text-xs font-medium'>
				{data.label as string}
			</span>
			<Handle
				type='source'
				position={Position.Bottom}
				className='!bg-primary'
			/>
		</div>
	);
}
