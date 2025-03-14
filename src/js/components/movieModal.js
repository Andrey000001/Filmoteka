import refs from '../utils/refs';
import { fetchMovieByIdWithGenres, fetchVideoByMovie } from '../api/moviesApi';
import modalRenderEl from '../../templates/modalMovie.hbs';
import { saveToStorage, getFromStorage } from '../utils/storage';
import Button from './Button/Button';
import { conditions } from '../utils/state';

refs.backdrop.addEventListener('click', onModalClick);
refs.modalClose.addEventListener('click', onModalClose);

function onModalClick(e) {
  if (e.target.classList === e.currentTarget.classList) {
    document.body.classList.remove('no-scroll');
    refs.backdrop.classList.remove('is-open');
  }
}

function onModalClose() {
  refs.backdrop.classList.remove('is-open');
  refs.homeBtn.classList.add('is-active');
}

document.addEventListener('click', onClickMovie);

export async function onClickMovie(e) {
  const movieEl = e.target.closest('[data-press="movie"]');

  if (movieEl) {
    try {
      const data = await fetchMovieByIdWithGenres(movieEl.id);

      if (!data) {
        throw new Error('No data found');
      }

      const posterPath = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : '../../assets/images/stub/stub.jpg';

      const movieData = {
        ...data,
        poster_path: posterPath
          ? posterPath || backdropPath
          : '../../assets/images/stub/stub.jpg',
        vote_average: data.vote_average
          ? data.vote_average.toFixed(1)
          : 'Unknown',
        popularity: data.popularity ? data.popularity.toFixed(1) : 'Unknown',
        overview:
          data.overview && data.overview.length > 580
            ? data.overview.slice(0, 580) + '...'
            : data.overview,
      };

      const buttonWatch = new Button(
        'ADD TO WATCH',
        'watch',
        'watched'
      ).render();
      const buttonQueue = new Button('ADD TO QUEUE', 'queue', 'queue').render();

      const elementModal = modalRenderEl({
        ...movieData,
        buttons: conditions.isOnline ? '' : buttonWatch + buttonQueue,
      });

      refs.modalContent.innerHTML = elementModal;

      refs.backdrop.classList.add('is-open');
      document.addEventListener('keydown', handelPressButton);

      const addToWatch = document.querySelector('[data-action="watched"]');
      const addToQueue = document.querySelector('[data-action="queue"]');
      const videoByMovie = document.querySelector('.movie-image');

      videoByMovie.addEventListener('click', () => onClickWatchVideo(data.id));

      if (!conditions.isOnline) {
        addToWatch.addEventListener('click', () => onAddToWatch(data));
        addToQueue.addEventListener('click', () => onAddToQueue(data));
      }
    } catch (error) {
      console.error('Error in onClickMovie:', error);
      // Здесь можно добавить отображение сообщения об ошибке в модальном окне
      refs.modalContent.innerHTML =
        '<p>Error loading movie data. Please try again later.</p>';
      refs.backdrop.classList.add('is-open');
    }
  }
}

async function onClickWatchVideo(id) {
  const results = await fetchVideoByMovie(id);

  const trailer = results.find(video => video.type === 'Trailer');

  if (trailer) {
    console.log(trailer);

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    const containerVideo = refs.containerVideo;
    containerVideo.innerHTML = '';
    containerVideo.style.zIndex = 2000;
    containerVideo.classList.add('playing');
    containerVideo.appendChild(iframe);
    refs.backdrop.addEventListener('click', closeVideo);
  }
}

function closeVideo(e) {
  if (e.target.classList === e.currentTarget.classList) {
    refs.containerVideo.innerHTML = '';
    refs.containerVideo.classList.remove('playing');
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
