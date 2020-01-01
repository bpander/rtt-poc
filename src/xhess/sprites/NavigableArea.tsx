import React from 'react';

import { useRootState } from 'root';
import { scaleVector2, Vector2 } from 'modules/geo2d/core';
import { useDispatch } from 'react-redux';
import { updateEngine, getNavMeshGraph } from 'modules/engine/duck';
import { isFacetType, FacetType } from 'modules/engine/models/Entity';
import { removeFirst } from 'util/arrays';
import { getPath } from 'modules/geo2d/navMesh2d';

export const NavigableArea: React.FC = () => {
  const dispatch = useDispatch();
  const { engine, xhess } = useRootState();
  const { width, height, camera } = engine;
  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const destinationRaw = scaleVector2([ e.clientX - left, e.clientY - top ], 1 / camera.scale);
    const destination = destinationRaw.map(n => Math.floor(n) + 0.5) as Vector2;
    const navMeshGraph = getNavMeshGraph(engine);
    const entities = engine.entities.map(entity => {
      if (!xhess.selected.includes(entity.id)) {
        return entity;
      }
      const facet = entity.facets.find(isFacetType(FacetType.NavMeshAgent));
      if (!facet) {
        return entity;
      }
      const path = getPath(navMeshGraph, engine.navMesh.flat(), entity.position, destination);
      return {
        ...entity,
        facets: removeFirst(entity.facets, facet, { ...facet, path }),
      };
    });
    dispatch(updateEngine({ entities }));
  };

  return (
      <rect
        width={width}
        height={height}
        fill="rgba(0, 0, 0, 0)"
        onClick={onAreaClick}
      />
  );
};