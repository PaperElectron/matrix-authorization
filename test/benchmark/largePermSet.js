/**
 * @file largePermSet
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project matrix_auth
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var matrixAuth = require('../../lib/matrix-auth');
var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

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

var simple = a.createCheck(['upload.create'])

suite
  .add('Simple user perms', function() {
   simple({upload: ['*']})
  })
  .add('Complex user perms', function() {
    simple({upload: ['create', 'delete', 'update'], event: ['create'], resource: ['update']})
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true })