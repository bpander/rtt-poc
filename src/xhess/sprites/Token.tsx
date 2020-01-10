import React from 'react';
import { useRootState } from 'root';
import { EntityComponentProps } from 'modules/engine/components/EntityComponentProps';
import { SvgEntity } from 'modules/engine/components/SvgEntity';
import { isFacetType, XhessFacetType } from 'xhess/models/XhessEntity';

const originalSize = 512;

export const Token: React.FC<EntityComponentProps> = ({ entity, children }) => {
  const { xhess } = useRootState();
  const actor = entity.facets.find(isFacetType(XhessFacetType.Actor));
  const team = actor && xhess.teams.find(team => team.name === actor.teamName);
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
