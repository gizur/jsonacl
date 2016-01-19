Access Control List Class
=========================

Simple implementation of ACL (Access Control Lists):

* Run the tests with: `node test.js`

API
---

`Acl.grant(granter, object, verb, role)`:

 * `granter` - the `role` performing the `grant` operation. This role must have 'grant' permissions (`verb`) to be able to perform grant. 
 * `role` now has permission to perform `verb` operations on `object`
 * `object` is created with `grant` permission for `granter` if it does not exist
 * returns true if successful and false otherwise

Acl.revoke(granter, object, verb, role):
 * `granter` - the `role` performing the `revoke` operation. This role must have 'grant' permissions (`verb`) to be able to perform revoke. 
 * `role` - now does not has permission to perform `verb` operations on `object` (it is not necessary thar `role` has `verb` permissions to perform `revoke`)
 * returns true if successful and false otherwise


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
```


