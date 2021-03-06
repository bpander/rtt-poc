import React from 'react';

import { SvgEntity } from 'modules/engine/components/SvgEntity';
import { EntityComponentProps } from 'modules/engine/components/EntityComponentProps';

export const Box: React.FC<EntityComponentProps> = ({ entity }) => {
  return (
    <SvgEntity entity={entity}>
      <rect
        width={7}
        height={1}
        stroke="black"
        strokeWidth={0.1}
        fill="rgba(0, 0, 0, 0.2)"
      />
    </SvgEntity>
  );
};
