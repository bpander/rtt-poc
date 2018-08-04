import { sortBy } from 'lodash';
import React from 'react';

import Grid from 'components/Grid';
import Sprite from 'components/Sprite';
import CanvasContext from 'contexts/CanvasContext';
import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';
import * as PlayerManager from 'managers/PlayerManager';
import { Input } from 'util/Input';

const subtract = (v1: Vector2, v2: Vector2): Vector2 => {
  return [
    v1[0] - v2[0],
    v1[1] - v2[1],
  ];
};

const add = (v1: Vector2, v2: Vector2): Vector2 => {
  return [
    v1[0] + v2[0],
    v1[1] + v2[1],
  ];
};

const scale = (v1: Vector2, n: number): Vector2 => {
  return [
    v1[0] * n,
    v1[1] * n,
  ];
};


interface GameEngineProps {
  time: number;
  delta: number;
  input: Input;
  width: number;
  height: number;
}

interface GameEngineState {
  camera: Vector2;
  player: Game.Entity;
  entities: Game.Entity[];
}

export default class GameEngine extends React.Component<GameEngineProps, GameEngineState> {

  static getDerivedStateFromProps(props: GameEngineProps, state: GameEngineState): Partial<GameEngineState> {
    const player = PlayerManager.processInput(state.player, state.entities, props.input);
    return { player };
  }

  constructor(props: GameEngineProps) {
    super(props);

    this.state = {
      camera: [ 0, 0 ],
      player: {
        position: [ 0, 0 ],
        facets: [
          { type: Game.FacetType.Sprite, size: [ 1, 1 ] },
          { type: Game.FacetType.Collider, size: [ 1, 1 ] },
        ],
      },
      entities: [
        {
          position: [ 2, 4 ],
          facets: [
            { type: Game.FacetType.Sprite, size: [ 2, 4 ] },
            { type: Game.FacetType.Collider, size: [ 2, 4 ] },
          ],
        },
        {
          position: [ 6, 7 ],
          facets: [
            { type: Game.FacetType.Sprite, size: [ 4, 2 ] },
            { type: Game.FacetType.Collider, size: [ 4, 2 ] },
          ],
        }
      ],
    };
  }

  render() {
    return (
      <CanvasContext.Consumer>
        {ctx => {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

          const entitiesSorted = sortBy(
            [ ...this.state.entities, this.state.player ],
            entity => entity.position[1],
          );

          const center: Vector2 = [
            this.props.width / 2 / Game.CELL_SIZE,
            this.props.height / 2 / Game.CELL_SIZE,
          ];
          const playerSprite = this.state.player.facets.find(f => f.type === Game.FacetType.Sprite);
          const playerSize: Vector2 = (playerSprite) ? playerSprite.size : [ 0, 0 ];
          const camera: Vector2 = subtract(
            add(this.state.player.position, scale(playerSize, 0.5)),
            center,
          );

          return (
            <React.Fragment>
              <Grid
                spacing={Game.CELL_SIZE}
                position={subtract([ 0, 0 ], camera)}
                color={'#cccccc'}
              />
              {entitiesSorted.map(entity => (
                entity.facets.map((facet, i) => (
                  (facet.type === Game.FacetType.Sprite) && (
                    <Sprite
                      key={i}
                      position={subtract(entity.position, camera)}
                      facet={facet}
                      size={Game.CELL_SIZE}
                    />
                  )
                ))
              ))}
            </React.Fragment>
          );
        }}
      </CanvasContext.Consumer>
    );
  }
}
