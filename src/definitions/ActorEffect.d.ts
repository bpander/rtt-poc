import ActorEffectableAttributes from './ActorEffectableAttributes';
import ArithmeticOperator from 'enums/ArithmeticOperator';

export default interface ActorEffect {
  modifies: keyof ActorEffectableAttributes;
  operator: ArithmeticOperator;
  amount: number;
}
