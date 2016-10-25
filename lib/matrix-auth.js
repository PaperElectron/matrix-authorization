/**
 * @file matrix-auth
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project matrix_auth
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash')

exports = module.exports = function(permissionSet) {
  exports.permissionSet = flattenPermSet(permissionSet)

  exports.testPerm = function(required, has) {
    var requiredArr = required.split('.')
    var hasArray = has.split('.')

    for (var i = 0; i < requiredArr.length; i++) {
      if(hasArray[i] !== requiredArr[i]) {
        return (hasArray[i] === '*')
      }
    }
    return true
  }

  exports.extractMethodPerms = function(permissionSet, requiredPermissions) {
    return _.map(requiredPermissions, function(permission) {
      var inList = _.some(permissionSet, function(setPerm) {
        return (setPerm === permission)
      })
      if(!inList) throw new Error('Permission ' + permission + ' not found')
      return permission
    })
  }

  exports.createCheck = function(required) {
    if(_.isString(required)) {
      required = _.map(required.split(','), function(node) {
        return _.trim(node)
      })
    }
    var specificPermset = exports.extractMethodPerms(exports.permissionSet, required)
    return function(userperms) {

      // Accept whatever for arguments, array, object, comma separated string.
      var flatUserPerms = _.isArray(userperms)
        ? userperms
        : _.isObject(userperms)
        ? flattenPermSet(userperms)
        : _.isString(userperms)
        ? _.map(userperms.split(','), function(node) { return _.trim(node) })
        : []

      return _.chain(specificPermset).map(function(perm) {
        return _.chain(flatUserPerms).map(function(p) {
          return exports.testPerm(perm, p);
        })
          .some()
          .value()
      }).reduce(function(a, b) {
        return (a && b)
      }).value()
    }
  }

  return exports
}

function flattenPermSet(permissionSet) {
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
  return _.chain(permissionSet).map(nodeIn).flattenDeep().filter(Boolean).value()
}
