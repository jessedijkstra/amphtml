/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  addParamToUrl,
  addParamsToUrl,
  assertAbsoluteHttpOrHttpsUrl,
  assertHttpsUrl,
  getOrigin,
  getSourceOrigin,
  getSourceUrl,
  isProxyOrigin,
  parseQueryString,
  parseUrl,
  removeFragment,
  resolveRelativeUrl,
  resolveRelativeUrlFallback_,
} from '../../src/url';

describe('url', () => {

  const currentPort = location.port;

  function compareParse(url, result) {
    // Using JSON string comparison because Chai's deeply equal
    // errors are impossible to debug.
    const parsed = JSON.stringify(parseUrl(url));
    const expected = JSON.stringify(result);
    expect(parsed).to.equal(expected);
  }

  it('should parse correctly', () => {
    compareParse('https://foo.com/abc?123#foo', {
      href: 'https://foo.com/abc?123#foo',
      protocol: 'https:',
      host: 'foo.com',
      hostname: 'foo.com',
      port: '',
      pathname: '/abc',
      search: '?123',
      hash: '#foo',
      origin: 'https://foo.com',
    });
  });
  it('caches results', () => {
    const url = 'https://foo.com:123/abc?123#foo';
    parseUrl(url);
    const a1 = parseUrl(url);
    const a2 = parseUrl(url);
    expect(a1).to.equal(a2);
  });
  it('should handle ports', () => {
    compareParse('https://foo.com:123/abc?123#foo', {
      href: 'https://foo.com:123/abc?123#foo',
      protocol: 'https:',
      host: 'foo.com:123',
      hostname: 'foo.com',
      port: '123',
      pathname: '/abc',
      search: '?123',
      hash: '#foo',
      origin: 'https://foo.com:123',
    });
  });
  it('should support http', () => {
    compareParse('http://foo.com:123/abc?123#foo', {
      href: 'http://foo.com:123/abc?123#foo',
      protocol: 'http:',
      host: 'foo.com:123',
      hostname: 'foo.com',
      port: '123',
      pathname: '/abc',
      search: '?123',
      hash: '#foo',
      origin: 'http://foo.com:123',
    });
  });
  it('should resolve relative urls', () => {
    compareParse('./abc?123#foo', {
      href: 'http://localhost:' + currentPort + '/abc?123#foo',
      protocol: 'http:',
      host: 'localhost:' + currentPort,
      hostname: 'localhost',
      port: currentPort,
      pathname: '/abc',
      search: '?123',
      hash: '#foo',
      origin: 'http://localhost:' + currentPort,
    });
  });
  it('should resolve path relative urls', () => {
    compareParse('/abc?123#foo', {
      href: 'http://localhost:' + currentPort + '/abc?123#foo',
      protocol: 'http:',
      host: 'localhost:' + currentPort,
      hostname: 'localhost',
      port: currentPort,
      pathname: '/abc',
      search: '?123',
      hash: '#foo',
      origin: 'http://localhost:' + currentPort,
    });
  });
  it('should handle URLs with just the domain', () => {
    compareParse('http://foo.com:123', {
      href: 'http://foo.com:123/',
      protocol: 'http:',
      host: 'foo.com:123',
      hostname: 'foo.com',
      port: '123',
      pathname: '/',
      search: '',
      hash: '',
      origin: 'http://foo.com:123',
    });
  });

});


describe('parseQueryString', () => {
  it('should return empty params when query string is empty or null', () => {
    expect(parseQueryString(null)).to.deep.equal({});
    expect(parseQueryString('')).to.deep.equal({});
  });
  it('should parse single key-value', () => {
    expect(parseQueryString('a=1')).to.deep.equal({
      'a': '1',
    });
  });
  it('should parse two key-values', () => {
    expect(parseQueryString('a=1&b=2')).to.deep.equal({
      'a': '1',
      'b': '2',
    });
  });
  it('should ignore leading ?', () => {
    expect(parseQueryString('?a=1&b=2')).to.deep.equal({
      'a': '1',
      'b': '2',
    });
  });
  it('should ignore leading #', () => {
    expect(parseQueryString('#a=1&b=2')).to.deep.equal({
      'a': '1',
      'b': '2',
    });
  });
  it('should parse empty value', () => {
    expect(parseQueryString('a=&b=2')).to.deep.equal({
      'a': '',
      'b': '2',
    });
    expect(parseQueryString('a&b=2')).to.deep.equal({
      'a': '',
      'b': '2',
    });
  });
  it('should decode names and values', () => {
    expect(parseQueryString('a%26=1%26&b=2')).to.deep.equal({
      'a&': '1&',
      'b': '2',
    });
  });
  it('should return last dupe', () => {
    expect(parseQueryString('a=1&b=2&a=3')).to.deep.equal({
      'a': '3',
      'b': '2',
    });
  });
});

