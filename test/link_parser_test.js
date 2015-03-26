var test        = require('tap').test;
var linkParser = require('../lib/link_parser');

test('link parsing', function(t) {
  var fixture = '<https://api.github.com/repositories/123/issues?page=2>; rel="next", <https://api.github.com/repositories/345/issues?page=2>; rel="last"'

  t.test('returns correct links', function(t) {
    t.plan(2);
    var links = linkParser(fixture);

    t.equal(links.next, 'https://api.github.com/repositories/123/issues?page=2');
    t.equal(links.last, 'https://api.github.com/repositories/345/issues?page=2');
  });

});
