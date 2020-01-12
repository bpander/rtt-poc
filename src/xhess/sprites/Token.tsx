import React, { useMemo } from 'react';
import { useRootState } from 'root';
import { EntityComponentProps } from 'modules/engine/components/EntityComponentProps';
import { SvgEntity } from 'modules/engine/components/SvgEntity';
import { isFacetType, XhessFacetType } from 'xhess/models/XhessEntity';

const originalSize = 512;

type RGBA = [ number, number, number, number ];
interface ColorStop {
  color: RGBA;
  position: number;
}

const healthGradient: ColorStop[] = [
  { color: [ 255, 0,   0, 1 ], position: 0 },
  { color: [ 255, 230, 100, 1 ], position: 0.5 },
  { color: [ 0,   255, 0, 1 ], position: 1 },
];

const NULL_COLOR: RGBA = [ 0, 0, 0, 0 ];

const getColor = (gradient: ColorStop[], position: number): RGBA => {
  const [ firstStop ] = gradient;
  if (!firstStop) {
    return NULL_COLOR;
  }
  let stop = firstStop;
  let nextStop = firstStop;
  for (let i = 0; i < gradient.length; i++) {
    nextStop = gradient[i];
    if (nextStop.position >= position) {
      break;
    }
    stop = nextStop;
  }
  const delta = nextStop.position - stop.position;
  const pctToNextStop = delta && (position - stop.position) / delta;
  const color = stop.color.map((c, i) => (
    c + (nextStop.color[i] - c) * pctToNextStop
  ));
  return color as RGBA;
};

export const Token: React.FC<EntityComponentProps> = ({ entity, children }) => {
  const { xhess, engine } = useRootState();
  const actor = entity.facets.find(isFacetType(XhessFacetType.Actor));
  const healthPct = actor ? actor.hp / actor.maxHp : 1;
  const fill = useMemo(() => {
    return `rgba(${getColor(healthGradient, healthPct).join()})`;
  }, [ healthPct ]);

  if (!actor) {
    return null;
  }
  const team = xhess.teams.find(team => team.name === actor.teamName);
  const color = team ? team.color : 'grey';
  const transform = `translate(-0.5 -0.5) scale(${1 / originalSize})`;

  return (
    <React.Fragment>
      <g transform={`translate(${entity.position.map(n => n - 0.5).join()})`}>
        <rect y={-0.2} height={0.2} width={healthPct} fill={fill} />
        <rect y={-0.2} height={0.2} width={1} stroke="black" fill="none" strokeWidth={1 / engine.camera.scale} />
      </g>
      <SvgEntity entity={entity}>
        <g fill={color} transform={transform}>
          {children}
        </g>
      </SvgEntity>
    </React.Fragment>
  );
};
