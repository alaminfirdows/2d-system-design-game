import { Button } from '@/components/ui/button';
import { memo } from 'react';

interface GameControllerProps {
    gameStatus: 'stopped' | 'running' | 'paused';
    gameSpeed: 1 | 2 | 3;
    onStart: () => void;
    onPause: () => void;
    onSpeed2x: () => void;
    onSpeed3x: () => void;
    onStop: () => void;
}

export const GameController = memo(function GameController({
    gameStatus,
    gameSpeed,
    onStart,
    onPause,
    onSpeed2x,
    onSpeed3x,
    onStop,
}: GameControllerProps) {
    return (
        <div className="flex h-14 items-center justify-center gap-2 border-b border-border bg-background px-4">
            <Button onClick={onStart} variant={gameStatus === 'running' ? 'default' : 'secondary'} size="sm">
                Start
            </Button>
            <Button onClick={onPause} variant={gameStatus === 'paused' ? 'default' : 'secondary'} size="sm">
                Pause
            </Button>
            <Button onClick={onSpeed2x} variant={gameSpeed === 2 ? 'default' : 'secondary'} size="sm">
                2x
            </Button>
            <Button onClick={onSpeed3x} variant={gameSpeed === 3 ? 'default' : 'secondary'} size="sm">
                3x
            </Button>
            <Button onClick={onStop} variant={gameStatus === 'stopped' ? 'default' : 'secondary'} size="sm">
                Stop
            </Button>
            <span className="ml-4 text-xs text-muted-foreground">
                Status: {gameStatus} | Speed: {gameSpeed}x
            </span>
        </div>
    );
});
