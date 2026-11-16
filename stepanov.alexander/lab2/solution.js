function formatPhoneNumber(number) {
  const code = number.slice(0, 3);
  const first = number.slice(3, 6);
  const second = number.slice(6, 8);
  const third = number.slice(8, 10);

  return `+7 (${code}) ${first}-${second}-${third}`;
}

export {formatPhoneNumber};
