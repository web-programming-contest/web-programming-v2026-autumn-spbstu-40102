export function findMissingNumber(arr) {
  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;

  let actualSum = 0;
  for (let i = 0; i < arr.length; i += 1) {
    actualSum += arr[i];
  }

  return expectedSum - actualSum;
}
