import React from 'react';
import { Provider } from 'react-redux';

import { Engine } from 'engine/components/Engine';
import { SvgRenderer } from 'engine/components/SvgRenderer';
import { rootStore, useRootState } from 'root';
import { MainScene } from 'scenes/MainScene';

const GameComponent: React.FC = () => {
  const engineState = useRootState('engine');

  return (
    <SvgRenderer engineState={engineState}>
      <MainScene />
    </SvgRenderer>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={rootStore}>
      <Engine Component={GameComponent} />
    </Provider>
  );
};
