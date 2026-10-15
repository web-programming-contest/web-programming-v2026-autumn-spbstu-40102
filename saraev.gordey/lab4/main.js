import {Movie} from './model.js';

const STORAGE_KEY = 'movies';

function loadMovies() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return data.map((d) => {
      const movie = new Movie(d.title, d.director);
      movie.actors = d.actors || [];
      return movie;
    });
  } catch {
    return [];
  }
}

function saveMovies(movies) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      movies.map((m) => ({
        title: m.title,
        director: m.director,
        actors: m.actors,
      })),
    ),
  );
}

function asyncOperation(callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, 300);
  });
}

function render(movies) {
  const list = document.querySelector('[data-testid="entity-list"]');
  list.innerHTML = '';

  movies.forEach((movie, index) => {
    const card = document.createElement('div');
    card.setAttribute('data-testid', 'entity-card');
    card.className = 'movie-card';

    const actorsHtml = movie.actors
      .map(
        (actor) =>
          `<span class="actor-tag">${actor} <button class="actor-remove-btn" data-actor="${actor}">Удалить</button></span>`,
      )
      .join('');

    card.innerHTML = `
      <h3>${movie.title}</h3>
      <p>Режиссёр: ${movie.director}</p>
      <p>Актёры (${movie.castSize}): ${actorsHtml || 'нет'}</p>
      <form class="actor-form">
        <input type="text" name="actor" placeholder="Имя актёра" required />
        <button type="submit">Добавить актёра</button>
      </form>
      <button data-testid="delete-entity">Удалить фильм</button>
    `;

    card
      .querySelector('[data-testid="delete-entity"]')
      .addEventListener('click', async () => {
        await asyncOperation(() => {
          movies.splice(index, 1);
          saveMovies(movies);
          render(movies);
        });
      });

    card.querySelectorAll('.actor-remove-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const actorName = btn.getAttribute('data-actor');
        await asyncOperation(() => {
          movie.removeActor(actorName);
          saveMovies(movies);
          render(movies);
        });
      });
    });

    card.querySelector('.actor-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = e.target.querySelector('[name="actor"]');
      const actorName = input.value.trim();
      if (!actorName) {
        return;
      }

      await asyncOperation(() => {
        movie.addActor(actorName);
        saveMovies(movies);
        render(movies);
      });
    });

    list.appendChild(card);
  });
}

const movies = loadMovies();
render(movies);

document
  .querySelector('[data-testid="entity-form"]')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.querySelector('[name="title"]').value.trim();
    const director = form.querySelector('[name="director"]').value.trim();

    if (!title || !director) {
      return;
    }

    await asyncOperation(() => {
      movies.push(new Movie(title, director));
      saveMovies(movies);
      render(movies);
      form.reset();
    });
  });
