
export const times = <T>(n: number, fn: (i: number) => T): T[] => {
  const arr: T[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(fn(i));
  }
  return arr;
};

export const removeFirst = <T, U extends T>(haystack: T[], needle: U, replacement?: U): T[] => {
  const index = haystack.indexOf(needle);
  if (index === -1) {
    return haystack;
  }
  const clone = [ ...haystack ];
  if (replacement) {
    clone.splice(index, 1, replacement);
  } else {
    clone.splice(index, 1);
  }
  return clone;
};

export const last = <T>(arr: T[]): T | undefined => arr[arr.length - 1];
