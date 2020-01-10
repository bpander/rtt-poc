import { Vector2, Shape2 } from 'modules/geo2d/core';

export enum FacetType {
  Collider,
  SvgSprite,
  NavMeshAgent,
  NavMeshHole,
}

export interface FacetBase<T extends number> {
  type: T;
}

export type AnyFacet = FacetBase<number>;

export interface ColliderFacet extends FacetBase<FacetType.Collider> {
  size: Vector2;
}

export interface EntityComponentProps { facet: SvgSpriteFacet; entity: Entity }

export interface SvgSpriteFacet extends FacetBase<FacetType.SvgSprite> {
  size: Vector2;
  Component: React.ComponentType<EntityComponentProps>;
}

export interface NavMeshAgentFacet extends FacetBase<FacetType.NavMeshAgent> {
  path: Vector2[];
  velocity: number;
}

export interface NavMeshHoleFacet extends FacetBase<FacetType.NavMeshHole> {
  shape: Shape2;
}

export type Facet = 
  | SvgSpriteFacet
  | ColliderFacet
  | NavMeshAgentFacet
  | NavMeshHoleFacet

export type FacetMap = {
  [FT in FacetType]: Extract<Facet, { type: FT }>;
};

export const createIsFacetType = <TFacetMap extends Record<string, AnyFacet>>() => {
  const isFacetType = <T extends keyof TFacetMap>(t: T) => (facet: AnyFacet): facet is TFacetMap[T] => {
    return facet.type === t;
  };
  return isFacetType;
};

export const isStockFacetType = createIsFacetType<FacetMap>();

export interface Entity {
  id: string;
  position: Vector2;
  rotation: number;
  facets: Facet[];
}
