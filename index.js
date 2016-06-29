/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project matrix_auth
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var util = require('util');

function leaf(parent){
  this.children = {}
  this.parent = parent
  return this
}

function b(){
  this.tree = {'*': {children:{}, parent: 'root'}}

}

//loop over a full permission to find its parent.
b.prototype.findPerm = function(perm){
  var splitPerm = perm.split('.');
  var bc
  var recur = function(base){
    var checkPerm = splitPerm.splice(0,1)[0]
    if(base.children[checkPerm] === undefined){
      console.log(bc);
      return bc
    }
    bc = base.children[checkPerm]
    if(bc) {
      recur(bc)
    }
  }
  return recur(this.tree['*'])

}

b.prototype.checkNode = function(parent, permissionList){
  var permission = permissionList.splice(0, 1)[0]
  var currentParent = this.tree[parent]
  
  var recurseCurrent = function(prnt, perm){
    
    currentParent.children[perm] = new leaf(prnt)
    currentParent  = currentParent.children[perm]
    var nextParent = perm
    var nextPermission = permissionList.splice(0,1)[0]
    if(nextPermission === undefined){
      return
    }
    recurseCurrent(nextParent, nextPermission)
  }
  
  if(currentParent.children) {
    recurseCurrent(parent, permission)

  } else {

  }

}
  

b.prototype.insert = function(permission) {
  var split = permission.split('.');
  if(split.length === 1 && split[0] === '*'){
    console.log('2039420394230948');
    return
  }
  this.checkNode('*', split)
}

b.prototype.search = function(){

}



var c = new b()

var permissions = [
  '*',
  'post.*',
  'post.create',
  'post.read',
  'post.update',
  'post.delete',
  'comment.*',
  'comment.create'
]
for(var i = 0; i < permissions.length; i++){
  c.insert(permissions[i])
}

//console.log(util.inspect(c.tree, false, null))

c.findPerm('*')