camelize-ts
===
[![CI](https://github.com/kbrabrand/camelize-ts/actions/workflows/main.yml/badge.svg)](https://github.com/kbrabrand/camelize-ts/actions/workflows/main.yml)

A typescript typed camelCase function that recursively camel cases a snake cased or pascal cased object structure. It camel cases a simple string too, if you need that.

`camelize-ts` is [`snakify-ts`](https://www.npmjs.com/package/snakify-ts)’ twin 👯.

## Why do this again?
This has obviously been done before, and the "new" thing with this pacakge is not camel casing itself but the fact that it is a generic that, given the form of the input data structure, will provide you with typing for the returned object structure so that it fits with other types.

As an example I've been using it to camelize PostgreSQL rows (returned with snake case) before passing them to other functions in our GraphQL server (using camel cased property names).

## Example
```ts
import camelize from 'camelize-ts'

// Expects camel case
function nameIt({ 
  firstName, 
  lastName 
}: { 
  id: number, 
  firstName: string, 
  lastName: string, 
  roles: string[]
}) { return `${firstName} ${lastName}` }

// camel case snake_cased stuff from postgres
const camelizedUser = camelize({
  id: 1,
  first_name: 'Grim',
  last_name: 'Reaper',
  roles: ['user', 'admin']
})

console.log(JSON.stringify(camelizedUser, null, 2))
console.log(nameIt(camelizedUser)
```

output:

```sh
{
  "id": 1,
  "firstName": "Grim",
  "lastName": "Reaper",
  "roles": [
    "user",
    "admin"
  ]
}

Grim Reaper
```

It also converts pascal cased object fields to camel case.

```ts
import camelize from 'camelize-ts'

const camelizedUser = camelize({
  Id: 1,
  first_name: 'Grim',
  last_name: 'Reaper',
  greetings: {
    Morning: 'Good morning!',
    Night: 'Good night!'
  },
  roles: ['user', 'admin'],
  UpdatedAt: '2000-01-01T00:00:00.000Z'
})

console.log(JSON.stringify(camelizedUser, null, 2))
```

output:

```sh
{
  "id": 1,
  "firstName": "Grim",
  "lastName": "Reaper",
  "greetings": {
    "morning": "Good morning!",
    "night": "Good night!"
  },
  "roles": [
    "user",
    "admin"
  ],
  "updatedAt": "2000-01-01T00:00:00.000Z"
}
```


### Shallow option
By default camelize will traverse to the bottom of the object/array structure you pass. If you want to perform a shallow camelize, touching only the top level of the value you can pass true for the `shallow` option (second argument).

### Type inference
You don't need to pass a type to `camelize` since it uses argument inference to find the type to convert. But if you need to, you can pass a type like this:

```ts
camelize<
  // type of value to camelize
  { first_name: string },

  // whether or not to perform shallow camelization
  true
>(
  // value to camelize, type must match the specified type
  value,

  // shallow, must match what's set as the second type argument above (after the type)
  true
)
```

#### Type conversion
If you need to convert just a type, you can use the `Camelize` generic type to do this:

```ts
import { Camelize } from 'camelize-ts'

type MySnakePerson = { first_name: string }
type MyCamelPerson = Camelize<MySnakePerson>
```

## Running tests
```sh
npm run test // one time/CI
npm run test:watch // on each file change
```

## Licence
MIT
