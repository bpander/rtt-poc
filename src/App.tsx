import * as React from 'react';

import Canvas from 'components/Canvas';
import GameEngine from 'components/GameEngine';
import { Input } from 'util/Input';

interface AppState {
  time: number;
  delta: number;
}

class App extends React.Component<{}, AppState> {

  width: number;
  height: number;

  input: Input;

  constructor(props: {}) {
    super(props);

    this.width = window.innerWidth * 2;
    this.height = window.innerHeight * 2;

    this.input = {
      lastKeysPressed: {},
      keysPressed: {},
    };

    this.state = {
      delta: 0,
      time: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.onAnimationFrame(0);
  }

  onResize = () => {
    this.width = window.innerWidth * 2;
    this.height = window.innerHeight * 2;
  };

  onKeyDown = (e: KeyboardEvent) => {
    this.input.keysPressed = {
      ...this.input.keysPressed,
      [e.key]: true,
    };
  };

  onKeyUp = (e: KeyboardEvent) => {
    this.input.keysPressed = {
      ...this.input.keysPressed,
      [e.key]: false,
    };
  };

  onAnimationFrame: FrameRequestCallback = time => {
    const delta = time - this.state.time;
    this.setState({ time, delta });
    this.input.lastKeysPressed = this.input.keysPressed;
    window.requestAnimationFrame(this.onAnimationFrame);
  };

  render() {
    return (
      <Canvas width={this.width} height={this.height}>
        <GameEngine
          time={this.state.time}
          delta={this.state.delta}
          input={this.input}
        />
      </Canvas>
    );
  }
}

export default App;
