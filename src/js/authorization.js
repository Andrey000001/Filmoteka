import { initializeApp } from 'firebase/app';
import refs from './utils/refs';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

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

const loginForm = document.getElementById('login-form');
const signUpForm = document.getElementById('signup-form');
const logoutForm = document.getElementById('log-out');
const backdropAuth = document.querySelector('.backdrop-auth');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');

refs.startLogin.addEventListener('click', () => {
  backdropAuth.classList.add('active');
});
// Переключение между формами "Log In" и "Sign Up"
switchToSignup.addEventListener('click', function (e) {
  e.preventDefault();
  loginForm.style.display = 'none';
  signUpForm.style.display = 'block';
});

switchToLogin.addEventListener('click', function (e) {
  e.preventDefault();
  signUpForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Регистрация нового пользователя
signUpForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const password = document.getElementById('signup-password').value;
  const email = document.getElementById('signup-email').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Registration successful!');
      signUpForm.reset();
      backdropAuth.classList.remove('active');
      return signOut(auth);
    })
    .catch(error => {
      loginForm.reset();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Registration failed: ' + errorMessage);
    });
});

// Вход пользователя
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Login successful!');
      loginForm.reset();
      backdropAuth.classList.remove('active');
    })
    .catch(error => {
      loginForm.reset();
      const errorCode = error.code;
      const errorMessage = error.message;
      alert('Login failed: ' + errorMessage);
    });
});

// Выход пользователя
logoutForm.addEventListener('submit', function (e) {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      alert('Logout successful!');
      backdropAuth.classList.remove('active');
    })
    .catch(error => {
      alert('Logout failed: ' + error.message);
    });
});

onAuthStateChanged(auth, user => {
  if (user) {
    loginForm.style.display = 'none';
    signUpForm.style.display = 'none';
    logoutForm.style.display = 'block';
    refs.startLogin.style.display = 'none';
    refs.libraryBtn.style.display = 'inline-block';
  } else {
    loginForm.style.display = 'block';
    signUpForm.style.display = 'none';
    logoutForm.style.display = 'none';
    refs.libraryBtn.style.display = 'none';
    refs.startLogin.style.display = 'flex';
  }
});

// Открытие модального окна
refs.startLogin.addEventListener('click', function () {
  backdropAuth.classList.add('active');
});
