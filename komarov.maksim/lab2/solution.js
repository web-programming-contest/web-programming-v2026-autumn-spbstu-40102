export function toRoman(num) {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new RangeError('Expected an integer from 1 to 3999');
  }

  const numbers = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const letters = [
    'M',
    'CM',
    'D',
    'CD',
    'C',
    'XC',
    'L',
    'XL',
    'X',
    'IX',
    'V',
    'IV',
    'I',
  ];

  let result = '';

  for (let i = 0; i < numbers.length; i++) {
    while (num >= numbers[i]) {
      result += letters[i];
      num -= numbers[i];
    }
  }

  return result;
}
