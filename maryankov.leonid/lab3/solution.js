export function findLongestIncreasingSubsequence(arr) {
  const lengths = [];
  let max = 0;

  for (let i = 0; i < arr.length; i++) {
    lengths[i] = 1;

    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i] && lengths[j] + 1 > lengths[i]) {
        lengths[i] = lengths[j] + 1;
      }
    }

    if (lengths[i] > max) {
      max = lengths[i];
    }
  }

  return max;
}
