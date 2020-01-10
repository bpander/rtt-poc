import { FacetBase, createIsFacetType, FacetMap, Entity, Facet } from 'modules/engine/models/Entity';

export enum XhessFacetType {
  Actor = 100,
}

export interface ActorFacet extends FacetBase<XhessFacetType.Actor> {
  team: string;
  selected: boolean;
}

export type XhessFacet =
  | ActorFacet

export type XhessFacetMap = {
  [FT in XhessFacetType]: Extract<XhessFacet, { type: FT }>;
};

export const isFacetType = createIsFacetType<FacetMap & XhessFacetMap>();

export interface XhessEntity extends Entity {
  facets: (Facet | XhessFacet)[];
}
