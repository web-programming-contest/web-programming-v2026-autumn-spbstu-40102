const initialPosts = [
  {
    id: '1',
    title: 'ES modules',
    content: 'ES modules make JavaScript code easier to organize and reuse.',
    author: 'Anna',
    tags: ['javascript', 'modules'],
    comments: [
      {id: '1-1', author: 'Max', text: 'Great explanation!'},
      {id: '1-2', author: 'Olga', text: 'This was helpful.'},
    ],
  },
  {
    id: '2',
    title: 'Working with arrays',
    content: 'A short overview of useful array methods in JavaScript.',
    author: 'Victor',
    tags: ['javascript', 'arrays'],
    comments: [
      {id: '2-1', author: 'Max', text: 'I use these methods every day.'},
    ],
  },
  {
    id: '3',
    title: 'CSS layout basics',
    content: 'Flexbox and Grid help create responsive page layouts.',
    author: 'Maria',
    tags: ['css', 'web-design'],
    comments: [],
  },
];

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeComments(comments) {
  return Array.isArray(comments)
    ? comments.map((comment, index) => ({
        id: comment.id ?? `comment-${index + 1}`,
        author: comment.author ?? comment.name ?? 'Anonymous',
        text: comment.text ?? comment.content ?? '',
      }))
    : [];
}

function toPlainPost(post) {
  if (post instanceof BlogPost) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      tags: [...post.tags],
      comments: post.comments.map((comment) => ({...comment})),
    };
  }

  return post;
}

export class BlogPost {
  constructor(
    dataOrId,
    title = '',
    content = '',
    author = '',
    tags = [],
    comments = [],
  ) {
    const data =
      dataOrId !== null && typeof dataOrId === 'object'
        ? dataOrId
        : {id: dataOrId, title, content, author, tags, comments};

    this.id = data.id ?? '';
    this.title = data.title ?? '';
    this.content = data.content ?? '';
    this.author = data.author ?? '';
    this.tags = normalizeTags(data.tags);
    this.comments = normalizeComments(data.comments);
  }

  get commentCount() {
    return this.comments.length;
  }

  get commentsCount() {
    return this.comments.length;
  }

  addComment(comment, text = '') {
    const newComment =
      typeof comment === 'object' && comment !== null
        ? {
            id: comment.id ?? `comment-${Date.now()}-${this.comments.length}`,
            author: comment.author ?? comment.name ?? 'Anonymous',
            text: comment.text ?? comment.content ?? '',
          }
        : {
            id: `comment-${Date.now()}-${this.comments.length}`,
            author: String(comment || 'Anonymous'),
            text: String(text),
          };

    this.comments.push(newComment);
    return newComment;
  }

  removeComment(commentId) {
    const index = this.comments.findIndex(
      (comment) => String(comment.id) === String(commentId),
    );

    if (index === -1) {
      return false;
    }

    this.comments.splice(index, 1);
    return true;
  }

  addTag(tag) {
    const value = String(tag).trim();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }

    return this.tags;
  }

  removeTag(tag) {
    this.tags = this.tags.filter((item) => item !== tag);
    return this.tags;
  }
}

export const samplePosts = initialPosts.map((post) => new BlogPost(post));

function resolvePosts(posts) {
  return Array.isArray(posts) ? posts : samplePosts;
}

function getPostTags(post) {
  return normalizeTags(post.tags);
}

function getPostComments(post) {
  return Array.isArray(post.comments) ? post.comments : [];
}

function getCommentAuthor(comment) {
  return comment.author ?? comment.name ?? '';
}

export function groupPostsByTag(posts = samplePosts) {
  return resolvePosts(posts).reduce((groups, post) => {
    getPostTags(post).forEach((tag) => {
      if (!groups[tag]) {
        groups[tag] = [];
      }

      groups[tag].push(post);
    });

    return groups;
  }, {});
}

export function getUniqueTags(posts = samplePosts) {
  return [...new Set(resolvePosts(posts).flatMap(getPostTags))];
}

export function groupPostsByCommentCount(posts = samplePosts) {
  return resolvePosts(posts).reduce((groups, post) => {
    const count = getPostComments(post).length;
    const key = String(count);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(post);
    return groups;
  }, {});
}

export function findPostsByTag(tag, posts = samplePosts) {
  if (Array.isArray(tag)) {
    const collection = tag;
    tag = typeof posts === 'string' ? posts : 'javascript';
    posts = collection;
  }

  const expectedTag = String(tag ?? '')
    .trim()
    .toLowerCase();

  return resolvePosts(posts).filter((post) =>
    getPostTags(post).some((item) => item.toLowerCase() === expectedTag),
  );
}

export function getCommentAuthors(posts = samplePosts) {
  const authors = resolvePosts(posts).flatMap((post) =>
    getPostComments(post).map(getCommentAuthor).filter(Boolean),
  );

  return [...new Set(authors)];
}

export function createPostCollection(data = initialPosts) {
  return data.map((post) => new BlogPost(post));
}

export function serializePosts(posts) {
  return resolvePosts(posts).map(toPlainPost);
}
