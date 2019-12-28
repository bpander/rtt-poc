import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { tick } from '../duck';

export interface EngineProps {
  Component: React.ComponentType;
}

export const Engine: React.FC<EngineProps> = props => {
  const dispatch = useDispatch();
  const [ , forceUpdate ] = useState();
  useEffect(() => {
    let id: number;
    let lastTime = 0;
    const onAnimationFrame = (time: number) => {
      dispatch(tick(time - lastTime));
      forceUpdate({});
      lastTime = time;
      id = requestAnimationFrame(onAnimationFrame);
    };
    id = requestAnimationFrame(onAnimationFrame);
    return () => cancelAnimationFrame(id);
  }, [ dispatch ]);

  return <props.Component />;
};
