import refs from '../utils/refs';
import { renderAllMovies } from '../render/renderMain';
import { activePage, setActivePage, getActivePage } from '../utils/state';
import {
  renderLibraryQueue,
  renderLibraryWatched,
} from './pagination/pagination';
refs.homeBtn.addEventListener('click', handleHomeClick);
refs.libraryBtn.addEventListener('click', handleLibraryClick);
refs.watched.addEventListener('click', onClickWatched);
refs.quequ.addEventListener('click', onClickQueue);

function onClickWatched() {
  renderLibraryWatched();
}
function onClickQueue() {
  renderLibraryQueue();
}
function showeActions(isActive) {
  refs.searchMovie.style.display = isActive ? 'none' : 'flex';
  refs.libraryControls.style.display = isActive ? 'flex' : 'none';
}

function handleHomeClick() {
  if (activePage === 'Home') return;

  setActivePage('Home'); // Обновляем activePage
  renderAllMovies(); // Рендерим все фильмы
  refs.homeBtn.classList.add('is-active');
  refs.libraryBtn.classList.remove('is-active');
  showeActions(false);
}
function handleLibraryClick() {
  if (activePage === 'Library') return;

  refs.main.innerHTML = '';
  refs.libraryBtn.classList.add('is-active');
  refs.homeBtn.classList.remove('is-active');

  setActivePage('Library'); // Обновляем activePage
  showeActions(true);

  // По умолчанию показываем фильмы из "Watched"
  setActivePage('Watched');
  renderLibraryWatched();
}
