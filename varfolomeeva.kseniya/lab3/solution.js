export function findEquilibriumIndex(arr) {
  let total = 0;

  for (const value of arr) {
    total += value;
  }

  let leftSum = 0;

  for (let i = 0; i < arr.length; i++) {
    const rightSum = total - leftSum - arr[i];

    if (leftSum === rightSum) {
      return i;
    }

    leftSum += arr[i];
  }

  return -1;
}
