type CamelCase<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
    : S;



export type Camelize<T, S = false> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends Array<infer U>
    ? U extends ({} | undefined)
      ? Array<Camelize<U>>
      : T[K]
    : T[K] extends ({} | undefined)
    ? S extends true
      ? T[K]
      : Camelize<T[K]>
    : T[K];
};

function camelCase(str: string) {
  return str.replace(/[_.-](\w|$)/g, function (_, x) {
      return x.toUpperCase();
  });
}

function walk(obj, shallow = false): any {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date || obj instanceof RegExp) return obj;
  if (Array.isArray(obj)) return obj.map(v => shallow ? v : walk(v));

  return Object.keys(obj).reduce((res, key) => {
    const camel = camelCase(key);
    res[camel] = shallow ? obj[key] : walk(obj[key]);
    return res;
  }, {});
}

export default function camelize<T, S extends boolean = false>(
  /**
   * Value to be camelized
   */
  obj: T,

  /**
   * If true, only the top level keys of the obj will be camel cased
   */
  shallow?: S
): T extends String ? string : Camelize<T, S> {
  return typeof obj === "string" ? camelCase(obj) : walk(obj, shallow);
}
