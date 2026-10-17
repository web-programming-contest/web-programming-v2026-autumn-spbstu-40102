function palindromCenter(str, left, right) {
  while (left >= 0 && right < str.length && str[left] === str[right]) {
    left--;
    right++;
  }

  return right - left - 1;
}

function findLongestPalindrome(str) {
  const len = str.length;

  if (len === 0) {
    return '';
  }

  let start = 0;
  let maxLen = 1;

  for (let i = 0; i < len; i++) {
    const odd = palindromCenter(str, i, i);
    const even = palindromCenter(str, i, i + 1);

    if (odd > maxLen) {
      maxLen = odd;
      start = i - (odd - 1) / 2;
    }
    if (even > maxLen) {
      maxLen = even;
      start = i - even / 2 + 1;
    }
  }

  return str.substring(start, start + maxLen);
}

export {findLongestPalindrome};
