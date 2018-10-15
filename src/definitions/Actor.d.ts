import ActorEffect from './ActorEffect';
import ActorRace from 'enums/ActorRace';
import Vector2 from './Vector2';
import ActorEffectableAttributes from './ActorEffectableAttributes';
import PossessableItemType from './PossessableItemType';

interface PossessableItem {
  name: string;
  type: PossessableItemType;
  basePrice: number;
  weight: number;
  effect: ActorEffect;
}

type Actor = ActorEffectableAttributes & {
  race: ActorRace;
  hp: number;
  sp: number;
  mp: number;
  xp: number;
  effects: ActorEffect[];
  inventory: PossessableItem[];

  // levels
  unarmedLevel: number;
  daggerLevel: number;
  swordLevel: number;
  hammerLevel: number;
  archeryLevel: number;

  // physical state
  position: Vector2;
  rotation: number;
}
