import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export function AnimatedEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    requests = [],
}: EdgeProps & { requests?: { id: string; progress: number }[] }) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // Helper to interpolate position along the edge path
    function getPointAtProgress(progress: number) {
        const x = sourceX + (targetX - sourceX) * progress;
        const y = sourceY + (targetY - sourceY) * progress;
        return { x, y };
    }

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
            {requests.map((req) => {
                const { x, y } = getPointAtProgress(req.progress);
                return <circle key={req.id} cx={x} cy={y} r={7} fill="#6366f1" opacity={0.7} />;
            })}
        </>
    );
}
