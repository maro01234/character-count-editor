'use strict';
function measureText(text) {
  let count = 0, compact = 0;
  for (const character of text) {
    count++;
    if (!/\s/u.test(character)) compact++;
  }
  return { count, compact, lines: text ? text.split('\n').length : 0 };
}
if (typeof module !== 'undefined') module.exports = { measureText };
