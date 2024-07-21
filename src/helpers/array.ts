export const getUniqueArray = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};
