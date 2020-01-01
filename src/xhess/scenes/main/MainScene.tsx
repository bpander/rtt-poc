import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FacetType, Entity } from 'modules/engine/models/Entity';
import { updateEngine, getNavMeshHoles } from 'modules/engine/duck';
// import { Rock } from 'xhess/sprites/Rock';
// import { Paper } from 'xhess/sprites/Paper';
import { Scissors } from 'xhess/sprites/Scissors';
import { Box } from 'xhess/sprites/Box';
import { NavigableArea } from 'xhess/sprites/NavigableArea';
import { updateXhess } from 'xhess/duck';
import { getEdges } from 'modules/geo2d/navMesh2d';
import { regularPolygon } from 'modules/geo2d/core';

const initialEntities: Entity[] = [
  {
    id: 'navigable_area',
    position: [ 0, 0 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 0, 0 ], Component: NavigableArea },
    ],
  },
  // {
  //   id: 'player_rock',
  //   position: [ 14, 16 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Rock },
  //     { type: FacetType.NavMeshAgent, path: [], velocity: 3 },
  //   ],
  // },
  // {
  //   id: 'player_paper',
  //   position: [ 16, 16 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Paper },
  //     { type: FacetType.NavMeshAgent, path: [], velocity: 6 },
  //   ],
  // },
  {
    id: 'player_scissors',
    position: [ 2.5, 1.5 ],
    rotation: 0,
    facets: [
      { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Scissors },
      { type: FacetType.NavMeshAgent, path: [], velocity: 9 },
    ],
  },
  // {
  //   id: 'enemy_rock',
  //   position: [ 14, 2 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Rock },
  //     { type: FacetType.NavMeshAgent, path: [], velocity: 3 },
  //   ],
  // },
  // {
  //   id: 'enemy_paper',
  //   position: [ 16, 2 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Paper },
  //     { type: FacetType.NavMeshAgent, path: [], velocity: 6 },
  //   ],
  // },
  // {
  //   id: 'enemy_scissors',
  //   position: [ 18, 2 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Scissors },
  //     { type: FacetType.NavMeshAgent, path: [], velocity: 12 },
  //   ],
  // },
  {
    id: 'box1',
    position: [ 2, 2 ],
    rotation: Math.PI / 16,
    facets: [
      { type: FacetType.SvgSprite, size: [ 7, 1 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 7.5, -0.5 ], [ 7.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'box2',
    position: [ 4, 11 ],
    rotation: -Math.PI / 4,
    facets: [
      { type: FacetType.SvgSprite, size: [ 7, 1 ], Component: Box },
      {
        type: FacetType.NavMeshHole,
        shape: [ [ -0.5, -0.5 ], [ 7.5, -0.5 ], [ 7.5, 1.5 ], [ -0.5, 1.5 ] ],
      },
    ],
  },
  {
    id: 'ring',
    position: [ 5, 5 ],
    rotation: 0,
    facets: [
      {
        type: FacetType.SvgSprite,
        size: [ 1, 1 ],
        Component: () => <circle r={2} />
      },
      { type: FacetType.NavMeshHole, shape: regularPolygon(2.5, 16) },
    ],
  },
  // {
  //   id: 'box2',
  //   position: [ 2, 3 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
  //     {
  //       type: FacetType.NavMeshHole,
  //       shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
  //     },
  //   ],
  // },
  // {
  //   id: 'box3',
  //   position: [ 4, 3 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 5 ], Component: Box },
  //     {
  //       type: FacetType.NavMeshHole,
  //       shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 5.5 ], [ -0.5, 5.5 ] ],
  //     },
  //   ],
  // },
  // {
  //   id: 'box4',
  //   position: [ 5, 6 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Box },
  //     {
  //       type: FacetType.NavMeshHole,
  //       shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 1.5 ], [ -0.5, 1.5 ] ],
  //     },
  //   ],
  // },
  // {
  //   id: 'box5',
  //   position: [ 8, 6 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 1 ], Component: Box },
  //     {
  //       type: FacetType.NavMeshHole,
  //       shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 1.5 ], [ -0.5, 1.5 ] ],
  //     },
  //   ],
  // },
  // {
  //   id: 'box6',
  //   position: [ 9, 3 ],
  //   rotation: 0,
  //   facets: [
  //     { type: FacetType.SvgSprite, size: [ 1, 4 ], Component: Box },
  //     {
  //       type: FacetType.NavMeshHole,
  //       shape: [ [ -0.5, -0.5 ], [ 1.5, -0.5 ], [ 1.5, 4.5 ], [ -0.5, 4.5 ] ],
  //     },
  //   ],
  // },
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
