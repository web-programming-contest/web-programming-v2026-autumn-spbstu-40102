function palindromCenter(str, left, right) {
  while (left >= 0 && right < str.length && str[left] === str[right]) {
    left--;
    right++;
  }

  return right - left - 1;
}

function findLongestPalindrome(str) {
  let len = str.length;

  if (len === 0) {
    return '';
  }

  let start = 0;
  let max_len = 1;

  for (let i = 0; i < len; i++) {
    let odd = palindromCenter(str, i, i);
    let even = palindromCenter(str, i, i + 1);

    if (odd > max_len) {
      max_len = odd;
      start = i - (odd - 1) / 2;
    }
    if (even > max_len) {
      max_len = even;
      start = i - even / 2 + 1;
    }
  }

  return str.substring(start, start + max_len);
}

export {findLongestPalindrome};
