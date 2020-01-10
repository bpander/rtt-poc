import React from 'react';

import { useRootState } from 'root';
import { scaleVector2 } from 'modules/geo2d/core';
import { useDispatch } from 'react-redux';
import { updateEngine, getNavMeshGraph } from 'modules/engine/duck';
import { FacetType } from 'modules/engine/models/Entity';
import { removeFirst } from 'util/arrays';
import { getPath } from 'modules/geo2d/navMesh2d';
import { isFacetType } from 'xhess/models/XhessFacet';

export const NavigableArea: React.FC = () => {
  const dispatch = useDispatch();
  const { engine, xhess } = useRootState();
  const { width, height, camera } = engine;
  const onAreaClick = (e: React.MouseEvent<SVGRectElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    const destination = scaleVector2([ e.clientX - left, e.clientY - top ], 1 / camera.scale);
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