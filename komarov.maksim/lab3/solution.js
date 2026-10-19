export function rotateArray(arr, steps) {
  const length = arr.length;

  if (length === 0) {
    return [];
  }

  const shift = ((steps % length) + length) % length;
  const result = [];

  for (let i = 0; i < length; i++) {
    const newIndex = (i + shift) % length;
    result[newIndex] = arr[i];
  }

  return result;
}
