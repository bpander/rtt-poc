import React from 'react';
import { useRootState } from 'root';
import { EntityComponentProps } from 'modules/engine/components/EntityComponentProps';
import { SvgEntity } from 'modules/engine/components/SvgEntity';

const originalSize = 512;

export const Token: React.FC<EntityComponentProps> = ({ entity, children }) => {
  const { xhess } = useRootState();
  const team = xhess.teams.find(team => team.entities.includes(entity.id));
  const color = team ? team.color : 'grey';
  const transform = `translate(-0.5 -0.5) scale(${1 / originalSize})`;

  return (
    <SvgEntity entity={entity}>
      <g fill={color} transform={transform}>
        {children}
      </g>
    </SvgEntity>
  );
};
