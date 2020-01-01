import React, { useMemo } from 'react';
import { EntityComponentProps } from 'modules/engine/models/Entity';
import { scaleVector2 } from 'modules/geo2d/core';
import { useDispatch } from 'react-redux';
import { useRootState } from 'root';
import { updateXhess } from 'xhess/duck';

const originalSize = 512;

export const Token: React.FC<EntityComponentProps> = ({ facet, entity, children }) => {
  const dispatch = useDispatch();
  const { xhess } = useRootState();
  // const isSelected = xhess.selected.includes(entity.id);
  const team = xhess.teams.find(team => team.entities.includes(entity.id));
  const color = team ? team.color : 'grey';
  // const strokeWidth = (isSelected) ? 2 : 1;
  const onClick = () => {
    if (!team || team.name !== xhess.playerTeam) {
      return;
    }
    dispatch(updateXhess({
      // selected: isSelected ? [] : [ entity.id ],
    }));
  };
  const transform = useMemo(() => {
    return [
      `translate(${scaleVector2(facet.size, -0.5).join(' ')})`,
      `scale(${scaleVector2(facet.size, 1 / originalSize).join(' ')})`
    ].join(' ');
  }, [ facet.size ]);

  return (
    <g
      transform={transform}
      fill={color}
      // stroke={color}
      // strokeWidth={strokeWidth * engine.camera.scale}
      onClick={onClick}
    >
      {children}
    </g>
  );
};
