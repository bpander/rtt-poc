import Vector2 from 'definitions/Vector2';

export enum FacetType {
  Collider,
  Sprite,
}

interface FacetBase {
  type: FacetType;
}

export interface ColliderFacet extends FacetBase {
  type: FacetType.Collider;
  size: Vector2;
}

export interface SpriteFacet extends FacetBase {
  type: FacetType.Sprite;
  size: Vector2;
}

export type Facet = ColliderFacet | SpriteFacet;

export interface Entity {
  position: Vector2;
  facets: Facet[];
}
