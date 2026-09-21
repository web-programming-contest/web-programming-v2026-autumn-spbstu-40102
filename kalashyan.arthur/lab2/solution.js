export function toBinary(num) {
  if (!Number.isSafeInteger(num) || num < 0) {
    throw new RangeError('Ожидается безопасное целое неотрицательное число.');
  }

  if (num === 0) {
    return '0';
  }

  let value = num;
  let result = '';

  while (value > 0) {
    result = `${value % 2}${result}`;
    value = Math.floor(value / 2);
  }

  return result;
}
