export function findMostFrequent(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }

  const counts = {};
  let maxCount = 0;
  let mostFrequentItem = null;

  for (const item of arr) {
    const key = String(item);
    counts[key] = (counts[key] || 0) + 1;

    if (counts[key] > maxCount) {
      maxCount = counts[key];
      mostFrequentItem = item;
    }
  }

  return mostFrequentItem;
}
