import * as React from 'react';

import 'App.css';
import Canvas from 'components/Canvas';
import Game from 'components/Game';

interface AppState {
  time: number;
  delta: number;
}

class App extends React.Component<{}, AppState> {

  width: number;
  height: number;

  constructor(props: {}) {
    super(props);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.state = {
      delta: 0,
      time: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onAnimationFrame(0);
  }

  onResize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };

  onAnimationFrame: FrameRequestCallback = time => {
    const delta = time - this.state.time;
    this.setState({ time, delta });
    window.requestAnimationFrame(this.onAnimationFrame);
  };

  render() {
    return (
      <Canvas width={this.width} height={this.height}>
        <Game time={this.state.time} delta={this.state.delta} />
      </Canvas>
    );
  }
}

export default App;
