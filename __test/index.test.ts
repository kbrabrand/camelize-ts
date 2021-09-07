/* eslint-disable @typescript-eslint/camelcase */

import camelize from '../src'

describe('camelize', () => {
  it('strings', () => {
    expect(camelize('dat_string')).toBe('datString')
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
})