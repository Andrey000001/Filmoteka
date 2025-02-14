import refs from '../utils/refs';
import { fetchMovieByIdWithGenres } from '../api/moviesApi';
import modalRenderEl from '../../templates/modalMovie.hbs';
import { saveToStorage, getFromStorage } from '../utils/storage';

refs.backdrop.addEventListener('click', onModalClick);
refs.modalClose.addEventListener('click', onModalClose);
function onModalClick(e) {
  if (e.target.classList === e.currentTarget.classList) {
    refs.backdrop.classList.remove('is-open');
  }
}

function onModalClose(e) {
  refs.backdrop.classList.remove('is-open');
}
document.addEventListener('click', onClickMovie);

async function onClickMovie(e) {
  const movieEl = e.target.closest('[data-press="movie"]');
  if (movieEl) {
    const data = await fetchMovieByIdWithGenres(movieEl.id);
    const elementModal = modalRenderEl(data);
    refs.modalContent.innerHTML = elementModal;
    refs.backdrop.classList.add('is-open');
    document.addEventListener('keydown', handelPressButton);
    const addToWatch = document.querySelector('[data-action="addToWatch"]');
    const addToQueue = document.querySelector('[ data-action="addToQueue"]');
    addToWatch.addEventListener('click', () => onAddToWatch(data));
    addToQueue.addEventListener('click', () => onAddToQueue(data));
  }
}
function handelPressButton(e) {
  if (e.code === 'Escape') {
    refs.backdrop.classList.remove('is-open');
    document.removeEventListener('keydown', handelPressButton);
  }
}

function onAddToWatch(movieData) {
  const watchList = getFromStorage('watchList');
  const isMovieInList = watchList.some(movie => movie.id === movieData.id);
  if (!isMovieInList) {
    watchList.push(movieData); // Получаем данные фильма (например, из модального окна или API) // Добавляем фильм в список
    saveToStorage('watchList', watchList); // Сохраняем обновленный список
    alert('Фильм добавлен в "Watch"');
  } else {
    alert('Фильм уже в списке "Watch"');
  }
}

function onAddToQueue(movieData) {
  const queueList = getFromStorage('queueList');
  const isMovieInList = queueList.some(movie => movie.id === movieData.id);

  if (!isMovieInList) {
    queueList.push(movieData);
    saveToStorage('queueList', queueList);
    alert('Фильм добавлен в "Queue"');
  } else {
    alert('Фильм уже в списке "Queue"');
  }
}
