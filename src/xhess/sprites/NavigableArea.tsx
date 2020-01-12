import React from 'react';
import { useDispatch } from 'react-redux';

import { useRootState } from 'root';
import { scaleVector2 } from 'modules/geo2d/core';
import { isFacetType, XhessFacetType } from 'xhess/models/XhessEntity';
import { navigateEntity } from 'xhess/duck';

export const NavigableArea: React.FC = () => {
  const dispatch = useDispatch();
  const { engine } = useRootState();
  const { width, height, camera } = engine;
  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const targetRaw = scaleVector2([ e.clientX - left, e.clientY - top ], 1 / camera.scale);
    const target = targetRaw.map(n => Math.floor(n) + 0.5) as typeof targetRaw;
    const entityToMove = engine.entities.find(entity => {
      const actor = entity.facets.find(isFacetType(XhessFacetType.Actor));
      return actor && actor.selected;
    });
    if (entityToMove) {
      dispatch(navigateEntity({ entityToMove, target }));
    }
  };

  return (
    <rect
      width={width / camera.scale}
      height={height / camera.scale}
      fill="rgba(0, 0, 0, 0)"
      onClick={onAreaClick}
    />
  );
};