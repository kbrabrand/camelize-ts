/* eslint-disable @typescript-eslint/camelcase */

import camelize, { type Camelize } from '../src'

describe('camelize', () => {
  describe('shallow', () => {
    it('strings', () => {
      expect(camelize('dat_string', true)).toBe('datString')
    })

    it('does not touch string values in arrays', () => {
      expect(camelize(['dat_string', 'other_string'])).toEqual(['dat_string', 'other_string'])
    })

    it('leaves dates and regexp', () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(camelize({ 
        a_key: 1, 
        b: {
          numb_erty: 123,
          dat_erty: date,
          regexp_erty: regExp
        } 
      }, true)).toEqual({ 
        aKey: 1, 
        b: { 
          numb_erty: 123, 
          dat_erty: date,
          regexp_erty: regExp 
        } 
      })
    })

    it('object', () => {
      expect(camelize({ a_key: 1, b_key: 2 }, true)).toEqual({ aKey: 1, bKey: 2 })
    })

    it('nested object', () => {
      expect(camelize({ a_key: { b_key: 2 } }, true)).toEqual({ aKey: { b_key: 2 } })
    })

    it('complex object with arrays and nested values', () => {
      expect(camelize({
        a_key: {
          strings_in_a_list: ['dat_string', 'other_string'],
          b: { a_key: 123 },
        },
      }, true)).toEqual({
        aKey: {
          strings_in_a_list: ['dat_string', 'other_string'],
          b: { a_key: 123 },
        },
      })
    })

    it('objects nested in array properties', () => {
      const camelized = camelize({
        a_key: {
          a_list: [{
            a_nested_value: 123,
            a_deeply_nested_object: {
              a_deeeeeply_nested_value: 'baz',
              a_deeply_nested_object: {
                a_deeeeeply_nested_value: 'bar',
                a_deeply_nested_object: {
                  a_deeeeeply_nested_value: 'foo'
                }
              }
            }
          }]
        }
      }, true)

      expect(camelized.aKey.a_list[0].a_deeply_nested_object.a_deeply_nested_object.a_deeeeeply_nested_value).toEqual('bar')
    })

    it('leaves cased letters in place', () => {
      type Snake = {
        foo_bar_nested: {
          Uppercased: {
            foo_CAPS_foo: true
          }
        }
        fooBar_bar: {
          camelCased_foo_foo: 123
        }
      }

      const a = camelize<Snake, true>({
        foo_bar_nested: {
          Uppercased: {
            foo_CAPS_foo: true
          }
        },
        fooBar_bar: {
          camelCased_foo_foo: 123
        }
      }, true)

      expect(a.fooBarNested.Uppercased.foo_CAPS_foo).toBe(true)
      expect(a.fooBarBar.camelCased_foo_foo).toBe(123)
    })

    it('nested optional properties', () => {
      type T = {
        one_a?: string;
        one_b?: {
          two_a?: string;
          two_b?: {
            three_a?: string;
          };
        };
      }

      const t: Camelize<T, true> = {
        oneA: "string",
        oneB: {
          two_a: "string",
          two_b: {
            three_a: "c",
          },
        },
      };

      expect(t.oneB?.two_b?.three_a).toBe("c")
    })

    it('camelizes arrays', () => {
      expect(camelize([{foo_bar:{bar_foo:123}}], true)[0].fooBar.bar_foo).toBe(123)
    })
  })

  describe('deep', () => {
    it('strings', () => {
      expect(camelize('dat_string', true)).toBe('datString')
    })

    it('does not touch string values in arrays', () => {
      expect(camelize(['dat_string', 'other_string'], true)).toEqual(['dat_string', 'other_string'])
    })

    it('leaves dates and regexp', () => {
      const regExp = new RegExp(/.*/)
      const date = new Date(0)

      expect(camelize({ 
        a_key: 1, 
        b: {
          numb_erty: 123,
          dat_erty: date,
          regexp_erty: regExp
        } 
      })).toEqual({ 
        aKey: 1, 
        b: { 
          numbErty: 123, 
          datErty: date,
          regexpErty: regExp 
        } 
      })
    })

    it('object', () => {
      expect(camelize({ a_key: 1, b_key: 2 })).toEqual({ aKey: 1, bKey: 2 })
    })

    it('nested object', () => {
      expect(camelize({ a_key: { b_key: 2 } })).toEqual({ aKey: { bKey: 2 } })
    })

    it('complex object with arrays and nested values', () => {
      expect(camelize({
        a_key: {
          strings_in_a_list: ['dat_string', 'other_string'],
          b: { a_key: 123 },
        },
      })).toEqual({
        aKey: {
          stringsInAList: ['dat_string', 'other_string'],
          b: { aKey: 123 },
        },
      })
    })

    it('objects nested in array properties', () => {
      const camelized = camelize({
        a_key: {
          a_list: [{
            a_nested_value: 123,
            a_deeply_nested_object: {
              a_deeeeeply_nested_value: 'foo',
              a_deeply_nested_object: {
                a_deeeeeply_nested_value: 'foo',
                a_deeply_nested_object: {
                  a_deeeeeply_nested_value: 'foo'
                }
              }
            }
          }]
        }
      })

      expect(camelized.aKey.aList[0].aDeeplyNestedObject.aDeeplyNestedObject.aDeeeeeplyNestedValue).toEqual('foo')
    })

    it('leaves cased letters in place', () => {
      type Snake = {
        foo_bar_nested: {
          Uppercased: {
            foo_CAPS_foo: true
          }
        }
        fooBar_bar: {
          camelCased_foo_foo: 123
        }
      }

      const a = camelize<Snake>({
        foo_bar_nested: {
          Uppercased: {
            foo_CAPS_foo: true
          }
        },
        fooBar_bar: {
          camelCased_foo_foo: 123
        }
      })

      expect(a.fooBarNested.Uppercased.fooCAPSFoo).toBe(true)
      expect(a.fooBarBar.camelCasedFooFoo).toBe(123)
    })

    it('nested optional properties', () => {
      type T = {
        one_a?: string;
        one_b?: {
          two_a?: string;
          two_b?: {
            three_a?: string;
          };
        };
      }

      const t: Camelize<T> = {
        oneA: "string",
        oneB: {
          twoA: "string",
          twoB: {
            threeA: "c",
          },
        },
      };

      expect(t.oneB?.twoB?.threeA).toBe("c")
    })

    it('camelizes arrays', () => {
      expect(camelize([{foo_bar:{bar_foo:123}}])[0].fooBar.barFoo).toBe(123)
    })
  })
})
