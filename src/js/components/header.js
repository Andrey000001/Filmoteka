import refs from '../utils/refs';
import { renderAllMovies } from '../render/renderMain';
import { activePage, controlHomeLibrary, setActivePage } from '../utils/state';
import { renderLibraryWatched } from './pagination/pagination';
import { showLogIn } from '../utils/state';
import { conditions } from '../utils/state';
import { changeActivePage } from '../utils/state';
refs.homeBtn.addEventListener('click', handleHomeClick);
refs.libraryBtn.addEventListener('click', handleLibraryClick);
refs.filmotekaTitle.addEventListener('click', onClickFilmoteka);

const queueBtn = document.querySelector('[data-action="queue"]');

if (queueBtn) {
  queueBtn.addEventListener('click', () => {
    queueBtn.classList.add('button--primary');
  });
}
showLogIn();

function onClickFilmoteka() {
  if (activePage === 'Home') return;
  conditions.isOnline = false;
  controlHomeLibrary('home');
  setActivePage('Home');
  changeActivePage();
  renderAllMovies();
}

function handleHomeClick() {
  if (activePage === 'Home') return;
 
  conditions.isOnline = false;
  setActivePage('Home');
  changeActivePage();
  renderAllMovies();
  controlHomeLibrary('home');
}

function handleLibraryClick() {
  if (activePage === 'Library') return;
  setActivePage('Library');
  changeActivePage();
  refs.main.innerHTML = '';
  controlHomeLibrary('library');
  renderLibraryWatched();
}
