export function chunkArray(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Ожидается массив.');
  }

  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('Размер должен быть положительным целым числом.');
  }

  const chunks = [];

  for (let index = 0; index < arr.length; index += size) {
    chunks.push(arr.slice(index, index + size));
  }

  return chunks;
}
