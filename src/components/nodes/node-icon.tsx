import { cn } from '@/lib/utils';

type NodeProps = {
    icon: string;
    label: string;
    iconClassNames?: string;
};

export const NodeIcon = ({ icon, label, iconClassNames }: NodeProps) => {
    return (
        <div className="relative rounded-md border border-foreground/50 bg-background/60 p-1.5 text-center">
            <img src={icon} alt={label} className="rounded-sm" />

            <p className="absolute right-1.5 bottom-1.5 left-1.5 z-20 px-1">
                <span className={cn('rounded-sm bg-primary px-2 text-xs font-medium text-foreground', iconClassNames)}>{label}</span>
            </p>
        </div>
    );
};
