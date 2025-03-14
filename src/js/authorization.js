import { initializeApp } from 'firebase/app';
import refs from './utils/refs';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { renderLibraryWatched } from './components/pagination/pagination';
import { renderAllMovies } from './render/renderMain';
import { setActivePage, showLogOut } from './utils/state';
import { switchToLogin, switchToSingUp, getActivePage } from './utils/state';
import { controlHomeLibrary } from './utils/state';
import { showLogIn } from './utils/state';
import Button from './components/Button/Button';
import { conditions } from './utils/state';

const firebaseConfig = {
  apiKey: 'AIzaSyCk-EdRYRv75Rpw5G8wiAanZ1QdyXFLsl0',
  authDomain: 'movie-app-a278e.firebaseapp.com',
  projectId: 'movie-app-a278e',
  storageBucket: 'movie-app-a278e.appspot.com',
  messagingSenderId: '623136315665',
  appId: '1:623136315665:web:8e52be3810c39adf3494b0',
  measurementId: 'G-8YKK2YPHJB',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

refs.backdropAuth.addEventListener('click', onModalClose);
refs.switchToSingUpBtn.addEventListener('click', switchToSingUp);
refs.switchToLogInBtn.addEventListener('click', switchToLogin);

refs.logInItem.addEventListener('click', () => {
  refs.backdropAuth.classList.add('active');
  switchToLogin();
});

function onModalClose(e) {
  if (e.target.classList === e.currentTarget.classList) {
    refs.backdropAuth.classList.remove('active');
  }
}
refs.singUpForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const password = document.getElementById('signup-password').value;
  const email = document.getElementById('signup-email').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Registration successful!');
      refs.singUpForm.reset();
      switchToLogin();
    })
    .catch(error => {
      refs.loginForm.reset();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Registration failed: ' + errorMessage);
    });
});

refs.loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const buttonWatch = new Button('ADD TO WATCH', 'watch', 'watched').render();
  const buttonQueue = new Button('ADD TO QUEUE', 'queue', 'queue').render();

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      conditions.isOnline = true;
      refs.libraryControls.innerHTML = buttonWatch + buttonQueue;
      const watchedBtn = document.querySelector('[data-action="watched"]');
      watchedBtn.classList.add('button--primary');
      refs.libraryBtn.classList.add('is-active');
      refs.homeBtn.classList.remove('is-active');
      setActivePage('Library');
      controlHomeLibrary('library');
      renderLibraryWatched();
      refs.backdropAuth.classList.remove('active');
      showLogOut();
      const user = userCredential.user;
      alert('Login successful!');
    })
    .catch(error => {
      refs.loginForm.reset();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Login failed: ' + errorMessage);
    });
});

refs.logOutItem.addEventListener('click', function (e) {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      conditions.isOnline = false;
      renderAllMovies();
      setActivePage('Home');
      showLogIn();
      alert('Logout successful!');
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);
    });
});
