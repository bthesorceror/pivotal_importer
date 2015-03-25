var async          = require('async');
var github         = require(process.env['HOME'] + '/github.json');
var pivotal        = require(process.env['HOME'] + '/pivotal.json');
var GithubRequest  = require('./lib/github_request');
var PivotalManager = require('./lib/pivotal_manager');
var args           = require('minimist')(process.argv.slice(2));

if (!args.repo) {
  console.error("Must provide --repo <repo_name>");
  process.exit(1);
}

if (!args.owner) {
  console.error("Must provide --owner <owner>");
  process.exit(1);
}

if (!args.pivotalid) {
  console.error("Must provide --pivotalid <project_id>");
  process.exit(1);
}

var request = new GithubRequest(github.token, args.owner, args.repo, {
  label: args.label
});

var manager = new PivotalManager(pivotal.token, args.pivotalid);

request.on('issues', function(issues) {
  async.eachSeries(issues, function(issue, done) {
    manager.post(issue, function(status, body) {
      if (status == 200) {
        console.log('Created: ' + issue.title);
      } else {
        console.error('Failed to create: ' + issue.title);
      }
      done();
    });
  });
});

request.on('error', function(err) {
  console.error(err);
});

request.start();
