const isArray = (a: unknown): a is any[] => Array.isArray(a);

const isObject = (o: unknown): o is Record<string, unknown> => 
  typeof o === "object" && o !== null && !isArray(o) && typeof o !== "function";

const toCamelCase = (s: string): string => 
  s.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace("-", "").replace("_", ""));

const convertToCamelCase = (o: unknown): any => {
  if (isObject(o) && Object.keys(o).length) {
    const n: Record<string, unknown> = {};

    Object.keys(o).forEach((k) => {
      n[toCamelCase(k)] = convertToCamelCase(o[k]);
    });

    return n;
  }

  if (isArray(o)) {
    return o.map((i) => convertToCamelCase(i));
  }

  return o;
};

export default convertToCamelCase;
