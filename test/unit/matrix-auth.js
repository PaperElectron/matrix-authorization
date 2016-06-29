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
  var f1 = a.createCheck(['upload.create'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({upload: ['*']}), 'Should return true on ok permission check')
})

tap.test('Checks supplied nested * permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createCheck(['resource.list.limit.20'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: [{list: [{limit: ['*']}]}]}), 'Should return true on ok permission check')
})

tap.test('Checks short circuit * permissions correctly', function(t) {
  t.plan(5)
  var f1 = a.createCheck(['resource.list.limit.20'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: ['*']}), 'resource.* should return true on ok permission check')
  t.ok(f1({resource: [{list: ['*']}]}), 'resource.list.* should return true on ok permission check')
  t.notOk(f1({event: [{create: ['*']}]}), 'event.create.* should return false')
  t.notOk(f1({event: ['*']}), 'event.* should return false')
})

tap.test('Checks supplied named permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createCheck(['resource.list.limit.20'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: [{list: [{limit: ['20']}]}]}), 'Should return true on ok permission check')
})

tap.test('Checks multiple named permissions correctly', function(t) {
  t.plan(2)
  var f1 = a.createCheck(['resource.create', 'upload.create'])
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: ['create'], upload: ['*'], event: '*'}), 'Should return true on ok permission check')
})

tap.test('createCheck accepts a comma separated list as arguments.', function(t) {
  t.plan(2)
  var f1 = a.createCheck('resource.create, upload.create')
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1({resource: ['create'], upload: ['*'], event: '*'}), 'Should return true on ok permission check')
})

tap.test('returned createCheck function accepts a comma separated list as arguments.', function(t) {
  t.plan(2)
  var f1 = a.createCheck('resource.create, upload.create')
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1('resource.create, upload.*, event.*'), 'Should return true on ok permission check')
})

tap.test('returned createCheck function accepts an array arguments.', function(t) {
  t.plan(2)
  var f1 = a.createCheck('resource.create, upload.create')
  t.type(f1, 'function', 'Should return a function')
  t.ok(f1(['resource.create', 'upload.*', 'event.*']), 'Should return true on ok permission check')
})

tap.test('returned createCheck function uses empty array when passed a number', function(t) {
  t.plan(2)
  var f1 = a.createCheck('resource.create, upload.create')
  t.type(f1, 'function', 'Should return a function')
  t.notOk(f1(6), 'Should return false on bad permission check')
})

tap.test('Throws when supplied permission is not in the available permission set', function(t){
  t.plan(1)
  var simple = {resource: ['create', 'read'], event: ['create', 'read']}
  var b = matrixAuth(simple)
  t.throws(function() {
    b.createCheck(['platform.create'])
  }, 'Throws when requested permission not in supplied permissions.')
})

tap.test('Throws when supplied permission is junk', function(t){
  t.plan(1)
  var simple = {resource: ['create', 'read'], event: ['create', 'read']}
  var b = matrixAuth(simple)
  t.throws(function() {
    b.createCheck('asdlaskkas;;la;kas;lkd;las;ldkas[podk-oiasdpojas')
  }, 'Throws when requested permission not in supplied permissions.')
})