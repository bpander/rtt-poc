import React from 'react';

import CanvasContext, { defaultContext } from 'contexts/CanvasContext';

type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement>;

interface CanvasState {
  ctx: CanvasRenderingContext2D;
}

export default class Canvas extends React.Component<CanvasProps, CanvasState> {

  ref: React.RefObject<HTMLCanvasElement>;

  constructor(props: CanvasProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      ctx: defaultContext,
    };
  }

  componentDidMount() {
    this.setState({ ctx: this.ref.current!.getContext('2d') || defaultContext });
  }

  render() {
    const { children, ...canvasProps } = this.props;
    return (
      <CanvasContext.Provider value={this.state.ctx}>
        <canvas {...canvasProps} ref={this.ref} />
        {children}
      </CanvasContext.Provider>
    );
  }
}
