export function convertBase(num, fromBase, toBase) {
  const decimalNumber = Number.parseInt(num, fromBase);
  return decimalNumber.toString(toBase);
}
