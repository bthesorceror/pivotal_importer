module.exports = function(linkString) {
  var links = {};

  var parts = linkString.split(',');

  parts.forEach(function(part) {
    part = part.trim();

    var sections = part.split(';').map(function(s) {
      return s.trim()
    });

    var rel = /rel=\"(.+)\"/.exec(sections[1])[1];
    var url = /\<(.+)\>/.exec(sections[0])[1];

    links[rel] = url;
  });

  return links;
}
