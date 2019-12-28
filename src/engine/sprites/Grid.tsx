import React from 'react';

import { EntityComponentProps, isFacetType, FacetType } from 'engine/models/Entity';
import { times } from 'util/arrays';
import { useRootState } from 'root';
import { getNavMeshGraph } from 'engine/duck';
import { getLinks, toLines } from 'geo2d/navMesh2d';

export const Grid: React.FC<EntityComponentProps> = () => {
  const { engine } = useRootState();
  const { scale } = engine.camera;
  const width = engine.width / scale;
  const height = engine.height / scale;
  const numLatitudes = Math.floor(height);
  const numLongitudes = Math.floor(width);
  const navMeshGraph = getNavMeshGraph(engine);
  const links = getLinks(navMeshGraph);
  const paths = engine.entities.map(e => [
    e.position,
    ...e.facets.filter(isFacetType(FacetType.NavMeshAgent)).map(f => f.path).flat(),
  ]);
  const pathLines = paths.map(p => toLines(p).slice(0, -1)).flat();

  return (
    <g strokeWidth={1 / scale}>
      <g stroke="#dddddd">
        {times(numLatitudes, i => (
          <line key={i} x1={0} y1={i} x2={width} y2={i} />
        ))}
        {times(numLongitudes, i => (
          <line key={i} x1={i} y1={0} x2={i} y2={height} />
        ))}
      </g>
      <g stroke="red">
        {links.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
          <line key={i} {...{x1, y1, x2, y2}} />
        ))}
      </g>
      <g stroke="lightgreen" strokeWidth={2 / scale}>
        {pathLines.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
          <line key={i} {...{x1, y1, x2, y2}} />
        ))}
      </g>
    </g>
  );
};
