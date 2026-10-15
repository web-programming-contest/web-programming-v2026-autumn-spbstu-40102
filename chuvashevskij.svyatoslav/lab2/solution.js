// Экспортируйте отсюда функцию с именем из контракта вашего варианта.
export function analyzieString(str) {
  let letters = 0;
  let digits = 0;
  let spaces = 0;
  let other = 0;

  for (const char of str) {
    if (/\p{L}/u.test(char)) {
      letters++;
    } else if (/\p{N}/u.test(char)) {
      digits++;
    } else if (char === ' ') {
      spaces++;
    } else {
      other++;
    }
  }

  return {
    letters,
    digits,
    spaces,
    other,
  };
}
