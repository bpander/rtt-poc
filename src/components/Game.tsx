import React from 'react';

import CanvasContext from 'contexts/CanvasContext';

interface GameProps {
  time: number;
  delta: number;
}

export default class Game extends React.Component<GameProps> {
  render() {
    return (
      <CanvasContext.Consumer>
        {ctx => {
          console.log(this.props.time);
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();
          ctx.rect(this.props.time / 50, 10, 100, 200);
          ctx.stroke();
          return null;
        }}
      </CanvasContext.Consumer>
    );
  }
}
