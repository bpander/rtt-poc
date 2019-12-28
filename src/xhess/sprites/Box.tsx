import React from 'react';

import { EntityComponentProps } from 'engine/models/Entity';
import { useRootState } from 'root';

export const Box: React.FC<EntityComponentProps> = ({ facet }) => {
  const { engine } = useRootState();

  return (
    <rect
      width={facet.size[0]}
      height={facet.size[1]}
      stroke="black"
      strokeWidth={3 / engine.camera.scale}
      fill="rgba(0, 0, 0, 0.2)"
    />
  );
};
