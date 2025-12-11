import { Handle, Position, type NodeProps } from '@xyflow/react';

export function HexagonNode({ data }: NodeProps) {
	return (
		<div className='relative flex h-16 w-20 items-center justify-center'>
			<svg
				viewBox='0 0 100 87'
				className='absolute inset-0 h-full w-full'
				preserveAspectRatio='none'>
				<polygon
					points='25,0 75,0 100,43.5 75,87 25,87 0,43.5'
					className='fill-background stroke-primary stroke-2'
				/>
			</svg>
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
