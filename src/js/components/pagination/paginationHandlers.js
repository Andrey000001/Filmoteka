import Pagination from './pagination';
import { fetchMovieWithGenres } from '../api/moviesApi';
import { renderMovies } from '../render/renderMain';
import { getFromStorage } from '../services/storage';
import { activePage } from '../utils/state';

export function handleClickButton(pageNumber) {
  console.log(`Current page: ${pageNumber}`);

  if (activePage === 'Home') {
    const movies = await fetchMovieWithGenres(pageNumber);
    renderMoviesByPage(movies);
  } else if (activePage === 'Watched') {
    const watchedList = getFromStorage('watchList') || [];
    const moviesPerPage = 20;
    const startIndex = (pageNumber - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToRender = watchedList.slice(startIndex, endIndex);
    renderMovies(moviesToRender);
  } else if (activePage === 'Queue') {
    const queueList = getFromStorage('queueList') || [];
    const moviesPerPage = 20;
    const startIndex = (pageNumber - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToRender = queueList.slice(startIndex, endIndex);
    renderMovies(moviesToRender);
  }
}