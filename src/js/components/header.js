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
  refs.searchMovie.style.display = isActive ? 'inline-block' : 'none';
  refs.libraryControls.style.display = isActive ? 'inline-block' : 'none';
}

function handleHomeClick() {
  if (activePage === 'Home') return;

  setActivePage('Home');
  renderAllMovies();
  refs.homeBtn.classList.add('is-active');
  refs.libraryBtn.classList.remove('is-active');
  showeActions(false);
}
function handleLibraryClick() {
  if (activePage === 'Library') return;

  refs.main.innerHTML = '';
  refs.libraryBtn.classList.add('is-active');
  refs.homeBtn.classList.remove('is-active');

  setActivePage('Library');
  showeActions(true);

  setActivePage('Watched');
  renderLibraryWatched();
}
