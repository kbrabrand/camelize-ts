camelize-ts
===
[![CI](https://github.com/kbrabrand/camelize-ts/actions/workflows/main.yml/badge.svg)](https://github.com/kbrabrand/camelize-ts/actions/workflows/main.yml)

A typescript typed camelCase function that recursively camel cases a snake cased object structure. It camel cases a simple string too, if you need that.

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
const camelizedUser = camelize<{
  id: number;
  first_name: string;
  last_name: string;
  roles: string[];
}>({
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

## Running tests
```sh
npm run test // one time/CI
npm run test:watch // on each file change
```

## Licence
MIT
