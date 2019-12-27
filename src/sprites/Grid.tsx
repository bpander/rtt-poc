import React, { useContext } from 'react';
import { times } from 'util/arrays';
import { EngineContext } from '../engine/components/Engine';
import { EntityComponentProps } from 'engine/models/Entity';

export const Grid: React.FC<EntityComponentProps> = () => {
  const ctx = useContext(EngineContext);
  const { scale } = ctx.camera;
  const width = ctx.width / scale;
  const height = ctx.height / scale;
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
