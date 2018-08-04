import React from 'react';

import Sprite from 'components/Sprite';
import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';

const subtract = (v1: Vector2, v2: Vector2): Vector2 => {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
  ];
};

interface GameEngineProps {
  time: number;
  delta: number;
}

interface GameEngineState {
  camera: Vector2;
  entities: Game.Entity[];
}

export default class GameEngine extends React.Component<GameEngineProps, GameEngineState> {

  constructor(props: GameEngineProps) {
    super(props);
    this.state = {
      camera: [ -10, -30 ],
      entities: [
        {
          position: [ -5, -25 ],
          facets: [
            { type: Game.FacetType.Sprite, size: [ 60, 120 ] },
          ],
        },
      ],
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.entities.map(entity =>
          entity.facets.map((facet, i) => (
            (facet.type === Game.FacetType.Sprite) && (
              <Sprite
                key={i}
                position={subtract(entity.position, this.state.camera)}
                facet={facet}
              />
            )
          ))
        )}
      </React.Fragment>
    );
  }
}
