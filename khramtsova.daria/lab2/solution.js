export function toAbbreviation(text) {
  const separatedText = text.replace(/(\p{Ll})(?=\p{Lu})/gu, '$1 ');
  const words = separatedText.match(/\p{L}[\p{L}\p{M}]*/gu) ?? [];

  return words
    .map(([firstLetter]) => firstLetter)
    .join('')
    .toUpperCase();
}
