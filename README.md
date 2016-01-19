Access Control List Class
=========================

Simple implementation of ACL (Access Control Lists):

* Run the tests with: `node test.js`

API
---

`Acl(filename)`:

 * create an ACL object
 * `filename` is json file where the permissions can be saved

`Acl.grant(granter, object, verb, role)`:

 * `granter` - the `role` performing the `grant` operation. This role must have 'grant' permissions (`verb`) to be able to perform grant. 
 * `role` now has permission to perform `verb` operations on `object`
 * `object` is created with `grant` permission for `granter` if it does not exist
 * returns true if successful and false otherwise

`Acl.revoke(granter, object, verb, role)`:
 * `granter` - the `role` performing the `revoke` operation. This role must have 'grant' permissions (`verb`) to be able to perform revoke. 
 * `role` does not has permission to perform `verb` operations on `object` anymore (it is not necessary that `role` has `verb` permissions to perform `revoke`)
 * returns `true` if successful and `false` otherwise

`Acl.init`:

 * read saved permissions from the file specified in the constructor

`Acl.save`:

 * save the permissions to the file specified in the constructor


Example
-------

```
var Acl = require('./acl.js');
var a = new Acl('acl.json');

a.grant('jonas', 'mytable', 'get', 'pelle');
a.isAllowed('mytable', 'get', 'pelle');       // true
a.isAllowed('mytable', 'get', 'sture');       // undefined (interpret as false)
a.revoke('jonas', 'mytable', 'get', 'pelle');
a.isAllowed('mytable', 'get', 'pelle');       // false

a.save();                                     // save json to acl.json

var b = new Acl('acl.json');
b.init()                                      // b now contains the permissions
.then(function(){                             // init returns a promise (see promisejs.org for details)
  console.log(b.grants);
});
```


