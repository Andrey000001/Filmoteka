import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';
import {
  fetchMoviesByIdsWithGenres,
  fetchMovieWithGenres,
} from '../api/moviesApi';
import { fetchAllMovies } from '../api/moviesApi';
import { pagination } from '../components/pagination/pagination';

renderAllMovies();

export async function renderAllMovies() {
  const moviesDetails = await fetchMovieWithGenres(1);
  const result = mainTpl(moviesDetails);
  refs.main.innerHTML = result;

  if (pagination) {
    console.log('true');

    const data = await fetchAllMovies();
    pagination.updatePagination(data.total_pages);
    pagination.showPagination();
  }
}

export async function renderMoviesByPage(data) {
  refs.main.innerHTML = mainTpl(data);
}

export async function renderMovies(data) {
  refs.main.innerHTML = '';
  if (data.length === 0) {
    refs.main.innerHTML = '<p>No movies to display.</p>';
  }
  const moviesId = data.map(({ id }) => id);
  const result = await fetchMoviesByIdsWithGenres(moviesId);

  const template = mainTpl(result);
  refs.main.innerHTML = template;
}
