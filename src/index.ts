import { types } from "util";
import camelCase from "lodash.camelcase";

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

function walk(obj): any {
  if (!obj || typeof obj !== "object") return obj;
  if (types.isDate(obj) || types.isRegExp(obj)) return obj;
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
