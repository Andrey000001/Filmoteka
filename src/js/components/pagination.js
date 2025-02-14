import { fetchAllMovies, fetchMovieWithGenres } from '../api/moviesApi';
import { renderMoviesByPage } from '../render/renderMain';
import { fetchByName } from '../api/moviesApi';
import refs from '../utils/refs';
import { renderMovies } from '../render/renderMain';
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
    this.currentPage = pageNumber;
    this.renderBtns();
    const movies = await this.onPageChange(pageNumber);
    renderMoviesByPage(movies);
  }
  updatePagination(totalPages, currentPage = 1) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.renderBtns();
  }
  hidePagination() {
    this.containerId.style.display = 'none';
  }
  showPagination() {
    this.containerId.style.display = 'flex';
  }
}
refs.submitMovieByName.addEventListener('click', onSearchClick);

async function onSearchClick(e) {
  e.preventDefault();
  const query = refs.movieName.value.toLowerCase();

  if (!query || query === '') {
    // Если запрос пустой, загружаем все фильмы
    const data = await fetchAllMovies();
    renderMovies(data.results);

    // Обновляем пагинацию на основе общего количества страниц
    pagination.updatePagination(data.total_pages);
    pagination.showPagination(); // Показываем пагинацию
  } else {
    // Если запрос не пустой, ищем фильмы по имени
    const data = await fetchByName(query);

    if (data.results.length > 0) {
      // Если фильмы найдены, отображаем их
      renderMoviesByPage(data.results);

      // Обновляем пагинацию на основе количества страниц, возвращенных поиском
      pagination.updatePagination(data.total_pages || 1);
      pagination.showPagination(); // Показываем пагинацию
    } else {
      // Если фильмы не найдены, показываем сообщение
      refs.main.innerHTML = '<p>Фильмы не найдены</p>';
      pagination.hidePagination(); // Скрываем пагинацию
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

initPagination();
