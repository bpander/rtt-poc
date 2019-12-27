
export const times = <T>(n: number, fn: (i: number) => T): T[] => {
  const arr: T[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn(i));
  }
  return arr;
};

export const removeFirst = <T>(haystack: T[], needle: T): T[] => {
  const index = haystack.indexOf(needle);
  if (index === -1) {
    return haystack;
  }
  const clone = [ ...haystack ];
  clone.splice(index, 1);
  return clone;
};
