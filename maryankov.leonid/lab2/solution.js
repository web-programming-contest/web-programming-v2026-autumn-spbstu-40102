export function generateHexColor() {
  const randomInt = Math.floor(Math.random() * 0x1000000);
  return `#${randomInt.toString(16).padStart(6, '0').toUpperCase()}`;
}
