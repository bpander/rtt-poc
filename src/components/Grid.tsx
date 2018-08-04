import React from 'react';

import CanvasContext from 'contexts/CanvasContext';
import Vector2 from 'definitions/Vector2';
import { times } from 'lodash';

interface GridProps {
  position: Vector2;
  spacing: number;
  color: string;
}

const Grid: React.SFC<GridProps> = props => (
  <CanvasContext.Consumer>
    {ctx => {
      const numLongitudes = Math.ceil(ctx.canvas.width / props.spacing);
      const numLatitudes = Math.ceil(ctx.canvas.height / props.spacing);
      let x = props.position[0] * props.spacing % props.spacing;
      let y = props.position[1] * props.spacing % props.spacing;
      if (y < 0) {
        y += props.spacing;
      }
      if (x < 0) {
        x += props.spacing;
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = props.color;
      times(numLongitudes, () => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ctx.canvas.height);
        ctx.stroke();
        x += props.spacing;
      });
      times(numLatitudes, () => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(ctx.canvas.width, y);
        ctx.stroke();
        y += props.spacing;
      });
      return null;
    }}
  </CanvasContext.Consumer>
);

export default Grid;
