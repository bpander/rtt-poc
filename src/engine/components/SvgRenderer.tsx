import React, { useContext } from 'react';
import { EngineContext } from './Engine';
import { FacetType, isFacetType } from 'engine/models/Entity';

export const SvgRenderer: React.FC = () => {
  const { entities, width, height, camera } = useContext(EngineContext);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid black' }}
    >
      {entities.map(entity => {
        const svgSprite = entity.facets.find(isFacetType(FacetType.SvgSprite));
        if (!svgSprite) {
          return null;
        }
        return (
          <g
            key={entity.id}
            transform={[
              `translate(${entity.position.map(n => n * camera.scale).join(' ')})`,
              `scale(${camera.scale})`
            ].join(' ')}
          >
            <svgSprite.Component facet={svgSprite} entity={entity} />
          </g>
        );
      })}
    </svg>
  );
};
