# Matrix authorization

Node based permission checks in Node.

[![Build Status](https://travis-ci.org/PaperElectron/matrix-authorization.svg?branch=master)](https://travis-ci.org/PaperElectron/matrix-authorization)
[![Coverage Status](https://coveralls.io/repos/github/PaperElectron/matrix-authorization/badge.svg?branch=master)](https://coveralls.io/github/PaperElectron/matrix-authorization?branch=master)

### API
```javascript
/*
 * Create some permissions to check against.
 */

var permissions = {
  user: ['create', 'read', 'update', 'delete'],
  post: ['create', 'read', 'update', 'delete'],
  tag: [{list: [{limit: [10, 20, 30, 40, 50]}]}]
}

/*
 * Instantiate the module, passing in your permissions object.
 */
var matrix = require('matrix-auth')(permissions)

/*
 * Create a function to call with the values you want to check.
 * Pass in an array of the required nodes.
 */

var checkFn1 = matrix.createCheck(['user.create', 'tag.list.limit.50'])

/*
 * Call the created function with the values you want to check.
 */

// matches everything downstream of the *
checkFn1({user: ['*'], tag: [{list: ['*']}]}) // true

// matches everything downstream of the *
checkFn1({user: ['*'], tag: ['*']}) // true

//missing tag node.
checkFn1({user: ['*']}) // false

```


### Todo

- More robust argument handling. Accept comma delimited strings, in addition to arrays.
- Accept an array of pure node values into the function returned by createCheck
- fuzzy matching where possible, ie node.50 matches node.[0-50]