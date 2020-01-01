import { useState, useEffect } from 'react';

export const useAnimationFrame = (callback: (elapsed: number) => void) => {
  const [ , forceUpdate ] = useState();
  useEffect(() => {
    let id: number;
    let lastTime = 0;
    const onAnimationFrame = (time: number) => {
      callback(time - lastTime);
      forceUpdate({});
      lastTime = time;
      id = requestAnimationFrame(onAnimationFrame);
    };
    id = requestAnimationFrame(onAnimationFrame);
    return () => cancelAnimationFrame(id);
  }, [ callback ]);
};
