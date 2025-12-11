import { cn } from '@/lib/utils';

type NodeProps = {
	icon: string;
	label: string;
	iconClassNames?: string;
};

export const NodeIcon = ({ icon, label, iconClassNames }: NodeProps) => {
	return (
		<div className='relative border border-foreground/50 p-1.5 bg-background/60 rounded-md text-center'>
			<img src={icon} alt={label} className='rounded-sm' />

			<p className='absolute bottom-1.5 left-1.5 right-1.5 px-1 z-20'>
				<span
					className={cn(
						'text-foreground bg-primary px-2 text-xs font-medium rounded-sm',
						iconClassNames
					)}>
					{label}
				</span>
			</p>
		</div>
	);
};