describe('assertHttpsUrl', () => {
  const referenceElement = document.createElement('div');
  it('should NOT allow null or undefined, but allow empty string', () => {
    expect(() => {
      assertHttpsUrl(null, referenceElement);
    }).to.throw(/source must be available/);
    expect(() => {
      assertHttpsUrl(undefined, referenceElement);
    }).to.throw(/source must be available/);
    assertHttpsUrl('', referenceElement);
  });
  it('should allow https', () => {
    assertHttpsUrl('https://twitter.com', referenceElement);
  });
  it('should allow protocol relative', () => {
    assertHttpsUrl('//twitter.com', referenceElement);
  });
  it('should allow localhost with http', () => {
    assertHttpsUrl('http://localhost:8000/sfasd', referenceElement);
  });
  it('should allow localhost with http suffix', () => {
    assertHttpsUrl('http://iframe.localhost:8000/sfasd', referenceElement);
  });

  it('should fail on http', () => {
    expect(() => {
      assertHttpsUrl('http://twitter.com', referenceElement);
    }).to.throw(/source must start with/);
  });
  it('should fail on http with localhost in the name', () => {
    expect(() => {
      assertHttpsUrl('http://foolocalhost', referenceElement);
    }).to.throw(/source must start with/);
  });
});

describe('assertAbsoluteHttpOrHttpsUrl', () => {
  it('should allow http', () => {
    expect(assertAbsoluteHttpOrHttpsUrl('http://twitter.com/'))
        .to.equal('http://twitter.com/');
    expect(assertAbsoluteHttpOrHttpsUrl('HTTP://twitter.com/'))
        .to.equal('http://twitter.com/');
  });
  it('should allow https', () => {
    expect(assertAbsoluteHttpOrHttpsUrl('https://twitter.com/'))
        .to.equal('https://twitter.com/');
    expect(assertAbsoluteHttpOrHttpsUrl('HTTPS://twitter.com/'))
        .to.equal('https://twitter.com/');
  });
  it('should fail on relative protocol', () => {
    expect(() => {
      assertAbsoluteHttpOrHttpsUrl('//twitter.com/');
    }).to.throw(/URL must start with/);
  });
  it('should fail on relative url', () => {
    expect(() => {
      assertAbsoluteHttpOrHttpsUrl('/path');
    }).to.throw(/URL must start with/);
  });
  it('should fail on not allowed protocol', () => {
    expect(() => {
      assertAbsoluteHttpOrHttpsUrl(
          /*eslint no-script-url: 0*/ 'javascript:alert');
    }).to.throw(/URL must start with/);
  });
});

describe('removeFragment', () => {
  it('should remove fragment', () => {
    expect(removeFragment('https://twitter.com/path#abc')).to.equal(
        'https://twitter.com/path');
  });
  it('should remove empty fragment', () => {
    expect(removeFragment('https://twitter.com/path#')).to.equal(
        'https://twitter.com/path');
  });
  it('should ignore when no fragment', () => {
    expect(removeFragment('https://twitter.com/path')).to.equal(
        'https://twitter.com/path');
  });
});

describe('getOrigin', () => {
  it('should parse https://twitter.com/path#abc', () => {
    expect(getOrigin(parseUrl('https://twitter.com/path#abc')))
        .to.equal('https://twitter.com');
    expect(parseUrl('https://twitter.com/path#abc').origin)
        .to.equal('https://twitter.com');
  });

  it('should parse data:12345', () => {
    expect(getOrigin(parseUrl('data:12345')))
        .to.equal('data:12345');
    expect(parseUrl('data:12345').origin)
        .to.equal('data:12345');
  });
});

