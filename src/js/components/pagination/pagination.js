import { fetchAllMovies, fetchMovieWithGenres } from '../../api/moviesApi';
import { renderMoviesByPage } from '../../render/renderMain';
import { fetchByName } from '../../api/moviesApi';
import refs from '../../utils/refs';
import { renderMovies } from '../../render/renderMain';
import { getFromStorage } from '../../utils/storage';
import { activePage, getActivePage, setActivePage } from '../../utils/state';
import { getCurrentQuery, setCurrentQuert } from '../../utils/storage';
export let pagination;

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
    this.renderBtns();
  }
  createPageButtons() {
    const buttons = [];
    const range = 2;

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
      buttons.push(this.createPageButton(this.currentPage + 1, '→'));
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

  handlePageChange(newPage) {
    this.currentPage = newPage;
    window.scroll({ top: 0, behavior: 'smooth' });
  }
  async handleClickButton(pageNumber) {
    this.handlePageChange(pageNumber);
    this.currentPage = pageNumber;
    this.renderBtns();

    if (activePage === 'Home') {
      const movies = await fetchMovieWithGenres(pageNumber);
      console.log(pageNumber);

      renderMoviesByPage(movies);
    } else if (activePage === 'Watched') {
      const watchedList = getFromStorage('watchList') || [];
      const moviesPerPage = 20;
      const startIndex = (pageNumber - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      const moviesToRender = watchedList.slice(startIndex, endIndex);
      console.log(moviesToRender);
      renderMovies(moviesToRender);
    } else if (activePage === 'Queue') {
      const queueList = getFromStorage('queueList') || [];
      const moviesPerPage = 20;
      const startIndex = (pageNumber - 1) * moviesPerPage;
      const endIndex = startIndex + moviesPerPage;
      const moviesToRender = queueList.slice(startIndex, endIndex);
      renderMovies(moviesToRender);
    } else {
      console.log('we here');
      setActivePage('serchMoviesByName');
      const query = getCurrentQuery();
      const { results } = await fetchByName(query, pageNumber);
      console.log(results);

      renderMovies(results);
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

  try {
    if (!query || query === '') {
      alert('тебе нужно ввести что-то');
      return;
    } else {
      setActivePage('serchByName');
      setCurrentQuert(query);
      const data = await fetchByName(query);
      const { results, total_pages } = data;
      if (results.length === 0) {
        return alert('По вашему запрсоу ничего не найденно');
      }
      if (results.length > 0) {
        renderMoviesByPage(results);
        pagination.updatePagination(total_pages || 1);
        pagination.showPagination();
      } else {
        refs.main.innerHTML = '<p>Фильмы не найдены</p>';
        pagination.hidePagination();
      }
    }
  } catch (error) {
    console.log('Ошибка при загрузке данных:', error);
  } finally {
    refs.movieName.value = '';
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
  const queue = document.querySelector('.queue');
  const watched = document.querySelector('.watch');
  console.log(queue);

  queue.classList.remove('button--primary');
  watched.classList.add('button--primary');
  if (activePage === 'Watched') return;
  if (!pagination) {
    console.error('Pagination is not initialized');
    return;
  }

  const watchedList = getFromStorage('watchList') || [];

  if (watchedList.length === 0) {
    console.warn('Watched list is empty');
    refs.main.innerHTML = '<p>No movies in the watched list.</p>';
    pagination.hidePagination();
    return;
  }

  pagination.updatePaginationForLibrary(watchedList);
  const moviesPerPage = 20;
  const startIndex = (pagination.currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const moviesToRender = watchedList.slice(startIndex, endIndex);

  setActivePage('Watched');
  renderMovies(moviesToRender);
}

export function renderLibraryQueue() {
  const queue = document.querySelector('.queue');
  const watched = document.querySelector('.watch');
  console.log(activePage);

  if (activePage === 'Queue') return;
  queue.classList.add('button--primary');
  watched.classList.remove('button--primary');
  if (!pagination) {
    console.error('Pagination is not initialized');
    return;
  }

  const queueList = getFromStorage('queueList') || [];
  if (queueList.length === 0) {
    console.warn('Queue list is empty');
    refs.main.innerHTML = '<p>No movies in the queue list.</p>';
    pagination.hidePagination();
    return;
  }
  pagination.updatePaginationForLibrary(queueList);
  console.log('Выполняется код тут', activePage);
  const moviesPerPage = 20;
  const startIndex = (pagination.currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const moviesToRender = queueList.slice(startIndex, endIndex);

  renderMovies(moviesToRender);
  setActivePage('Queue');
}

refs.libraryControls.addEventListener('click', onLibraryControlsClick);

function onLibraryControlsClick(e) {
  const button = e.target.closest('button');
  const action = button.dataset.action;

  if (!button) return;

  refs.libraryControls
    .querySelectorAll('button')
    .forEach(btn => btn.classList.remove('is-active'));
  button.classList.add('is-active');

  if (action === 'watched') {
    renderLibraryWatched();
  } else if (action === 'queue') {
    renderLibraryQueue();
  }
}

initPagination();
