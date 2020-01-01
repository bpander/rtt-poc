import { EngineState } from '../duck';

export interface DebugProps {
  showNavMesh?: boolean;
  showPaths?: boolean;
  showGrid?: boolean;
}

export interface RendererProps {
  engine: EngineState;
  debug?: DebugProps;
}
