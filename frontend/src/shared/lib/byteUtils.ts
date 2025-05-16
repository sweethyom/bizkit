export const getByteSize = (str: string) => {
  return new TextEncoder().encode(str).length;
};

export const isOverByteSize = (str: string, maxByteSize: number) => {
  return getByteSize(str) > maxByteSize;
};
