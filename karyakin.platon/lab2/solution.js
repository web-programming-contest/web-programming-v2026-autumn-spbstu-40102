export function findLongestPalindrome(str) {
  if (str.length < 2) {
    return str;
  }

  let start = 0;
  let maxLength = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < str.length && str[left] === str[right]) {
      left--;
      right++;
    }
    const currentLength = right - left - 1;
    if (currentLength > maxLength) {
      maxLength = currentLength;
      start = left + 1;
    }
  }

  for (let i = 0; i < str.length; i++) {
    expandAroundCenter(i, i);
    expandAroundCenter(i, i + 1);
  }

  return str.substring(start, start + maxLength);
}
