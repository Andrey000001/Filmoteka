import refs from '../utils/refs';
import { fetchMovieByIdWithGenres, fetchVideoByMovie } from '../api/moviesApi';
import modalRenderEl from '../../templates/modalMovie.hbs';
import { saveToStorage, getFromStorage } from '../utils/storage';

refs.backdrop.addEventListener('click', onModalClick);
refs.modalClose.addEventListener('click', onModalClose);
function onModalClick(e) {
  if (e.target.classList === e.currentTarget.classList) {
    refs.backdrop.classList.remove('is-open');
  }
}

function onModalClose() {
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
    const videoByMovie = document.querySelector('.movie-image');
    videoByMovie.addEventListener('click', () => onClickWatchVideo(data.id));
    addToWatch.addEventListener('click', () => onAddToWatch(data));
    addToQueue.addEventListener('click', () => onAddToQueue(data));
  }
}
async function onClickWatchVideo(id) {
  const { results } = await fetchVideoByMovie(id);

  const trailer = results.find(
    video => video.type === 'Trailer' && video.official
  );

  if (trailer) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    const containerVideo = refs.containerVideo;
    containerVideo.innerHTML = '';
    containerVideo.appendChild(iframe);
    // containerVideo.width('100%');
    containerVideo.style.zIndex = 2000;
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
    watchList.push(movieData);
    saveToStorage('watchList', watchList);
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
