// Максимальная сумма n подряд идущих элементов массива (скользящее окно).
export function findMaxSubarraySum(arr, n) {
  let windowSum = 0;
  for (let i = 0; i < n; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;
  for (let i = n; i < arr.length; i++) {
    // Сдвигаем окно: добавляем новый элемент и убираем самый старый.
    windowSum = windowSum + arr[i] - arr[i - n];
    if (windowSum > maxSum) {
      maxSum = windowSum;
    }
  }
  return maxSum;
}
