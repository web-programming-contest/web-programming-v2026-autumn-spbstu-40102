export function generatePrimes(n) {
  const primes = [];
  if (n < 2) {
    return primes;
  }

  // isPrime[k] хранит true, пока число k не вычеркнуто.
  const isPrime = [];
  for (let i = 0; i <= n; i++) {
    isPrime.push(true);
  }

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) {
      primes.push(i);
    }
  }
  return primes;
}
