export function maxSlidingWindow(arr, k) {
  if (!Number.isInteger(k) || k < 1 || k > arr.length) {
    throw new RangeError('Длина окна должна быть от 1 до длины массива');
  }

  const maxima = [];
  const deque = [];
  let head = 0;

  for (let index = 0; index < arr.length; index += 1) {
    if (head < deque.length && deque[head] <= index - k) {
      head += 1;
    }

    while (deque.length > head && arr[deque.at(-1)] <= arr[index]) {
      deque.pop();
    }

    deque.push(index);

    if (index >= k - 1) {
      maxima.push(arr[deque[head]]);
    }

    if (head >= k) {
      deque.splice(0, head);
      head = 0;
    }
  }

  return maxima;
}
