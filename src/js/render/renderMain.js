import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';
import { fetchMovieWithGenres } from '../api/moviesApi';
import { fetchAllMovies } from '../api/moviesApi';
renderAllMovies();
import { pagination } from '../utils/state';

export async function renderAllMovies() {
  const moviesDetails = await fetchMovieWithGenres(1); // Загружаем фильмы для первой страницы
  const result = mainTpl(moviesDetails);
  refs.main.innerHTML = result;

  // Обновляем пагинацию
  if (pagination) {
    const data = await fetchAllMovies();
    pagination.updatePagination(data.total_pages);
    pagination.showPagination();
  }
}
export async function renderMoviesByPage(data) {
  // refs.main.innerHTML = '';
  refs.main.innerHTML = mainTpl(data);
}

export function renderMovies(data) {
  refs.main.innerHTML = ''; // Очищаем контейнер
  if (data.length === 0) {
    refs.main.innerHTML = '<p>No movies to display.</p>'; // Сообщение, если данных нет
    return;
  }
  const template = mainTpl(data); // Генерируем шаблон
  refs.main.innerHTML = template; // Вставляем шаблон в DOM
}