describe('addParamToUrl', () => {
  let url;

  beforeEach(() => {
    url = 'https://www.ampproject.org/get/here#hash-value';
  });

  it('should preserve hash value', () => {
    url = addParamToUrl(url, 'elementId', 'n1');
    expect(url).to.equal('https://www.ampproject.org/get/here?elementId=n1#hash-value');

    url = addParamToUrl(url, 'ampUserId', '12345');
    expect(url).to.equal('https://www.ampproject.org/get/here?elementId=n1&ampUserId=12345#hash-value');
  });

  it('should preserve query values', () => {
    url = 'https://www.ampproject.org/get/here?hello=world&foo=bar';

    url = addParamToUrl(url, 'elementId', 'n1');
    expect(url).to.equal('https://www.ampproject.org/get/here?hello=world&foo=bar&elementId=n1');
    url = addParamToUrl(url, 'ampUserId', '12345');
    expect(url).to.equal('https://www.ampproject.org/get/here?hello=world&foo=bar&elementId=n1&ampUserId=12345');
  });

  it('should encode uri values', () => {
    url = addParamToUrl(url, 'foo', 'b ar');
    expect(url).to.equal('https://www.ampproject.org/get/here?foo=b%20ar#hash-value');
  });

  it('should keep host and path intact', () => {
    url = addParamToUrl('https://${host}/${path}', 'foo', 'bar');
    expect(url).to.equal('https://${host}/${path}?foo=bar');
  });
});

describe('addParamsToUrl', () => {
  let url;
  const params = {
    hello: 'world',
    foo: 'bar',
  };

  beforeEach(() => {
    url = 'https://www.ampproject.org/get/here#hash-value';
  });

  it('should loop over the keys and values correctly', () => {
    url = addParamsToUrl(url, params);

    expect(url).to.equal('https://www.ampproject.org/get/here?hello=world&foo=bar#hash-value');
  });

  it('should keep host and path intact', () => {
    url = addParamsToUrl('https://${host}/${path}#hash-value', params);

    expect(url).to.equal('https://${host}/${path}?hello=world&foo=bar#hash-value');
  });
});

describe('isProxyOrigin', () => {

  function testProxyOrigin(href, bool) {
    it('should return whether it is a proxy origin origin for ' + href, () => {
      expect(isProxyOrigin(parseUrl(href))).to.equal(bool);
    });
  }

  testProxyOrigin(
      'https://cdn.ampproject.org/v/www.origin.com/foo/?f=0', true);
  testProxyOrigin(
      'http://localhost:123', false);
  testProxyOrigin(
      'http://localhost:123/c', true);
  testProxyOrigin(
      'http://localhost:123/v', true);
  testProxyOrigin(
      'https://cdn.ampproject.net/v/www.origin.com/foo/?f=0', false);
  testProxyOrigin(
      'https://medium.com/swlh/nobody-wants-your-app-6af1f7f69cb7', false);
  testProxyOrigin(
      'http://www.spiegel.de/politik/deutschland/angela-merkel-a-1062761.html',
      false);
});

