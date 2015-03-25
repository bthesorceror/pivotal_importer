var util         = require('util');
var EventEmitter = require('events').EventEmitter;
var request      = require('hyperquest');

var uriBase = 'api.github.com/repos/';

var requestOptions = {
  headers: {
    "User-Agent": "Pivotal Importer"
  }
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

GithubRequest.prototype.url = function() {
  return "https://" + this.token +
    ":x-oauth-basic@" + uriBase +
    this.owner + "/" + this.repo + "/issues";
};

GithubRequest.prototype.start = function() {
  var self = this;
  var req = request(self.url(), requestOptions);

  req.on('response', function(res) {
    var response = '';

    res.on('data', function(data) {
      response += data;
    });

    res.on('end', function() {
      try {
        var issues = JSON.parse(response);

        issues = issues.filter(function(issue) {
          if (!self.label) return true;

          var labels = issue.labels.map(function(label) {
            return label.name;
          });

          return (labels.indexOf(self.label) > -1);
        });

        self.emit('issues', issues);
      } catch (ex) {
        self.emit('error', 'Could not process request');
      }
    });
  });
};