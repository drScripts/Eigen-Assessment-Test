export const emptyPromise = (): Promise<null> => {
  return null;
};


export const isArrayUnique = (arr: any): boolean => {
  if (!Array.isArray(arr)) {
    return false;
  }
  const uniqueItems = new Set(arr);
  return uniqueItems.size === arr.length;
}