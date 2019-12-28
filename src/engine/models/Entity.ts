import { Vector2, Shape2 } from 'geo2d/core';

export enum FacetType {
  Collider,
  SvgSprite,
  NavMeshAgent,
  NavMeshHole,
}

export interface FacetBase {
  type: FacetType;
}

export interface ColliderFacet extends FacetBase {
  type: FacetType.Collider;
  size: Vector2;
}

export interface EntityComponentProps { facet: SvgSpriteFacet; entity: Entity }

export interface SvgSpriteFacet extends FacetBase {
  type: FacetType.SvgSprite;
  size: Vector2;
  Component: React.ComponentType<EntityComponentProps>;
}

export interface NavMeshAgentFacet extends FacetBase {
  type: FacetType.NavMeshAgent;
  destination: Vector2 | null;
}

export interface NavMeshHoleFacet extends FacetBase {
  type: FacetType.NavMeshHole;
  shape: Shape2;
}

export type FacetMap = {
  [FacetType.Collider]: ColliderFacet;
  [FacetType.SvgSprite]: SvgSpriteFacet;
  [FacetType.NavMeshAgent]: NavMeshAgentFacet;
  [FacetType.NavMeshHole]: NavMeshHoleFacet;
}

type ValueOf<T> = T[keyof T];
export type Facet = ValueOf<FacetMap>;

export const isFacetType = <T extends FacetType>(t: T) => (facet: Facet): facet is FacetMap[T] => {
  return facet.type === t;
};

export interface Entity {
  id: string;
  position: Vector2;
  rotation: number;
  // velocity: Vector2;
  // baseMaxVelocity: number;
  facets: Facet[];
}
