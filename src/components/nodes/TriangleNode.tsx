import { Handle, Position, type NodeProps } from '@xyflow/react';

export function TriangleNode({ data }: NodeProps) {
	return (
		<div className='relative flex h-16 w-20 items-center justify-center'>
			<svg
				viewBox='0 0 100 87'
				className='absolute inset-0 h-full w-full'
				preserveAspectRatio='none'>
				<polygon
					points='50,0 100,87 0,87'
					className='fill-background stroke-primary stroke-2'
				/>
			</svg>

			<Handle type='target' position={Position.Top} />

			<span className='relative z-10 mt-2 text-xs font-medium'>
				{data.label as string}
			</span>

			<Handle type='source' position={Position.Bottom} />
		</div>
	);
}
