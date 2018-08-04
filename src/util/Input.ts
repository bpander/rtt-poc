
interface KeyMap {
  [key: string]: boolean;
}

export interface Input {
  lastKeysPressed: KeyMap;
  keysPressed: KeyMap;
}
