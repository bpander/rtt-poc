import { Vector2, Shape2 } from 'modules/geo2d/core';

export enum FacetType {
  NavMeshAgent,
  NavMeshHole,
}

export interface FacetBase<T extends number> {
  type: T;
}

export type AnyFacet = FacetBase<number>;

export interface NavMeshAgentFacet extends FacetBase<FacetType.NavMeshAgent> {
  path: Vector2[];
  velocity: number;
}

export interface NavMeshHoleFacet extends FacetBase<FacetType.NavMeshHole> {
  shape: Shape2;
}

export type Facet =
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
  name: PropertyKey;
  position: Vector2;
  rotation: number;
  facets: AnyFacet[];
}
