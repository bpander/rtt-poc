import React from 'react';

import { EntityComponentProps } from './EntityComponentProps';

type SvgEntityProps = EntityComponentProps & React.SVGAttributes<SVGElement>;

export const SvgEntity: React.FC<SvgEntityProps> = ({ entity, children, ...rest }) => {
  const transform = `translate(${entity.position.join(' ')}) rotate(${entity.rotation * 180 / Math.PI} 0 0)`;
  return <g transform={transform} {...rest}>{children}</g>;
};
