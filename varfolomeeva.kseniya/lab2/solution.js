function expandAroundCenter(str, left, right) {
  while (left >= 0 && right < str.length && str[left] === str[right]) {
    left--;
    right++;
  }

  return right - left - 1;
}

export function findLongestPalindrome(str) {
  if (str.length === 0) {
    return "";
  }

  let start = 0;
  let maxLength = 1;

  for (let i = 0; i < str.length; i++) {
    const oddLength = expandAroundCenter(str, i, i);
    const evenLength = expandAroundCenter(str, i, i + 1);
    const length = Math.max(oddLength, evenLength);

    if (length > maxLength) {
      maxLength = length;
      start = i - Math.floor((length - 1) / 2);
    }
  }

  return str.slice(start, start + maxLength);
}
