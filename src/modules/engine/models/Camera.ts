import { Vector2 } from 'modules/geo2d/core';

export interface Camera {
  position: Vector2;
  scale: number;
}

export const emptyCamera: Camera = { position: [ 0, 0 ], scale: 1 };
