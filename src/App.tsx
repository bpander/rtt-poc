import React from 'react';

import { Engine } from 'engine/components/Engine';
import { MainScene } from 'scenes/MainScene';

export const App: React.FC = () => {
  return (
    <Engine width={800} height={450}>
      <MainScene />
    </Engine>
  );
};
