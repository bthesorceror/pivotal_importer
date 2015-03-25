var request    = require('hyperquest');

module.exports = PivotalManager;

function translate(issue) {
  return {
    name: issue.title,
    description: issue.body,
    labels: issue.labels,
    estimate: 2.0,
    comments: [
      {
        text: issue.html_url
      }
    ]
  }
}

function PivotalManager(token, id) {
  this.token = token;
  this.id    = id;
}

PivotalManager.prototype.url = function() {
  return 'https://www.pivotaltracker.com/services/v5/projects/' + this.id + '/stories'
};

PivotalManager.prototype.options = function() {
  return {
    headers: {
      'X-TrackerToken': this.token,
      'Content-Type': 'application/json'
    }
  }
}

PivotalManager.prototype.post = function(issue, cb) {
  issue = translate(issue);

  req = request.post(this.url(), this.options());

  req.on('response', function(res) {
    var response = '';

    res.on('data', function(data) {
      response += data;
    });

    res.on('end', function() {
      cb(res.statusCode, response);
    });
  });

  var body = JSON.stringify(issue);

  req.write(body);
  req.end();
};
