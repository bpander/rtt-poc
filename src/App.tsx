import React, { Fragment } from 'react';
import createGraph, { Graph, Node } from 'ngraph.graph';
import { nba } from 'ngraph.path';
import { times } from 'ramda';

const getNodes = (graph: Graph) => {
  const arr: Node[] = [];
  graph.forEachNode(node => { arr.push(node); });
  return arr;
};

type Vector2 = [number, number];

const getDistance = ([x1, y1]: Vector2, [x2, y2]: Vector2): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const idToV2 = (id: string | number): Vector2 => {
  const [x, y] = (id as string).split(',').map(Number);
  return [x, y].map(n => n * 25 + 30) as Vector2;
};

const g = createGraph<Vector2>();
(window as any).g = g;

times(x => {
  times(y => {
    times(x1 => {
      times(y1 => {
        if (x1 === 1 && y1 === 1) {
          return;
        }
        g.addLink([x, y].join(), [x + (x1 - 1), y + (y1 - 1)].join());
      }, 3);
    }, 3);
  }, 16);
}, 16);

g.removeNode('13,5');
g.removeNode('12,5');
g.removeNode('12,4');
const pathfinder = nba(g, { distance: (a, b) => {
  return getDistance(idToV2(a.id), idToV2(b.id));
}});
const path = pathfinder.find('12,2', '13,14');

export const App: React.FC = () => {
  const nodes = getNodes(g);
  return (
    <svg width={800} height={450} viewBox="0 0 800 450">
      {nodes.map(node => {
        const [finalX, finalY] = idToV2(node.id);
        return (
          <Fragment key={node.id}>
            <circle cx={finalX} cy={finalY} r={3} />
            {node.links.map(link => {
              const [finalX2, finalY2] = idToV2(link.fromId);
              return (
                <line stroke="black" key={link.id} x1={finalX} y1={finalY} x2={finalX2} y2={finalY2} />
              );
            })}
          </Fragment>
        );
      })}
      {path.map((node, i) => {
        const nextNode = path[i + 1];
        if (!nextNode) {
          return null;
        }
        const [x1, y1] = idToV2(node.id);
        const [x2, y2] = idToV2(nextNode.id);
        return (
          <line key={node.id} {...{ x1, x2, y1, y2 }} stroke="red" strokeWidth={3} />
        );
      })}
    </svg>
  );
};

