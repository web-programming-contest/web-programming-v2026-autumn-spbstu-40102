/** Путешествие одного человека. Страны хранятся без повторов. */
export class Travel {
  constructor(id, travelerName, visitedCountries = []) {
    if (typeof id !== 'number' || !Number.isFinite(id)) {
      throw new TypeError('ID должен быть конечным числом.');
    }
    if (typeof travelerName !== 'string' || !travelerName.trim()) {
      throw new TypeError('Укажите имя путешественника.');
    }
    if (!Array.isArray(visitedCountries)) {
      throw new TypeError('Страны должны быть массивом строк.');
    }
    this.id = id;
    this.travelerName = travelerName.trim();
    this.visitedCountries = [];
    visitedCountries.forEach((country) => this.addCountry(country));
  }

  addCountry(country) {
    if (typeof country !== 'string' || !country.trim()) {
      throw new TypeError('Укажите название страны.');
    }
    const name = country.trim();
    if (!this.visitedCountries.includes(name)) {
      this.visitedCountries.push(name);
    }
  }

  removeCountry(country) {
    const name = country.trim();
    this.visitedCountries = this.visitedCountries.filter(
      (item) => item !== name,
    );
  }

  get visitedCount() {
    return this.visitedCountries.length;
  }
}

export function groupTravelsByCountryCount(travels) {
  const groups = new Map();
  travels.forEach((travel) => {
    const count = travel.visitedCount;
    if (!groups.has(count)) {
      groups.set(count, []);
    }
    groups.get(count).push(travel);
  });
  return groups;
}

export function getUniqueCountries(travels) {
  return [...new Set(travels.flatMap((travel) => travel.visitedCountries))];
}

export function findTravelsByCountry(travels, country) {
  return travels.filter((travel) => travel.visitedCountries.includes(country));
}

export function groupTravelersByCountry(travels) {
  const groups = new Map();
  travels.forEach((travel) => {
    travel.visitedCountries.forEach((country) => {
      if (!groups.has(country)) {
        groups.set(country, []);
      }
      groups.get(country).push(travel);
    });
  });
  return groups;
}

export function findTravelsAboveCountryCount(travels, count) {
  return travels.filter((travel) => travel.visitedCount > count);
}
