import React, { useEffect } from 'react';
import { MainScene } from './scenes/main/MainScene';
import { SvgRenderer } from 'engine/components/SvgRenderer';
import { useAnimationFrames } from 'engine/hooks/useAnimationFrames';
import { useRootState, rootStore } from 'root';
import { Provider } from 'react-redux';
import { updateEngine } from 'engine/duck';
import { emptyCamera } from 'engine/models/Camera';

const Renderer: React.FC = () => {
  useAnimationFrames();
  const { engine } = useRootState();
  return <SvgRenderer engine={engine} debug={{ showGrid: true, showNavMesh: true, showPaths: true }} />;
};

export const Xhess: React.FC = () => {
  useEffect(() => {
    rootStore.dispatch(updateEngine({
      width: 800,
      height: 450,
      camera: { ...emptyCamera, scale: 25 },
    }));
  }, []);

  return (
    <Provider store={rootStore}>
      <Renderer />
      <MainScene />
    </Provider>
  );
};
