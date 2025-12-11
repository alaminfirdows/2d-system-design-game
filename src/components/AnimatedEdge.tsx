import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
            {/* <circle r='5' fill='#6366f1'> */}
            {/* <animateMotion dur='2s' repeatCount='indefinite' path={edgePath} /> */}
            {/* </circle> */}
        </>
    );
}
