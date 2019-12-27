import { Vector2 } from 'geo2d/core';

export enum FacetType {
  Collider,
  SvgSprite,
  Metadata,
}

interface FacetBase {
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

export interface MetadataFacet<T> extends FacetBase {
  type: FacetType.Metadata;
  key: string;
  data: T;
}

export type FacetMap = {
  [FacetType.Collider]: ColliderFacet;
  [FacetType.SvgSprite]: SvgSpriteFacet;
  [FacetType.Metadata]: MetadataFacet<any>;
}

type ValueOf<T> = T[keyof T];
export type Facet = ValueOf<FacetMap>;

export const isFacetType = <T extends FacetType>(t: T) => (facet: Facet): facet is FacetMap[T] => {
  return true;
};

export interface Entity {
  id: string;
  position: Vector2;
  rotation: number;
  // velocity: Vector2;
  // baseMaxVelocity: number;
  facets: Facet[];
}
