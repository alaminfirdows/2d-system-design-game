import { Handle, Position, type NodeProps } from '@xyflow/react';

export function CircleNode({ data }: NodeProps) {
	return (
		<div className='flex size-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-medium shadow-md'>
			<Handle type='target' position={Position.Top} className='!bg-primary' />
			<span className='text-center'>{data.label as string}</span>
			<Handle
				type='source'
				position={Position.Bottom}
				className='!bg-primary'
			/>
		</div>
	);
}
