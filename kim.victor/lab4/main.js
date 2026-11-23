import {BlogPost, samplePosts, serializePosts} from './model.js';

const STORAGE_KEY = 'web-programming-lab4-blog-posts';
const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');
const status = document.querySelector("[data-testid='form-status']");

function readPosts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return samplePosts.map((post) => new BlogPost(post));
    }

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed)
      ? parsed.map((post) => new BlogPost(post))
      : [];
  } catch {
    return samplePosts.map((post) => new BlogPost(post));
  }
}

let posts = readPosts();

function savePosts() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializePosts(posts)));
  } catch {
    showStatus('Не удалось сохранить данные в этом браузере.', true);
  }
}

function showStatus(message, isError = false) {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderPosts() {
  list.replaceChildren();

  if (posts.length === 0) {
    list.append(
      createTextElement(
        'p',
        'empty-state',
        'Пока нет публикаций. Добавьте первую запись.',
      ),
    );
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.testid = 'entity-card';
    card.dataset.id = String(post.id);

    const topLine = document.createElement('div');
    topLine.className = 'post-card-top';

    const postId = createTextElement('span', 'post-id', `Пост #${post.id}`);
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.dataset.testid = 'delete-entity';
    deleteButton.textContent = 'Удалить';
    deleteButton.setAttribute('aria-label', `Удалить пост ${post.title}`);
    deleteButton.addEventListener('click', () => removePost(post.id));

    topLine.append(postId, deleteButton);

    const title = createTextElement('h3', 'post-card-title', post.title);
    const author = createTextElement(
      'p',
      'post-card-author',
      `Автор: ${post.author || 'Не указан'}`,
    );
    const content = createTextElement(
      'p',
      'post-card-content',
      post.content || 'Без текста',
    );

    const tags = document.createElement('div');
    tags.className = 'tag-list';
    (Array.isArray(post.tags) ? post.tags : []).forEach((tag) => {
      tags.append(createTextElement('span', 'tag', `#${tag}`));
    });

    const comments = createTextElement(
      'p',
      'post-card-comments',
      `Комментарии: ${Array.isArray(post.comments) ? post.comments.length : 0}`,
    );

    card.append(topLine, title, author, content, tags, comments);
    list.append(card);
  });
}

function removePost(id) {
  showStatus('Удаляем публикацию...');

  window.setTimeout(() => {
    posts = posts.filter((post) => String(post.id) !== String(id));
    savePosts();
    renderPosts();
    showStatus('Публикация удалена.');
  }, 120);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();

  if (!id || !title) {
    showStatus('Заполните ID и заголовок.', true);
    return;
  }

  if (posts.some((post) => String(post.id) === id)) {
    showStatus('Публикация с таким ID уже существует.', true);
    return;
  }

  const post = new BlogPost({
    id,
    title,
    author: String(formData.get('author') ?? '').trim(),
    content: String(formData.get('content') ?? '').trim(),
    tags: String(formData.get('tags') ?? ''),
    comments: [],
  });

  showStatus('Добавляем публикацию...');

  window.setTimeout(() => {
    posts.unshift(post);
    savePosts();
    renderPosts();
    form.reset();
    showStatus('Публикация добавлена.');
  }, 120);
});

savePosts();
renderPosts();
