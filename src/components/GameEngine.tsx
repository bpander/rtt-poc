import React from 'react';

import Sprite from 'components/Sprite';
import CanvasContext from 'contexts/CanvasContext';
import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';
import { Input } from 'util/Input';

const subtract = (v1: Vector2, v2: Vector2): Vector2 => {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
  ];
};

interface GameEngineProps {
  time: number;
  delta: number;
  input: Input;
}

interface GameEngineState {
  camera: Vector2;
  entities: Game.Entity[];
}

export default class GameEngine extends React.Component<GameEngineProps, GameEngineState> {

  static getDerivedStateFromProps(props: GameEngineProps, state: GameEngineState): Partial<GameEngineState> {
    const camera = [ ...state.camera ] as Vector2;

    if (props.input.keysPressed.w) {
      camera[1] -= 5;
    }
    if (props.input.keysPressed.a) {
      camera[0] -= 5;
    }
    if (props.input.keysPressed.s) {
      camera[1] += 5;
    }
    if (props.input.keysPressed.d) {
      camera[0] += 5;
    }

    return { camera };
  }

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
      <CanvasContext.Consumer>
        {ctx => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          return this.state.entities.map(entity =>
            entity.facets.map((facet, i) => (
              (facet.type === Game.FacetType.Sprite) && (
                <Sprite
                  key={i}
                  position={subtract(entity.position, this.state.camera)}
                  facet={facet}
                />
              )
            ))
          );
        }}
      </CanvasContext.Consumer>
    );
  }
}
