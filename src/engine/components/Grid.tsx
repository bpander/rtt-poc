import React, { useContext } from 'react';
import { times } from 'util/arrays';
import { EngineContext } from './Engine';

interface GridProps {
  width: number;
  height: number;
}

export const Grid: React.FC<GridProps> = props => {
  const ctx = useContext(EngineContext);
  const { scale } = ctx.camera;
  const { width, height } = props;
  const numLatitudes = Math.floor(height / scale);
  const numLongitudes = Math.floor(width / scale);

  return (
    <g stroke="#dddddd">
      {times(numLatitudes, i => (
        <line key={i} x1={0} y1={i * scale} x2={width} y2={i * scale} />
      ))}
      {times(numLongitudes, i => (
        <line key={i} x1={i * scale} y1={0} x2={i * scale} y2={height} />
      ))}
    </g>
  );
};
