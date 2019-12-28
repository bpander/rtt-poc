import React from 'react';

import { EntityComponentProps } from 'engine/models/Entity';
import { times } from 'util/arrays';
import { useRootState } from 'root';

export const Grid: React.FC<EntityComponentProps> = () => {
  const engine = useRootState('engine');
  const { scale } = engine.camera;
  const width = engine.width / scale;
  const height = engine.height / scale;
  const numLatitudes = Math.floor(height);
  const numLongitudes = Math.floor(width);

  return (
    <g stroke="#dddddd" strokeWidth={1 / scale}>
      {times(numLatitudes, i => (
        <line key={i} x1={0} y1={i} x2={width} y2={i} />
      ))}
      {times(numLongitudes, i => (
        <line key={i} x1={i} y1={0} x2={i} y2={height} />
      ))}
    </g>
  );
};
