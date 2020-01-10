import React from 'react';

import { RendererProps } from './RendererProps';
import { SvgDebug } from './SvgDebug';

export const SvgRenderer: React.FC<RendererProps> = props => {
  const { width, height, camera } = props.engine;
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
        {props.debug && <SvgDebug {...props.debug} />}
        {props.children}
      </g>
    </svg>
  );
};
