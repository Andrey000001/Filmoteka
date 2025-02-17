import { fetchAllMovies, fetchMovieWithGenres } from '../../api/moviesApi';
import { renderMoviesByPage } from '../../render/renderMain';
import { fetchByName } from '../../api/moviesApi';
import refs from '../../utils/refs';
import { renderMovies } from '../../render/renderMain';
import { getFromStorage } from '../../utils/storage';
import { activePage, setActivePage, getActivePage } from '../../utils/state';

let pagination;
class Pagination {
  constructor(containerId, totalPages, onPageChange) {
    this.containerId = document.getElementById(containerId);
    this.totalPages = totalPages;
    this.currentPage = 1;
    this.onPageChange = onPageChange;
    this.renderBtns();
  }

  renderBtns() {
    const buttons = this.createPageButtons();
    this.containerId.innerHTML = '';
    buttons.forEach(button => this.containerId.appendChild(button));
  }
  updatePagination(totalPages, currentPage = 1) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.renderBtns(); // Перерисовываем кнопки пагинации
  }
  createPageButtons() {
    const buttons = [];
    const range = 2;
    const maxVisiblePages = 5;

    let start = Math.max(1, this.currentPage - range);
    let end = Math.min(this.totalPages, this.currentPage + range);

    if (this.currentPage <= range + 1) {
      end = Math.min(2 * range + 1, this.totalPages);
    }

    if (this.currentPage >= this.totalPages - range) {
      start = Math.max(1, this.totalPages - 2 * range);
    }

    // Кнопка "влево" (если не на первой странице)
    if (this.currentPage > 1) {
      buttons.push(this.createPageButton(this.currentPage - 1, '←')); // Стрелка влево
    }

    // Первая страница
    if (start > 1) {
      buttons.push(this.createPageButton(1));
      if (start > 2) buttons.push(this.createEllipsis());
    }

    // Страницы в диапазоне
    for (let i = start; i <= end; i++) {
      buttons.push(this.createPageButton(i));
    }

    // Последняя страница
    if (end < this.totalPages) {
      if (end < this.totalPages - 1) buttons.push(this.createEllipsis());
      buttons.push(this.createPageButton(this.totalPages));
    }

    // Кнопка "вправо" (если не на последней странице)
    if (this.currentPage < this.totalPages) {
      buttons.push(this.createPageButton(this.currentPage + 1, '→')); // Стрелка вправо
    }

    return buttons;
  }

  createPageButton(pageNumber, text = null) {
    const button = document.createElement('button');
    button.classList.add('page-button');
    button.textContent = text !== null ? text : pageNumber; // Если текст передан, используем его, иначе номер страницы
    button.dataset.page = pageNumber;
    button.addEventListener('click', () => this.handleClickButton(pageNumber));

    if (pageNumber === this.currentPage) {
      button.classList.add('is-active-btn');
    }

    return button;
  }

  createEllipsis() {
    const ellipsis = document.createElement('span');
    ellipsis.textContent = '...';
    ellipsis.classList.add('ellipsis');
    return ellipsis;
  }

  async handleClickButton(pageNumber) {
    console.log(`Current page: ${pageNumber}`); // Логируем текущую страницу

    this.currentPage = pageNumber;
    this.renderBtns(); // Перерисовываем кнопки пагинации

    if (activePage === 'Home') {
      // Если активная страница - Home, загружаем фильмы для главной страницы
      const movies = await fetchMovieWithGenres(pageNumber);
      renderMoviesByPage(movies);
    } else if (activePage === 'Watched') {
      const watchedList = getFromStorage('watchList') || []; // Добавляем fallback на случай, если список пуст
      const moviesPerPage = 20;
      const startIndex = (pageNumber - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      const moviesToRender = watchedList.slice(startIndex, endIndex);
      console.log(moviesToRender);
      renderMovies(moviesToRender); // Отрисовываем фильмы
    } else if (activePage === 'Queue') {
      // Если активная страница - Queue, загружаем фильмы из "Queue"
      const queueList = getFromStorage('queueList') || []; // Добавляем fallback на случай, если список пуст
      const moviesPerPage = 20;
      const startIndex = (pageNumber - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      const moviesToRender = queueList.slice(startIndex, endIndex);
      renderMovies(moviesToRender); // Отрисовываем фильмы
    }
  }

  updatePaginationForLibrary(movies, moviesPerPage = 20) {
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    this.updatePagination(totalPages);
    if (totalPages > 1) {
      this.showPagination();
    } else {
      this.hidePagination();
    }
  }

  hidePagination() {
    this.containerId.style.display = 'none';
  }

  showPagination() {
    this.containerId.style.display = 'flex';
  }
}

refs.submitMovieByName.addEventListener('click', onSearchClick);

refs.movieName.addEventListener('keydown', onPressEnter);
function onPressEnter(e) {
  if (e.key !== 'Enter') return;
  onSearchClick(e);
}
async function onSearchClick(e) {
  e.preventDefault();
  const query = refs.movieName.value.toLowerCase();

  if (!query || query === '') {
    // return;
    // const data = await fetchAllMovies();
    // renderMovies(data.results);
    // pagination.updatePagination(data.total_pages);
    // pagination.showPagination();
  } else {
    const data = await fetchByName(query);

    if (data.results.length > 0) {
      renderMoviesByPage(data.results);
      pagination.updatePagination(data.total_pages || 1);
      pagination.showPagination();
    } else {
      refs.main.innerHTML = '<p>Фильмы не найдены</p>';
      pagination.hidePagination();
    }
  }
}

async function initPagination() {
  try {
    const data = await fetchAllMovies();
    const { total_pages } = data;

    pagination = new Pagination(
      'pagination-container',
      total_pages,
      async page => {
        const movies = await fetchMovieWithGenres(page);
        return movies;
      }
    );

    const initialMovies = await fetchMovieWithGenres(1);
    renderMoviesByPage(initialMovies);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
}

export function renderLibraryWatched() {
  if (!pagination) {
    console.error('Pagination is not initialized');
    return;
  }

  const watchedList = getFromStorage('watchList') || []; // Добавляем fallback на случай, если список пуст
  console.log(watchedList); // Проверяем, что данные извлекаются правильно

  if (watchedList.length === 0) {
    console.warn('Watched list is empty');
    refs.main.innerHTML = '<p>No movies in the watched list.</p>';
    pagination.hidePagination();
    return;
  }

  // Обновляем пагинацию для библиотеки
  pagination.updatePaginationForLibrary(watchedList);

  // Отрисовываем фильмы для текущей страницы
  const moviesPerPage = 20;
  const startIndex = (pagination.currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const moviesToRender = watchedList.slice(startIndex, endIndex);

  renderMovies(moviesToRender); // Отрисовываем фильмы
}

export function renderLibraryQueue() {
  if (!pagination) {
    console.error('Pagination is not initialized');
    return;
  }

  const queueList = getFromStorage('queueList') || [];
  console.log(queueList);
  if (queueList.length === 0) {
    console.warn('Queue list is empty');
    refs.main.innerHTML = '<p>No movies in the queue list.</p>';
    pagination.hidePagination();
    return;
  }

  pagination.updatePaginationForLibrary(queueList);

  const moviesPerPage = 20;
  const startIndex = (pagination.currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const moviesToRender = queueList.slice(startIndex, endIndex);

  renderMovies(moviesToRender);
}

refs.libraryControls.addEventListener('click', onLibraryControlsClick);

function onLibraryControlsClick(e) {
  const button = e.target.closest('button');
  if (!button) return;

  refs.libraryControls
    .querySelectorAll('button')
    .forEach(btn => btn.classList.remove('is-active'));
  button.classList.add('is-active');

  const action = button.dataset.action;
  console.log(action);
  if (action === 'watched') {
    setActivePage('Watched'); // Обновляем activePage
    renderLibraryWatched(); // Рендерим фильмы из "Watched"
  } else if (action === 'queue') {
    setActivePage('Queue'); // Обновляем activePage
    renderLibraryQueue(); // Рендерим фильмы из "Queue"
  }
}

initPagination();
