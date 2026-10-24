const searchInput = document.querySelector('#search');
const bookGrid = document.querySelector('#book-grid');
const resultsCount = document.querySelector('#results-count');
const loadError = document.querySelector('#load-error');
const dialog = document.querySelector('#book-dialog');
const dialogClose = document.querySelector('#dialog-close');
const clubForm = document.querySelector('#club-form');
const successMessage = document.querySelector('#form-success');

let books = [];
let dialogTrigger = null;
const savedBooks = new Set(JSON.parse(sessionStorage.getItem('bookmark-saved-books') || '[]'));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function resultCountText(count) {
  if (count === 0) return 'No books found';
  return `${count} ${count === 1 ? 'book' : 'books'} found`;
}

function bookCard(book) {
  const saved = savedBooks.has(book.id);
  const saveLabel = saved ? `Remove ${book.title} from saved books` : `Save ${book.title}`;
  return `
    <article class="book-card">
      <div class="cover-wrap">
        <img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.alt)}">
      </div>
      <h3>${escapeHtml(book.title)}</h3>
      <p class="book-author">${escapeHtml(book.author)}</p>
      <div class="card-actions">
        <button class="details-button" type="button" data-book-id="${escapeHtml(book.id)}" aria-label="View details for ${escapeHtml(book.title)}">View details</button>
        <button class="save-button" type="button" data-save-id="${escapeHtml(book.id)}" aria-pressed="${saved}" aria-label="${escapeHtml(saveLabel)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"></path></svg>
        </button>
      </div>
    </article>`;
}

function renderBooks(query = '') {
  const normalized = query.trim().toLocaleLowerCase();
  const matches = books.filter((book) =>
    book.title.toLocaleLowerCase().includes(normalized) ||
    book.author.toLocaleLowerCase().includes(normalized)
  );
  bookGrid.innerHTML = matches.map(bookCard).join('');
  resultsCount.textContent = resultCountText(matches.length);
}

function openBookDialog(book, trigger) {
  dialogTrigger = trigger;
  document.querySelector('#dialog-title').textContent = book.title;
  document.querySelector('#dialog-author').textContent = `by ${book.author}`;
  document.querySelector('#dialog-genre').textContent = book.genre;
  document.querySelector('#dialog-year').textContent = book.year;
  document.querySelector('#dialog-description').textContent = book.detailedDescription;
  const cover = document.querySelector('#dialog-cover');
  cover.src = book.cover;
  cover.alt = book.alt;
  dialog.showModal();
  dialogClose.focus();
}

function closeDialog() {
  const trigger = dialogTrigger;
  dialog.close();
  if (trigger?.isConnected) trigger.focus();
  dialogTrigger = null;
}

bookGrid.addEventListener('click', (event) => {
  const detailsButton = event.target.closest('[data-book-id]');
  if (detailsButton) {
    const book = books.find((item) => item.id === detailsButton.dataset.bookId);
    if (book) openBookDialog(book, detailsButton);
    return;
  }

  const saveButton = event.target.closest('[data-save-id]');
  if (!saveButton) return;
  const book = books.find((item) => item.id === saveButton.dataset.saveId);
  if (!book) return;

  const nowSaved = !savedBooks.has(book.id);
  if (nowSaved) savedBooks.add(book.id);
  else savedBooks.delete(book.id);
  sessionStorage.setItem('bookmark-saved-books', JSON.stringify([...savedBooks]));
  saveButton.setAttribute('aria-pressed', String(nowSaved));
  const updatedLabel = nowSaved ? `Remove ${book.title} from saved books` : `Save ${book.title}`;
  // Expose the pressed-state change before updating the control's accessible name.
  window.setTimeout(() => saveButton.setAttribute('aria-label', updatedLabel), 100);
});

searchInput.addEventListener('input', () => renderBooks(searchInput.value));
dialogClose.addEventListener('click', closeDialog);
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDialog();
});
dialog.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.disabled && element.getClientRects().length > 0);
  if (focusable.length === 0) {
    event.preventDefault();
    dialog.focus();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }
});

const fields = {
  name: {
    element: document.querySelector('#name'),
    error: document.querySelector('#name-error'),
    valid: (field) => field.value.trim().length > 0,
  },
  email: {
    element: document.querySelector('#email'),
    error: document.querySelector('#email-error'),
    valid: (field) => field.value.trim().length > 0 && field.validity.valid,
  },
  genre: {
    element: document.querySelector('#genre'),
    error: document.querySelector('#genre-error'),
    valid: (field) => field.value !== '',
  },
  consent: {
    element: document.querySelector('#consent'),
    error: document.querySelector('#consent-error'),
    valid: (field) => field.checked,
  },
};

function validateField(config) {
  const isValid = config.valid(config.element);
  config.error.hidden = isValid;
  if (isValid) {
    config.element.removeAttribute('aria-invalid');
    config.element.removeAttribute('aria-describedby');
  } else {
    config.element.setAttribute('aria-invalid', 'true');
    config.element.setAttribute('aria-describedby', config.error.id);
  }
  return isValid;
}

Object.values(fields).forEach((config) => {
  config.element.addEventListener('blur', () => validateField(config));
  config.element.addEventListener(config.element.type === 'checkbox' || config.element.tagName === 'SELECT' ? 'change' : 'input', () => {
    if (config.element.hasAttribute('aria-invalid')) validateField(config);
  });
});

clubForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.textContent = '';
  const firstInvalid = Object.values(fields).find((config) => !validateField(config));
  if (firstInvalid) {
    firstInvalid.element.focus();
    return;
  }
  successMessage.textContent = 'Thank you for joining the BOOKMARK Reading Club!';
});

fetch('books.json')
  .then((response) => {
    if (!response.ok) throw new Error('Book data could not be loaded.');
    return response.json();
  })
  .then((data) => {
    books = data;
    renderBooks();
  })
  .catch(() => {
    resultsCount.textContent = 'No books available';
    loadError.hidden = false;
  });