describe('getSourceOrigin/Url', () => {

  function testOrigin(href, sourceHref) {
    it('should return the source origin/url from ' + href, () => {
      expect(getSourceUrl(href)).to.equal(sourceHref);
      expect(getSourceOrigin(href)).to.equal(getOrigin(sourceHref));
    });
  }

  // CDN.
  testOrigin(
      'https://cdn.ampproject.org/v/www.origin.com/foo/?f=0#h',
      'http://www.origin.com/foo/?f=0#h');
  testOrigin(
      'https://cdn.ampproject.org/v/s/www.origin.com/foo/?f=0#h',
      'https://www.origin.com/foo/?f=0#h');
  testOrigin(
      'https://cdn.ampproject.org/c/www.origin.com/foo/?f=0',
      'http://www.origin.com/foo/?f=0');
  testOrigin(
      'https://cdn.ampproject.org/c/s/www.origin.com/foo/?f=0',
      'https://www.origin.com/foo/?f=0');
  testOrigin(
      'https://cdn.ampproject.org/c/s/origin.com/foo/?f=0',
      'https://origin.com/foo/?f=0');
  testOrigin(
      'https://cdn.ampproject.org/c/s/origin.com%3A81/foo/?f=0',
      'https://origin.com:81/foo/?f=0');

  // Removes amp-related paramters.
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?amp_js_param=5',
      'http://o.com/foo/');
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?f=0&amp_js_v=5#something',
      'http://o.com/foo/?f=0#something');
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?amp_js_v=5&f=0#bar',
      'http://o.com/foo/?f=0#bar');
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?f=0&amp_js_param=5&d=5#baz',
      'http://o.com/foo/?f=0&d=5#baz');
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?f_amp_js_param=5&d=5',
      'http://o.com/foo/?f_amp_js_param=5&d=5');
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/?amp_js_param=5?d=5',
      'http://o.com/foo/');  // Treats amp_js_param=5?d=5 as one param.
  testOrigin(
      'https://cdn.ampproject.org/c/o.com/foo/&amp_js_param=5&d=5',
      'http://o.com/foo/&amp_js_param=5&d=5');  // Treats &... as part of path.

  // Non-CDN.
  testOrigin(
      'https://origin.com/foo/?f=0',
      'https://origin.com/foo/?f=0');

  it('should fail on invalid source origin', () => {
    expect(() => {
      getSourceOrigin(parseUrl('https://cdn.ampproject.org/v/yyy/'));
    }).to.throw(/Expected a \. in origin http:\/\/yyy/);
  });
});

describe('resolveRelativeUrl', () => {

  function testRelUrl(href, baseHref, resolvedHref) {
    it('should return the resolved rel url from ' + href +
          ' with base ' + baseHref, () => {
      expect(resolveRelativeUrl(href, baseHref))
          .to.equal(resolvedHref, 'native or fallback');
      expect(resolveRelativeUrlFallback_(href, baseHref))
          .to.equal(resolvedHref, 'fallback');
    });
  }

  // Absolute URL.
  testRelUrl(
      'https://acme.org/path/file?f=0#h',
      'https://base.org/bpath/bfile?bf=0#bh',
      'https://acme.org/path/file?f=0#h');
  testRelUrl(
      'data:12345',
      'https://base.org/bpath/bfile?bf=0#bh',
      'data:12345');

  // Protocol-relative URL.
  testRelUrl(
      '//acme.org/path/file?f=0#h',
      'https://base.org/bpath/bfile?bf=0#bh',
      'https://acme.org/path/file?f=0#h');
  testRelUrl(
      '//acme.org/path/file?f=0#h',
      'http://base.org/bpath/bfile?bf=0#bh',
      'http://acme.org/path/file?f=0#h');
  testRelUrl(
      '\\\\acme.org/path/file?f=0#h',
      'http://base.org/bpath/bfile?bf=0#bh',
      'http://acme.org/path/file?f=0#h');

  // Absolute path.
  testRelUrl(
      '/path/file?f=0#h',
      'https://base.org/bpath/bfile?bf=0#bh',
      'https://base.org/path/file?f=0#h');
  testRelUrl(
      '/path/file?f=0#h',
      'http://base.org/bpath/bfile?bf=0#bh',
      'http://base.org/path/file?f=0#h');
  testRelUrl(
      '\\path/file?f=0#h',
      'http://base.org/bpath/bfile?bf=0#bh',
      'http://base.org/path/file?f=0#h');

  // Relative path.
  testRelUrl(
      'file?f=0#h',
      'https://base.org/bpath/bfile?bf=0#bh',
      'https://base.org/bpath/file?f=0#h');
  testRelUrl(
      'file?f=0#h',
      'http://base.org/bpath/bfile?bf=0#bh',
      'http://base.org/bpath/file?f=0#h');

  testRelUrl(
      'file?f=0#h',
      'https://base.org/bfile?bf=0#bh',
      'https://base.org/file?f=0#h');
  testRelUrl(
      'file?f=0#h',
      'http://base.org/bfile?bf=0#bh',
      'http://base.org/file?f=0#h');

  // Accepts parsed URLs.
  testRelUrl(
      'file?f=0#h',
      parseUrl('http://base.org/bfile?bf=0#bh'),
      'http://base.org/file?f=0#h');
});
