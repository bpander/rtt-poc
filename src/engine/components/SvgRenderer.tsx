import React from 'react';

import { RendererProps } from './RendererProps';
import { isFacetType, FacetType } from 'engine/models/Entity';

export const SvgRenderer: React.FC<RendererProps> = props => {
  const { width, height, camera, entities } = props.engine;
  const cameraTransform = [
    `scale(${camera.scale})`,
    `translate(${camera.position.join(' ')})`,
  ].join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid black' }}
    >
      <g transform={cameraTransform}>
        {entities.map(entity => {
          const svgSprite = entity.facets.find(isFacetType(FacetType.SvgSprite));
          if (!svgSprite) {
            return null;
          }
          return (
            <g key={entity.id} transform={`translate(${entity.position.join(' ')})`}>
              <svgSprite.Component facet={svgSprite} entity={entity} />
            </g>
          );
        })}
      </g>
      {props.children}
    </svg>
  );
};
