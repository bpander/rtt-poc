
export const times = <T>(n: number, fn: (i: number) => T): T[] => {
  const arr: T[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn(i));
  }
  return arr;
}
