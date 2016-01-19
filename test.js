var assert = require('assert');
var Acl = require('./jsonacl.js');

var log = console.log.bind(console);

log('No assertion errors means that the tests did not find any errors!');

var a = new Acl('acl.json');

assert(a.grant('jonas', 'mytable', 'get', 'pelle'), 'performing grant');
assert(a.isAllowed('mytable', 'get', 'pelle'), 'check grant');
assert(!a.isAllowed('mytable', 'get', 'kalle'), 'check role without grant');

assert(a.grant('jonas', 'mytable', 'put', 'pelle'), 'perform grant that should succeed');
assert(a.isAllowed('mytable', 'put', 'pelle'), 'check grant');
assert(!a.isAllowed('mytable', 'get', 'kalle'), 'check role without grant');

assert(!a.grant('pelle', 'mytable', 'put', 'kalle'), 'perform grant that not should succeed');
assert(!a.isAllowed('mytable', 'get', 'kalle'), 'check that grant not is possible unless the user has grant privs');

assert(a.grant('jonas', 'mytable', 'put', 'sture'), 'perform grant that should succeed');
assert(a.isAllowed('mytable', 'put', 'sture'), 'check grant');
assert(a.revoke('jonas', 'mytable', 'put', 'sture'), 'perform revoke that should succeed');
assert(!a.isAllowed('mytable', 'get', 'sture'), 'check that revoke worked');


// save the grants
a.save();

// read the saved file and check again
var b = new Acl('acl.json');
b.init().then(function () {
  assert(b.isAllowed('mytable', 'get', 'pelle'), 'check grant');
  assert(!b.isAllowed('mytable', 'get', 'kalle'), 'check role without grant');
  assert(b.isAllowed('mytable', 'put', 'pelle'), 'check grant');
  assert(!b.isAllowed('mytable', 'get', 'kalle'), 'check role without grant');
})
.then(function(){
  var c = new Acl('acl2.json');
  return c.init();
})
.catch(function(err){
  log('Should have a no such file or directory error below');
  log(err);
})
