import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FacetType, Entity } from 'engine/models/Entity';
import { updateEngine, getNavMeshHoles } from 'engine/duck';
import { Rock } from 'xhess/sprites/Rock';
import { Paper } from 'xhess/sprites/Paper';
import { Scissors } from 'xhess/sprites/Scissors';
import { Box } from 'xhess/sprites/Box';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess } from 'xhess/duck';
import { getEdges } from 'geo2d/navMesh2d';

const initialEntities: Entity[] = [
  {
    id: 'navigable_area',
    position: [ 0, 0 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 0, 0 ], Component: NavigableArea },
    ],
  },
  {
    id: 'player_rock',
    position: [ 14, 16 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Rock },
      { type: FacetType.NavMeshAgent, path: [], velocity: 3 },
    ],
  },
  {
    id: 'player_paper',
    position: [ 16, 16 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Paper },
      { type: FacetType.NavMeshAgent, path: [], velocity: 6 },
    ],
  },
  {
    id: 'player_scissors',
    position: [ 18, 16 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Scissors },
      { type: FacetType.NavMeshAgent, path: [], velocity: 9 },
    ],
  },
  {
    id: 'enemy_rock',
    position: [ 14, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Rock },
      { type: FacetType.NavMeshAgent, path: [], velocity: 3 },
    ],
  },
  {
    id: 'enemy_paper',
    position: [ 16, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Paper },
      { type: FacetType.NavMeshAgent, path: [], velocity: 6 },
    ],
  },
  {
    id: 'enemy_scissors',
    position: [ 18, 2 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Scissors },
      { type: FacetType.NavMeshAgent, path: [], velocity: 12 },
    ],
  },
  {
    id: 'box1',
    position: [ 14, 3 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 4, 1 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 4.5, -0.5 ], [ 4.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'box2',
    position: [ 14, 14 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 4, 1 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 4.5, -0.5 ], [ 4.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'box3',
    position: [ 15, 8 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 2, 2 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 2.5, -0.5 ], [ 2.5, 2.5 ], [ -0.5, 2.5 ] ],
      },
    ],
  },
  {
    id: 'box4',
    position: [ 4, 4 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
      },
    ],
  },
  {
    id: 'box5',
    position: [ 4, 10 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
      },
    ],
  },
  {
    id: 'box6',
    position: [ 27, 4 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
      },
    ],
  },
  {
    id: 'box7',
    position: [ 27, 10 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
      },
    ],
  },
];

export const MainScene: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(updateEngine({
      entities: initialEntities,
      navMesh: getEdges(getNavMeshHoles(initialEntities)),
    }));
    dispatch(updateXhess({
      teams: [
        {
          name: 'blue',
          color: 'blue',
          entities: [ 'player_rock', 'player_paper', 'player_scissors' ],
        },
      ],
    }));
  }, [ dispatch ]);

  return null;
}
