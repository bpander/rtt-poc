import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Vector2 } from 'geo2d/core';
import { Entity } from 'engine/models/Entity';

interface Camera {
  position: Vector2;
  scale: number;
}

interface EngineProps {
  width: number;
  height: number;
  renderer: React.ComponentType;
}

interface EngineContextValue {
  width: number;
  height: number;
  camera: Camera;
  entities: Entity[];
  addEntity: (entity: Entity) => void;
}

const defaultValue: EngineContextValue = {
  width: 0,
  height: 0,
  camera: { position: [ 0, 0 ], scale: 25 },
  entities: [],
  addEntity: () => {},
};

export const EngineContext = React.createContext(defaultValue);

const reduceEntities = (entities: Entity[], elapsed: number) => {
  return entities;
};

export const Engine: React.FC<EngineProps> = props => {
  const { width, height } = props;
  const [, forceUpdate] = useState();
  const entitiesRef = useRef<Entity[]>([]);
  const cameraRef = useRef<Camera>(defaultValue.camera);
  const addEntity = useCallback((entity: Entity) => {
    entitiesRef.current = [ ...entitiesRef.current, entity ];
  }, []);

  useEffect(() => {
    let id: number;
    let lastTime = 0;
    const onAnimationFrame = (time: number) => {
      const elapsed = time - lastTime;
      entitiesRef.current = reduceEntities(entitiesRef.current, elapsed);
      lastTime = time;
      forceUpdate(0);
      id = requestAnimationFrame(onAnimationFrame);
    };
    id = requestAnimationFrame(onAnimationFrame);
    return () => cancelAnimationFrame(id);
  }, []);

  const entities = entitiesRef.current;
  const camera = cameraRef.current;

  return (
    <EngineContext.Provider value={{ width, height, entities, camera, addEntity }}>
      <props.renderer />
      {props.children}
    </EngineContext.Provider>
  );
};
