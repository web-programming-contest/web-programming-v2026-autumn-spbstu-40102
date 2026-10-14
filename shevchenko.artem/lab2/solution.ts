export function convertBase(
  num: string,
  fromBase: number,
  toBase: number,
): string {
  let isNegative: boolean = false;
  if (num.startsWith('-')) {
    num = num.slice(1);
    isNegative = true;
  }

  let baseTen: number = 0;
  for (let index: number = 0; index < num.length; index++) {
    const char: string = num[index]!.toUpperCase();
    const charCode: number = char.charCodeAt(0);
    let digit: number;

    if (charCode >= 48 && charCode <= 57) {
      digit = charCode - 48;
    } else if (charCode >= 65 && charCode <= 90) {
      digit = charCode - 55;
    } else {
      continue;
    }

    baseTen += digit * fromBase ** (num.length - 1 - index);
  }

  if (baseTen === 0) {
    return '0';
  }

  const convertedDigits: string[] = [];
  while (baseTen > 0) {
    const mod: number = baseTen % toBase;
    convertedDigits.push(
      mod < 10 ? mod.toString() : String.fromCharCode(55 + mod),
    );
    baseTen = Math.floor(baseTen / toBase);
  }

  const result: string = convertedDigits.reverse().join('');
  return isNegative ? `-${result}` : result;
}
