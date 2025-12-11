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
                selected ? 'border-2 border-primary' : 'border-foreground/50',
            )}
        >
            <img src={icon} alt={label} className="rounded-sm" />

            <p className="absolute right-1.5 bottom-1.5 left-1.5 z-20 px-1">
                <span className={cn('rounded-sm bg-primary px-2 text-xs font-medium text-foreground', iconClassNames)}>{label}</span>
            </p>
        </div>
    );
};
