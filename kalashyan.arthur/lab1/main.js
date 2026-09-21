const totalPages = 3;
const pageLinks = [...document.querySelectorAll('[data-page]')];
const previousLink = document.querySelector('[data-direction="previous"]');
const nextLink = document.querySelector('[data-direction="next"]');
const pageContent = document.querySelector('.page-content');
const pageStatus = document.querySelector('.page-status');

let currentPage = Number.parseInt(location.hash.replace('#page-', ''), 10);

if (
  !Number.isInteger(currentPage) ||
  currentPage < 1 ||
  currentPage > totalPages
) {
  currentPage = 1;
}

function normalizePage(page) {
  if (page < 1) {
    return totalPages;
  }
  if (page > totalPages) {
    return 1;
  }
  return page;
}

function showPage(page) {
  currentPage = normalizePage(page);

  for (const link of pageLinks) {
    const isCurrent = Number(link.dataset.page) === currentPage;
    link.classList.toggle('active', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  previousLink.href = `#page-${normalizePage(currentPage - 1)}`;
  nextLink.href = `#page-${normalizePage(currentPage + 1)}`;
  pageContent.textContent = `Содержимое страницы ${currentPage}`;
  pageStatus.textContent = `Страница ${currentPage} из ${totalPages}`;
  history.replaceState(null, '', `#page-${currentPage}`);
}

for (const link of pageLinks) {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showPage(Number(link.dataset.page));
  });
}

previousLink.addEventListener('click', (event) => {
  event.preventDefault();
  showPage(currentPage - 1);
});

nextLink.addEventListener('click', (event) => {
  event.preventDefault();
  showPage(currentPage + 1);
});

showPage(currentPage);
