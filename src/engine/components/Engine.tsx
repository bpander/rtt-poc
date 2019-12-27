import React, { useEffect, useState } from 'react';
import { Vector2 } from 'geo2d/core';

interface Entity {
  position: Vector2;
  rotation: number;
  velocity: Vector2;
  baseMaxVelocity: Vector2;
}

interface Camera {
  position: Vector2;
  scale: number;
}

interface EngineProps {
  width: number;
  height: number;
}

interface EngineContextData {
  width: number;
  height: number;
  camera: Camera;
  entities: Entity[];
}

const defaultValue: EngineContextData = {
  width: 0,
  height: 0,
  camera: { position: [ 0, 0 ], scale: 25 },
  entities: [],
};

export const EngineContext = React.createContext(defaultValue);

const reduceEntities = (entities: Entity[], elapsed: number) => {
  return entities;
};

export const Engine: React.FC<EngineProps> = props => {
  const { width, height } = props;
  const [entities, setEntities] = useState<Entity[]>([]);
  const [camera] = useState<Camera>(defaultValue.camera);

  useEffect(() => {
    let id: number;
    let lastTime = 0;
    const onAnimationFrame = (time: number) => {
      const elapsed = time - lastTime;
      setEntities(reduceEntities(entities, elapsed));
      lastTime = time;
      id = requestAnimationFrame(onAnimationFrame);
    };
    id = requestAnimationFrame(onAnimationFrame);
    return () => cancelAnimationFrame(id);
  }, [entities]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ border: '1px solid black' }}
    >
      <EngineContext.Provider value={{ width, height, entities, camera }}>
        {props.children}
      </EngineContext.Provider>
    </svg>
  );
};
