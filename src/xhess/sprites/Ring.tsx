import React from 'react';

import { SvgEntity } from 'modules/engine/components/SvgEntity';
import { EntityComponentProps } from 'modules/engine/components/EntityComponentProps';

export const Ring: React.FC<EntityComponentProps> = ({ entity }) => {
  return (
    <SvgEntity entity={entity}>
      <circle r={2} />
    </SvgEntity>
  );
};
