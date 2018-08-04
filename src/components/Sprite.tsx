import React from 'react';

import CanvasContext from 'contexts/CanvasContext';
import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';

interface SpriteProps {
  position: Vector2;
  facet: Game.SpriteFacet;
}

export default class Sprite extends React.Component<SpriteProps> {
  render() {
    const { facet, position } = this.props;
    return (
      <CanvasContext.Consumer>
        {ctx => {
          ctx.fillRect(position[0], position[1], facet.size[0], facet.size[1]);
          return null;
        }}
      </CanvasContext.Consumer>
    );
  }
}
