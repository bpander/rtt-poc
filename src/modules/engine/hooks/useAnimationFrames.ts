import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import { tick } from '../duck';

export const useAnimationFrames = () => {
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
};
