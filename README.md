Access Control List Class
=========================

Simple implementation of ACL (Access Control Lists):

* Run the tests with: `node test.js`

Example:

```
var Acl = require('./acl.js');
var a = new Acl('acl.json');

a.grant('jonas', 'mytable', 'get', 'pelle');
a.isAllowed('mytable', 'get', 'pelle');       // true
a.isAllowed('mytable', 'get', 'sture');       // undefined (interpret as false)
a.revoke('jonas', 'mytable', 'get', 'pelle');
a.isAllowed('mytable', 'get', 'pelle');       // false
```


