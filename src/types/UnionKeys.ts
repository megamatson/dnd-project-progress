type UnionKeys<T> = T extends T ? keyof T : never;

export default UnionKeys;