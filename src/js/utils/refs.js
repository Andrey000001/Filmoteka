export default {
  //HEADER
  homeBtn: document.querySelector('[data-action="Home"]'),
  searchMovie: document.querySelector('[data-serch="movie"]'),
  libraryControls: document.querySelector('#library-controls'),
  filmotekaTitle: document.querySelector('[data-click="Filmoteka"]'),
  libraryBtn: document.querySelector('[data-action="Library"]'),
  libraryItem: document.querySelector('.library-item'),
  //actions Header
  logInItem: document.querySelector('.logInItem'),
  logOutItem: document.querySelector('.logOutItem'),
  watched: document.querySelector('.watch'),
  queue: document.querySelector('.queue'),

  //MAIN
  main: document.querySelector('#main'),

  //MODAL-MOVIE
  backdrop: document.querySelector('.backdrop'),
  modalContent: document.querySelector('.modal-content'),
  submitMovieByName: document.querySelector('#searchMovieByName'),
  movieName: document.querySelector('[name="movieName"]'),
  //PAGINATION
  prevPage: document.querySelector('#prevPage'),
  nextPage: document.querySelector('#nextPage'),
  modalClose: document.querySelector('[data-modal="close"]'),
  containerVideo: document.querySelector('#movie-video'),
  //Auth
  loginForm: document.querySelector('.login-form'),
  singUpForm: document.querySelector('.singup-form'),
  switchToSingUpBtn: document.getElementById('switch-to-signup'),
  switchToLogInBtn: document.getElementById('switch-to-login'),
  logoutBtn: document.getElementById('log-out'),

  backdropAuth: document.querySelector('.backdrop-auth'),
};
