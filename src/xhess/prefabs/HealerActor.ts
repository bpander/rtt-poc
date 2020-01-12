import { XhessEntity, XhessFacetType, ActorFacet } from '../models/XhessEntity';
import { EntityName } from '../enums/EntityName';
import { FacetType } from 'modules/engine/models/Entity';

export const HealerActor: ActorFacet = {
  type: XhessFacetType.Actor,
  teamName: '',
  selected: false,
  maxHp: 10,
  hp: 10,
};

export const HealerEntity: XhessEntity = {
  name: EntityName.Player,
  position: [ 0, 0 ],
  rotation: 0,
  facets: [
    { type: FacetType.NavMeshAgent, path: [], velocity: 9 },
    HealerActor,
  ],
};
