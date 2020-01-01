import React, { useMemo } from 'react';

import { isFacetType, FacetType } from 'engine/models/Entity';
import { times } from 'util/arrays';
import { useRootState } from 'root';
import { toLines, findNavMeshLinks } from 'geo2d/navMesh2d';
import { DebugProps } from './RendererProps';

const DebugGrid: React.FC = () => {
  const { engine } = useRootState();
  const { scale } = engine.camera;
  const width = engine.width / scale;
  const height = engine.height / scale;
  const numLatitudes = Math.floor(height);
  const numLongitudes = Math.floor(width);

  return (
    <g stroke="#dddddd">
      {times(numLatitudes, i => (
        <line key={i} x1={0} y1={i} x2={width} y2={i} />
      ))}
      {times(numLongitudes, i => (
        <line key={i} x1={i} y1={0} x2={i} y2={height} />
      ))}
    </g>
  );
};

const DebugNavMesh: React.FC = () => {
  const { engine } = useRootState();
  const links = useMemo(() => findNavMeshLinks(engine.navMesh), [ engine.navMesh ]);

  return (
    <g stroke="rgba(255, 0, 0, 0.3)">
      {links.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
        <React.Fragment key={i}>
          <circle cx={x1} cy={y1} r={2 / engine.camera.scale} fill="red" />
          <line {...{x1, y1, x2, y2}} />
          <circle cx={x2} cy={y2} r={2 / engine.camera.scale} fill="red" />
        </React.Fragment>
      ))}
    </g>
  );
};

const DebugPaths: React.FC = () => {
  const { engine } = useRootState();
  const { scale } = engine.camera;
  const paths = engine.entities.map(e => [
    e.position,
    ...e.facets.filter(isFacetType(FacetType.NavMeshAgent)).map(f => f.path).flat(),
  ]);
  const pathLines = paths.map(p => toLines(p).slice(0, -1)).flat();

  return (
    <g stroke="lightgreen" strokeWidth={2 / scale}>
      {pathLines.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
        <line key={i} {...{x1, y1, x2, y2}} />
      ))}
    </g>
  )
};

export const SvgDebug: React.FC<DebugProps> = props => {
  const { engine } = useRootState();
  const { scale } = engine.camera;

  return (
    <g strokeWidth={1 / scale}>
      {(props.showGrid) && <DebugGrid />}
      {(props.showNavMesh) && <DebugNavMesh />}
      {(props.showPaths) && <DebugPaths />}
    </g>
  );
};
