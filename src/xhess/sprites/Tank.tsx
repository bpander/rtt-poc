import React from 'react';
import { EntityComponentProps } from 'engine/models/Entity';

export const Tank: React.FC<EntityComponentProps> = ({ facet }) => {
  return (
    <ellipse
      cx={0}
      cy={0}
      rx={facet.size[0] / 2}
      ry={facet.size[1] / 2}
      fill="blue"
      onClick={console.log}
    />
  );
};
