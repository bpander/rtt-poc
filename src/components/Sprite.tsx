import React from 'react';

import CanvasContext from 'contexts/CanvasContext';
import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';

interface SpriteProps {
  position: Vector2;
  facet: Game.SpriteFacet;
  size: number;
}

export default class Sprite extends React.Component<SpriteProps> {
  render() {
    const { facet, position, size } = this.props;
    return (
      <CanvasContext.Consumer>
        {ctx => {
          ctx.fillRect(
            position[0] * size,
            position[1] * size,
            facet.size[0] * size,
            facet.size[1] * size,
          );
          return null;
        }}
      </CanvasContext.Consumer>
    );
  }
}
