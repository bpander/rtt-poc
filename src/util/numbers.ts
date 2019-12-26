
export const isBetween = (n: number, n1: number, n2: number): boolean => {
  const [lower, upper] = [n1, n2].sort();
  return n > lower && n < upper;
};

export const isSameOrBetween = (n: number, n1: number, n2: number): boolean => {
  const [lower, upper] = [n1, n2].sort();
  return n >= lower && n <= upper;
};
