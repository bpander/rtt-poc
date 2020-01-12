import React, { useEffect, useRef } from 'react';

interface KeyboardInfo {
  pressed: Partial<{ [key: string]: true }>;
}

const initialKeyboardInfo: KeyboardInfo = {
  pressed: {},
};

export const KeyboardContext = React.createContext(initialKeyboardInfo);

export const KeyboardProvider: React.FC = props => {
  const keyboardInfo = useRef(initialKeyboardInfo);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyboardInfo.current.pressed[e.key] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      delete keyboardInfo.current.pressed[e.key];
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [keyboardInfo]);

  return (
    <KeyboardContext.Provider value={keyboardInfo.current}>
      {props.children}
    </KeyboardContext.Provider>
  )
};
