import * as Game from 'definitions/Game';
import Vector2 from 'definitions/Vector2';
import { Input } from 'util/Input';

const add = (v1: Vector2, v2: Vector2): Vector2 => {
  return [
    v1[0] + v2[0],
    v1[1] + v2[1],
  ];
};

export const processInput = (player: Game.Entity, entities: Game.Entity[], input: Input): Game.Entity => {
  const translate: Vector2 = [ 0, 0 ];
  const speed = 0.25;

  if (input.keysPressed.w) {
    translate[1] -= speed;
  }
  if (input.keysPressed.a) {
    translate[0] -= speed;
  }
  if (input.keysPressed.s) {
    translate[1] += speed;
  }
  if (input.keysPressed.d) {
    translate[0] += speed;
  }
  const position = add(player.position, translate);
  const playerCollider = player.facets.find(f => f.type === Game.FacetType.Collider);

  if (playerCollider) {
    const playerBound = add(position, playerCollider.size);
    entities.forEach(entity => {
      entity.facets.forEach(facet => {
        if (facet.type === Game.FacetType.Collider) {
          const entityBound = add(entity.position, facet.size);
          if ((position[1] > entity.position[1] && position[1] < entityBound[1])
            || (playerBound[1] > entity.position[1] && playerBound[1] < entityBound[1])) {
            if (translate[0] > 0) {
              if (position[0] < entity.position[0] && playerBound[0] > entity.position[0]) {
                position[0] = entity.position[0] - playerCollider.size[0];
              }
            } else if (translate[0] < 0) {
              if (playerBound[0] > entityBound[0] && position[0] < entityBound[0]) {
                position[0] = entityBound[0];
              }
            }
          }
          if ((position[0] > entity.position[0] && position[0] < entityBound[0])
            || (playerBound[0] > entity.position[0] && playerBound[0] < entityBound[0])) {
            if (translate[1] > 0) {
              if (position[1] < entity.position[1] && playerBound[1] > entity.position[1]) {
                position[1] = entity.position[1] - playerCollider.size[1];
              }
            } else if (translate[1] < 0) {
              if (playerBound[1] > entityBound[1] && position[1] < entityBound[1]) {
                position[1] = entityBound[1];
              }
            }
          }
        }
      });
    });
  }

  return { ...player, position };
};
