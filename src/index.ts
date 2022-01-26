type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : Lowercase<S>;

export type Camelize<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends Array<infer U>
    ? U extends {}
      ? Array<Camelize<U>>
      : T[K]
    : T[K] extends {}
    ? Camelize<T[K]>
    : T[K];
};

function camelCase(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
      return x.toUpperCase();
  });
}

function walk(obj): any {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj)) return obj.map(walk);

  return Object.keys(obj).reduce((res, key) => {
    const camel = camelCase(key);
    res[camel] = walk(obj[key]);
    return res;
  }, {});
}

export default function camelize<T>(
  obj: T
): T extends String ? string : Camelize<T> {
  return typeof obj === "string" ? camelCase(obj) : walk(obj);
}
