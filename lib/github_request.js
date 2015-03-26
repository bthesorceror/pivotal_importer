var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var request      = require('hyperquest');
var qs           = require('querystring');
var linkParser   = require('./link_parser');

var uriBase = 'api.github.com/repos/';

function makeRequest(url, options, issues, cb) {
  var req = request(url, options);

  req.on('response', function(res) {
    var response = '';

    res.on('data', function(data) {
      response += data;
    });

    res.on('end', function() {
      try {
        var links = linkParser(res.headers.link);
        issues    = issues.concat(JSON.parse(response));

        if (links.next) {
          return makeRequest(links.next, options, issues, cb);
        }

        cb(null, issues);
      } catch (ex) {
        cb('Could not process request');
      }
    });
  });
}

module.exports = GithubRequest;

util.inherits(GithubRequest, EventEmitter);

function GithubRequest(token, owner, repo, options) {
  options = options || {};
  EventEmitter.call(this);
  this.token = token;
  this.owner = owner;
  this.repo  = repo;
  this.label = options.label;
}

GithubRequest.prototype.requestOptions = function() {
  return {
    headers: {
      "User-Agent": "Pivotal Importer"
    },
    auth: 'x-oauth-basic:' + this.token,
  }
}

GithubRequest.prototype.url = function() {
  var url = 'https://' + uriBase +
    this.owner + '/' + this.repo + '/issues';

  var params = qs.stringify({
    labels: this.label
  });

  return url + '?' + params;
};

GithubRequest.prototype.start = function() {
  var self   = this;

  makeRequest(self.url(), self.requestOptions(), [], function(err, issues) {
    if (err) {
      self.emit('error', err);
    } else {
      self.emit('issues', issues);
    }
  });
};
