const { test } = require('node:test');
const assert = require('node:assert/strict');
const { measureText } = require('../public/counter.js');
test('元のJavaと同じUnicodeコードポイント単位', () => {
  for (const [text, count] of [['',0], ['こんにちは',5], ['A😀𠮷',3], ['👨‍👩‍👧‍👦',7], ['e\u0301',2], ['a\nb',3]]) {
    assert.equal(measureText(text).count, count);
  }
});
test('空白、全角空白、タブ、改行と末尾空行', () => {
  assert.deepEqual(measureText('あ \t　\n😀\n'), { count: 7, compact: 2, lines: 3 });
  assert.deepEqual(measureText(''), { count: 0, compact: 0, lines: 0 });
});
