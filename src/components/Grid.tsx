import React from 'react';
import { times } from 'util/arrays';

interface GridProps {
  width: number;
  height: number;
  scale: number;
}

export const Grid: React.FC<GridProps> = props => {
  const { width, height, scale } = props;
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
