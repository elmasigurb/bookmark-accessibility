const bookGrid = document.querySelector('#book-grid');
const searchInput = document.querySelector('#book-search');
const resultsCount = document.querySelector('#results-count');
const emptyState = document.querySelector('#empty-state');
const dialog = document.querySelector('#book-dialog');
const closeButton = document.querySelector('#dialog-close');
const form = document.querySelector('#club-form');

let books = [];
let activeDialogTrigger = null;

function getSavedBooks() {
  try {
    return new Set(JSON.parse(sessionStorage.getItem('bookmark-saved') || '[]'));
  } catch {
    return new Set();
  }
}

let savedBooks = getSavedBooks();

function updateResultsCount(count) {
  if (count === 0) resultsCount.textContent = 'No books found';
  else resultsCount.textContent = `${count} ${count === 1 ? 'book' : 'books'} found`;
}

function saveIconMarkup() {
  return `
    <svg class="bookmark-icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M6.5 3.5h11v17L12 17l-5.5 3.5z"/></svg>
    <svg class="saved-check" aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="m5 12 4.5 4.5L19 7"/></svg>`;
}

function renderBooks(collection) {
  bookGrid.replaceChildren();

  collection.forEach((book) => {
    const article = document.createElement('article');
    article.className = 'book-card';
    const isSaved = savedBooks.has(book.id);
    article.innerHTML = `
      <div class="cover-frame">
        <img class="book-cover" src="${book.cover}" alt="Cover of ${book.title} by ${book.author}">
      </div>
      <div class="card-content">
        <h3>${book.title}</h3>
        <p class="book-author">${book.author}</p>
        <div class="card-actions">
          <button class="button details-button" type="button" data-book-id="${book.id}">View details for ${book.title}</button>
          <button class="icon-button save-button" type="button" data-book-id="${book.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? `Remove ${book.title} from saved books` : `Save ${book.title}`}">
            ${saveIconMarkup()}
          </button>
        </div>
      </div>`;
    bookGrid.append(article);
  });

  bookGrid.setAttribute('aria-busy', 'false');
  emptyState.hidden = collection.length !== 0;
  updateResultsCount(collection.length);
}

function openBookDialog(book, trigger) {
  activeDialogTrigger = trigger;
  document.querySelector('#dialog-title').textContent = book.title;
  document.querySelector('#dialog-author').textContent = `by ${book.author}`;
  document.querySelector('#dialog-genre').textContent = book.genre;
  document.querySelector('#dialog-year').textContent = book.year;
  document.querySelector('#dialog-description').textContent = book.detailedDescription;
  const cover = document.querySelector('#dialog-cover');
  cover.src = book.cover;
  cover.alt = `Cover of ${book.title} by ${book.author}`;
  dialog.showModal();
  closeButton.focus();
}

bookGrid.addEventListener('click', (event) => {
  const detailsButton = event.target.closest('.details-button');
  const saveButton = event.target.closest('.save-button');

  if (detailsButton) {
    const book = books.find((item) => item.id === detailsButton.dataset.bookId);
    if (book) openBookDialog(book, detailsButton);
  }

  if (saveButton) {
    const book = books.find((item) => item.id === saveButton.dataset.bookId);
    if (!book) return;
    const willBeSaved = !savedBooks.has(book.id);
    if (willBeSaved) savedBooks.add(book.id);
    else savedBooks.delete(book.id);
    sessionStorage.setItem('bookmark-saved', JSON.stringify([...savedBooks]));
    saveButton.setAttribute('aria-pressed', String(willBeSaved));
    saveButton.setAttribute('aria-label', willBeSaved ? `Remove ${book.title} from saved books` : `Save ${book.title}`);
  }
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const matches = books.filter((book) => `${book.title} ${book.author}`.toLocaleLowerCase().includes(query));
  renderBooks(matches);
});

closeButton.addEventListener('click', () => dialog.close());

dialog.addEventListener('close', () => {
  if (activeDialogTrigger?.isConnected) activeDialogTrigger.focus();
});

const fields = {
  name: {
    input: form.elements.name,
    error: document.querySelector('#name-error'),
    valid: () => form.elements.name.value.trim().length > 0,
  },
  email: {
    input: form.elements.email,
    error: document.querySelector('#email-error'),
    valid: () => form.elements.email.validity.valid && form.elements.email.value.trim().length > 0,
  },
  genre: {
    input: form.elements.genre,
    error: document.querySelector('#genre-error'),
    valid: () => form.elements.genre.value !== '',
  },
  consent: {
    input: form.elements.consent,
    error: document.querySelector('#consent-error'),
    valid: () => form.elements.consent.checked,
  },
};

function validateField(field) {
  const isValid = field.valid();
  field.error.hidden = isValid;
  field.input.setAttribute('aria-invalid', String(!isValid));
  if (isValid) field.input.removeAttribute('aria-describedby');
  else field.input.setAttribute('aria-describedby', field.error.id);
  return isValid;
}

Object.values(fields).forEach((field) => {
  field.input.addEventListener('blur', () => validateField(field));
  field.input.addEventListener(field.input.type === 'checkbox' || field.input.tagName === 'SELECT' ? 'change' : 'input', () => {
    if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const validation = Object.values(fields).map((field) => validateField(field));
  const firstInvalid = Object.values(fields).find((field) => field.input.getAttribute('aria-invalid') === 'true');
  const successMessage = document.querySelector('#form-success');

  if (validation.every(Boolean)) {
    successMessage.textContent = 'Thank you for joining the BOOKMARK Reading Club!';
  } else {
    successMessage.textContent = '';
    firstInvalid.input.focus();
  }
});

async function loadBooks() {
  try {
    const response = await fetch('books.json');
    if (!response.ok) throw new Error(`Book data returned ${response.status}`);
    books = await response.json();
    renderBooks(books);
  } catch (error) {
    bookGrid.setAttribute('aria-busy', 'false');
    resultsCount.textContent = 'Books could not be loaded';
    emptyState.hidden = false;
    emptyState.textContent = 'We could not load the collection. Please refresh the page to try again.';
    console.error(error);
  }
}

loadBooks();
