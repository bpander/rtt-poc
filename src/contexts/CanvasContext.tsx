import React from 'react';

const defaultContext = document.createElement('canvas').getContext('2d') as CanvasRenderingContext2D;
const CanvasContext = React.createContext(defaultContext!);

export default CanvasContext;
export { defaultContext };
