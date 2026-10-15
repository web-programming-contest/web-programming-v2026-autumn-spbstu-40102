export class Movie {
  constructor(title, director, actors = []) {
    this.title = title;
    this.director = director;
    this.actors = actors;
  }

  addActor(name) {
    this.actors.push(name);
  }

  removeActor(name) {
    this.actors = this.actors.filter((actor) => actor !== name);
  }

  get castSize() {
    return this.actors.length;
  }
}

export function groupMoviesByDirector(movies) {
  return movies.reduce((acc, movie) => {
    (acc[movie.director] = acc[movie.director] || []).push(movie);
    return acc;
  }, {});
}

export function getUniqueActors(movies) {
  return [...new Set(movies.flatMap((movie) => movie.actors))];
}

export function groupMoviesByCastSize(movies) {
  const map = new Map();

  for (const movie of movies) {
    const size = movie.castSize;
    if (!map.has(size)) {
      map.set(size, []);
    }
    map.get(size).push(movie);
  }

  return [...map.entries()];
}

export function findMoviesByActor(movies, actorName) {
  return movies.filter((movie) => movie.actors.includes(actorName));
}

export function getMovieTitles(movies) {
  return movies.map((movie) => movie.title);
}
