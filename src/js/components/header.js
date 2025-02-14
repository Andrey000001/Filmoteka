import refs from '../utils/refs';
import { renderAllMovies } from '../render/renderMain';
import { renderLibraryMovies } from '../render/renderMain';
function showeActions(isActive) {
  refs.searchMovie.style.display = isActive ? 'none' : 'flex';
  refs.libraryControls.style.display = isActive ? 'flex' : 'none';
}
console.log(refs);
refs.homeBtn.addEventListener('click', handleHomeClick);
refs.libraryBtn.addEventListener('click', handleLibraryClick);

let activePage = 'Home';

function handleHomeClick() {
  if (activePage === 'Home') return;
  renderAllMovies();
  refs.homeBtn.classList.add('is-active');
  refs.libraryBtn.classList.remove('is-active');
  if (activePage === 'Home') return;
  activePage = 'Home';
  showeActions(false);
}

function handleLibraryClick() {
  refs.main.innerHTML = '';
  refs.libraryBtn.classList.add('is-active');
  refs.homeBtn.classList.remove('is-active');
  if (activePage === 'Library') return;
  activePage = 'Library';
  showeActions(true);
  renderLibraryMovies();
}
