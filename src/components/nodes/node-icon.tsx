import { cn } from '@/lib/utils';

type NodeProps = {
    icon: string;
    label: string;
    iconClassNames?: string;
    selected?: boolean;
};

export const NodeIcon = ({ icon, label, iconClassNames, selected }: NodeProps) => {
    return (
        <div
            className={cn(
                'relative rounded-md border bg-background/60 p-1.5 text-center transition-colors',
                selected ? 'border-primary' : 'border-foreground/20',
            )}
        >
            <img src={icon} alt={label} className="h-14 w-14 rounded-sm" />

            <p className="absolute right-0.5 bottom-1 left-0.5 z-20 truncate px-1">
                <span className={cn('truncate rounded-sm bg-primary px-2 text-[9px] font-medium text-foreground', iconClassNames)}>{label}</span>
            </p>
        </div>
    );
};
