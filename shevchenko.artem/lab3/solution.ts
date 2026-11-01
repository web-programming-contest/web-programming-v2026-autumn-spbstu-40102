export function mergeArrays<T extends number | string>(
  arr1: T[],
  arr2: T[],
): T[] {
  const cmp = (x: T, y: T): number => (x < y ? -1 : x > y ? 1 : 0);
  const sortedArr1: T[] = arr1.slice().sort(cmp);
  const sortedArr2: T[] = arr2.slice().sort(cmp);
  const mergedArr: T[] = [];
  let i: number = 0;
  let j: number = 0;

  while (i < sortedArr1.length || j < sortedArr2.length) {
    let curr: T;

    if (
      j >= sortedArr2.length ||
      (i < sortedArr1.length && sortedArr1[i] < sortedArr2[j])
    ) {
      curr = sortedArr1[i];
      i++;
    } else {
      curr = sortedArr2[j];
      j++;
    }

    if (mergedArr.length === 0 || mergedArr.at(-1) !== curr) {
      mergedArr.push(curr);
    }
  }

  return mergedArr;
}
