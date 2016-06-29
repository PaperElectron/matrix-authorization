/**
 * Created by monstertke on 6/28/16.
 */

var tap = require('tap');
var matrixAuth = require('../../lib/matrix-auth');

var permissionset = {
  upload: [
    'create', 'delete', 'update', 'list'
  ],
  event: [
    'create', 'delete', 'update', 'list'
  ],
  resource: [
    'create', 'delete', 'update', {
      list: [
        'all',
        {limit: [10,20,30]}

      ]
    }
  ]
}
var a = matrixAuth(permissionset);


tap.test('Builds a flat permission set.', function(t) {
  t.plan(2)

  t.type(a.permissionSet, 'Array', 'It is an array')
  t.equal(a.permissionSet.length, 15, 'it contains 15 values')
})


tap.test('Checks supplied * permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createFilter(['upload.create'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({upload: ['*']}), 'Should return true on ok permission check')
})

tap.test('Checks supplied nested * permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createFilter(['resource.list.limit.20'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: [{list: [{limit: ['*']}]}]}), 'Should return true on ok permission check')
})

tap.test('Checks supplied named permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createFilter(['resource.list.limit.20'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: [{list: [{limit: ['20']}]}]}), 'Should return true on ok permission check')
})

tap.test('Checks multiple named permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createFilter(['resource.create', 'upload.create'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: ['create'], upload: ['*'], event: '*'}), 'Should return true on ok permission check')
})

tap.test('Error conditions', function(t){
  t.plan(1)
  var simple = {resource: ['create', 'read'], event: ['create', 'read']}
  var b = matrixAuth(simple)
  t.throws(function() {
    b.createFilter(['platform.create'])
  }, 'Throws when requested permission not in supplied permissions.')
})