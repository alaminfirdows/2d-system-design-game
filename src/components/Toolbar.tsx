import { Button } from '@/components/ui/button';
import { Hand, Trash2, Unlink } from 'lucide-react';
import { memo, useMemo } from 'react';
import { getAvailableNodes, type NodeType } from './nodes/node-config';

type Mode = 'select' | 'remove-node' | 'remove-edge' | NodeType;

interface ToolbarProps {
    mode: Mode;
    onModeChange: (mode: Mode) => void;
}

export const Toolbar = memo(function Toolbar({ mode, onModeChange }: ToolbarProps) {
    const availableNodes = useMemo(() => getAvailableNodes(), []);

    return (
        <div className="flex h-16 items-center justify-center gap-2 overflow-x-auto border-t border-border bg-background px-4">
            <Button onClick={() => onModeChange('select')} variant={mode === 'select' ? 'default' : 'secondary'} size="sm">
                <Hand className="size-4" />
                Select
            </Button>
            <Button onClick={() => onModeChange('remove-node')} variant={mode === 'remove-node' ? 'default' : 'secondary'} size="sm">
                <Trash2 className="size-4" />
                Remove Node
            </Button>
            <Button onClick={() => onModeChange('remove-edge')} variant={mode === 'remove-edge' ? 'default' : 'secondary'} size="sm">
                <Unlink className="size-4" />
                Remove Edge
            </Button>
            <div className="mx-2 h-8 w-px bg-border" />
            {availableNodes.map((config) => (
                <Button
                    key={config.type}
                    onClick={() => onModeChange(config.type)}
                    variant={mode === config.type ? 'default' : 'secondary'}
                    size="sm"
                    className="gap-1"
                >
                    <img src={config.icon} alt={config.label} className="size-4" />
                    {config.shortLabel || config.label}
                </Button>
            ))}
        </div>
    );
});
