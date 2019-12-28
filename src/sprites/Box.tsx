import React, { useContext } from 'react';
import { EntityComponentProps } from 'engine/models/Entity';
import { EngineContext } from 'engine/components/Engine';

export const Box: React.FC<EntityComponentProps> = ({ facet }) => {
  const ctx = useContext(EngineContext);

  return (
    <rect
      width={facet.size[0]}
      height={facet.size[1]}
      stroke="black"
      strokeWidth={3 / ctx.camera.scale}
      fill="rgba(0, 0, 0, 0.2)"
    />
  );
};
