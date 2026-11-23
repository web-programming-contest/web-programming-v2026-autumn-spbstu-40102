export function sortByFrequency(arr) {
  const frequency = {};

  for (const item of arr) {
    frequency[item] = (frequency[item] || 0) + 1;
  }

  return [...arr].sort((a, b) => frequency[b] - frequency[a]);
}
