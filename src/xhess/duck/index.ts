import { createSlice } from 'modules/create-slice';
import { Entity, FacetType } from 'modules/engine/models/Entity';
import { Vector2, isSameVector2 } from 'modules/geo2d/core';
import { last, removeFirst } from 'util/arrays';
import { isFacetType } from 'xhess/models/XhessEntity';
import { configureEngineAction, getNavMeshGraph } from 'modules/engine/duck';
import { getPath } from 'modules/geo2d/navMesh2d';

interface Team {
  name: string;
  color: string;
}

interface XhessState {
  teams: Team[];
  playerTeam: string;
}

const initialXhessState: XhessState = {
  teams: [],
  playerTeam: 'blue',
};

const { reducer, update } = createSlice(initialXhessState, 'XHESS');
export const xhessReducer = reducer;
export const updateXhess = update;


const canMoveToPoint = (entity: Entity, entities: Entity[], point: Vector2) => {
  return entities.every(e => {
    if (e === entity) {
      return true;
    }
    if (isSameVector2(point, e.position)) {
      return false;
    }
    const agent = e.facets.find(isFacetType(FacetType.NavMeshAgent));
    const theirTarget = agent && last(agent.path);
    return !theirTarget || !isSameVector2(theirTarget, point);
  });
};

export const navigateEntity = configureEngineAction<{ entityToMove: Entity; target: Vector2 }>(
  'NAVIGATE_ENTITY',
  ({ entityToMove: entity, target }) => s => {
    const g = getNavMeshGraph(s);
    const agent = entity.facets.find(isFacetType(FacetType.NavMeshAgent));
    if (!agent || !canMoveToPoint(entity, s.entities, target)) {
      return s;
    }
    const path = getPath(g, s.navMesh.flat(), entity.position, target);
    const entities = removeFirst(s.entities, entity, {
      ...entity, facets: removeFirst(entity.facets, agent, { ...agent, path }),
    });
    return { ...s, entities };
  },
);
