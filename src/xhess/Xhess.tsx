import React, { useEffect, useCallback } from 'react';
import { MainScene } from './scenes/main/MainScene';
import { SvgRenderer } from 'modules/engine/components/SvgRenderer';
import { useAnimationFrame } from 'modules/use-animation-frame/useAnimationFrame';
import { useRootState, rootStore } from 'root';
import { Provider, useDispatch } from 'react-redux';
import { updateEngine, tick } from 'modules/engine/duck';
import { emptyCamera } from 'modules/engine/models/Camera';
import { KeyboardProvider } from 'modules/keyboard/Keyboard';

const Renderer: React.FC = () => {
  const dispatch = useDispatch();
  const onAnimationFrame = useCallback((elapsed: number) => dispatch(tick(elapsed)), [ dispatch ]);
  useAnimationFrame(onAnimationFrame);
  const { engine } = useRootState();
  return (
    <SvgRenderer engine={engine} debug={{ showGrid: true, showFPS: true, showNavMesh: true, showPaths: true }}>
      <MainScene />
    </SvgRenderer>
  );
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
      <KeyboardProvider>
        <Renderer />
      </KeyboardProvider>
    </Provider>
  );
};
