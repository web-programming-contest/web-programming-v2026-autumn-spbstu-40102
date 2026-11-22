export class Game {
  constructor(title, platforms = [], releaseYear = 0) {
    this.title = title;
    this.platforms = [...platforms];
    this.releaseYear = releaseYear;
  }

  addPlatform(platform) {
    if (!this.platforms.includes(platform)) {
      this.platforms.push(platform);
    }
  }

  removePlatform(platform) {
    this.platforms = this.platforms.filter((item) => item !== platform);
  }

  get platformCount() {
    return this.platforms.length;
  }
}

export function groupGamesByReleaseYear(games) {
  const result = {};
  for (const game of games) {
    if (!result[game.releaseYear]) {
      result[game.releaseYear] = [];
    }
    result[game.releaseYear].push(game);
  }
  return result;
}

export function getUniquePlatforms(games) {
  const platforms = new Set();
  for (const game of games) {
    for (const platform of game.platforms) {
      platforms.add(platform);
    }
  }
  return [...platforms];
}

export function findGamesByPlatform(games, platform) {
  return games.filter((game) => game.platforms.includes(platform));
}

export function groupGamesByPlatformCount(games) {
  const result = {};
  for (const game of games) {
    const count = game.platforms.length;
    if (!result[count]) {
      result[count] = [];
    }
    result[count].push(game);
  }
  return result;
}

export function findGamesReleasedAfter(games, year) {
  return games.filter((game) => game.releaseYear > year);
}
