/**
 * @file matrix-auth
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project matrix_auth
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash')

exports = module.exports = function(permissionSet){
  exports.permissionSet = flattenPermSet(permissionSet)


  exports.testPerm = function(required, has){
    var requiredArr = _.isArray(required) ? required : required.split('.')
    var hasArray = _.isArray(has) ? has : has.split('.')

    for(var i = 0; i < hasArray.length; i++){
      console.log(hasArray[i] === requiredArr[i]);
    }
    
    
    var requiredValue = requiredArr.shift()
    var hasValue = hasArray.shift()

    // console.log(requiredValue,hasValue, (requiredValue === hasValue));
    if(requiredValue === hasValue) {
      if(requiredArr.length && hasArray.length){
        return exports.testPerm(requiredArr, hasArray)
      }
      return true
    } else {
      return (hasValue === '*')
    }
  }

  exports.extractMethodPerms = function(permissionSet, requiredPermissions){
    return _.map(requiredPermissions, function(permission){
      var inList = _.some(permissionSet, function(setPerm){return (setPerm === permission)})
      if(!inList) throw new Error('Permission ' + permission + ' not found')
      return permission
    })
  }

  exports.createFilter = function(required) {
    var specificPermset = exports.extractMethodPerms(exports.permissionSet, required)
    return function(userperms) {
      var flatUserPerms = flattenPermSet(userperms)
      return _.chain(specificPermset).map(function(perm){
        return _.chain(flatUserPerms).map(function(p) {
            return exports.testPerm(perm, p);
          })
          .some()
          .value()
      }).reduce(function(a,b){
        return (a && b)
      }).value()
    }
  }

  return exports
}

function flattenPermSet(globalPermissionSet) {
  var nodeIn = function(node, key) {
    if(_.isArray(node)) {
      return _.map(node, function(n, k) {
        if(_.isObject(n)) {
          return _.map(n, function(nn, kk) {
            return nodeIn(nn, key + '.' + kk)
          })
        }
        return key + '.' + n
      })
    }
    return false
  }
  return _.chain(globalPermissionSet).map(nodeIn).flattenDeep().filter(Boolean).value()
}
