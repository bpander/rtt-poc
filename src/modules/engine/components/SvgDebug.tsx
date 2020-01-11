import React, { useMemo } from 'react';

import { times } from 'util/arrays';
import { findNavMeshLinks } from 'modules/geo2d/navMesh2d';
import { toLines } from 'modules/geo2d/core';

import { isStockFacetType, FacetType } from '../models/Entity';
import { DebugProps } from './RendererProps';
import { EngineState } from '../duck';

const DebugGrid: React.FC<{ engine: EngineState }> = ({ engine }) => {
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

const DebugNavMesh: React.FC<{ engine: EngineState }> = ({ engine }) => {
  const links = useMemo(() => findNavMeshLinks(engine.navMesh), [ engine.navMesh ]);

  return (
    <React.Fragment>
      <g stroke="rgba(255, 0, 0, 0.3)">
        {links.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
          <React.Fragment key={i}>
            <circle cx={x1} cy={y1} r={2 / engine.camera.scale} fill="red" />
            <line {...{x1, y1, x2, y2}} />
            <circle cx={x2} cy={y2} r={2 / engine.camera.scale} fill="red" />
          </React.Fragment>
        ))}
      </g>
      <g fill="rgba(255, 0, 0, 0.05)">
        {engine.navMesh.map((edges, i) => (
          <polygon key={i} points={edges.map(edge => edge.line[0].join()).join(' ')} />
        ))}
      </g>
    </React.Fragment>
  );
};

const DebugPaths: React.FC<{ engine: EngineState }> = ({ engine }) => {
  const { scale } = engine.camera;
  const paths = engine.entities.map(e => [
    e.position,
    ...e.facets.filter(isStockFacetType(FacetType.NavMeshAgent)).map(f => f.path).flat(),
  ]);
  const pathLines = paths.map(p => toLines(p).slice(0, -1)).flat();

  return (
    <g stroke="lightgreen" strokeWidth={2 / scale}>
      {pathLines.map(([ [ x1, y1 ], [ x2, y2 ] ], i) => (
        <line key={i} {...{x1, y1, x2, y2}} />
      ))}
    </g>
  );
};

const DebugFPS: React.FC<{ engine: EngineState }> = ({ engine }) => {
  return (
    <text
      transform={`scale(${1 / engine.camera.scale})`}
      dominantBaseline="hanging"
    >
      {(1000 / engine.elapsed).toFixed(2)} fps
    </text>
  );
};

export const SvgDebug: React.FC<DebugProps & { engine: EngineState }> = props => {
  const { engine } = props;
  const { scale } = engine.camera;

  return (
    <g strokeWidth={1 / scale}>
      {(props.showGrid) && <DebugGrid engine={engine} />}
      {(props.showNavMesh) && <DebugNavMesh engine={engine} />}
      {(props.showPaths) && <DebugPaths engine={engine} />}
      {(props.showFPS) && <DebugFPS engine={engine} />}
    </g>
  );
};
