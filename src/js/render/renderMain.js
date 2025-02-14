import { fetchMovieWithGenres } from '../api/moviesApi';
import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';
import { getFromStorage } from '../utils/storage';

renderAllMovies();

export async function renderAllMovies() {
  const moviesDetails = await fetchMovieWithGenres();
  const result = mainTpl(moviesDetails);
  refs.main.innerHTML = result;
}
export async function renderMoviesByPage(data) {
  // refs.main.innerHTML = '';
  refs.main.innerHTML = mainTpl(data);
}

export function renderMovies(data) {
  const { results } = data;
  refs.main.innerHTML = '';
  const template = mainTpl(data);
  refs.main.innerHTML = template;
}

export function renderLibraryMovies() {
  const watchList = getFromStorage('watchList');
  renderMovies(watchList);
}
