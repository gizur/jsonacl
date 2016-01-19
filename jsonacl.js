// Class for managing Access Control Lists
//
// inherit Acl and override the methods to implement new backends
//
// Data structure use:
// grants[object][verb][jonas] = true|false|undefined - false and undefined are both interpreted the same way
// example: { mytable: { get: { jonas: true } } }
//
// `verb` can be any string. The verb 'grant' on the `object` affected is necessary for `roles`
// doing grants
//

var fs = require('fs');

var debug = console.log.bind(console, 'DEBUG');

Acl = function (file) {
  if (!file) throw new Error('file is mandatory');

  this.grants = {};
  this.file = file;
};

Acl.prototype.init = function () {
  var self = this;
  
  return new Promise(function (fulfill, reject) {
    var data = '';
    var rr = fs.createReadStream(self.file);

    rr.on('error', (err) => {
      reject(err);
    });

    rr.on('readable', () => {
      var r = rr.read();
      if (r) data += r;
    });

    rr.on('end', () => {
      self.grants = JSON.parse(data);
      fulfill();
    });
  });
};

Acl.prototype.save = function () {
  var ws = fs.createWriteStream(this.file);
  ws.write(JSON.stringify(this.grants));
  ws.end();
};

Acl.prototype.createGrant_ = function (object, verb) {
  this.grants[object] = (this.grants[object]) ? this.grants[object] : {};
  this.grants[object][verb] = (this.grants[object][verb]) ? this.grants[object][verb] : {};
};

Acl.prototype.isAllowed = function (object, verb, role) {
  return this.grants[object] && this.grants[object][verb] && this.grants[object][verb][role];
};

// returns true if successful and false otherwise
Acl.prototype.grant = function (granter, object, verb, role) {

  // create the object if it does not exist and give grant access to the current role 
  if (!this.grants[object]) {
    this.createGrant_(object, 'grant');
    this.grants[object]['grant'][granter] = true
  }

  // check that the granter is allowed to perform grant
  if (!this.isAllowed(object, 'grant', granter)) return false;

  this.createGrant_(object, verb, role);
  this.grants[object][verb][role] = true;

  return true;
};

// returns true if successful and false otherwise
Acl.prototype.revoke = function (granter, object, verb, role) {

  // check that the granter is allowed to perform grant
  if (!this.isAllowed(object, 'grant', granter)) return false;

  this.createGrant_(object, verb, role);
  this.grants[object][verb][role] = false;
  
  return true;
};

module.exports = Acl;
