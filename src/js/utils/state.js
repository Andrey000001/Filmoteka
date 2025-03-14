import refs from './refs';
export let activePage = 'Home';

const conditions = {
  _isOnline: false,
  get isOnline() {
    return this._isOnline;
  },
  set isOnline(value) {
    this._isOnline = value;
  },
};

export { conditions };

export function setActivePage(page) {
  activePage = page;
}

export function getActivePage() {
  return activePage;
}
export function changeActivePage(activePage) {
  if (activePage === 'Home') {
    refs.homeBtn.classList.add('is-active');
    refs.libraryBtn.classList.remove('is-active');
    refs.logInItem.classList.remove('is-active');
  }
}
export function controlSentens(sentens) {
  if (sentens.length > 32) {
    const title = sentens.slice(0, 25).concat('...');
    return title;
  } else {
    return sentens;
  }
}

export function showLogOut() {
  refs.logInItem.classList.add('is-hidden');
  refs.logOutItem.classList.remove('is-hidden');
  refs.libraryItem.classList.remove('is-hidden');
  refs.logoutBtn.classList.remove('action-log-out');
}
export function showLogIn() {
  refs.logInItem.classList.remove('is-hidden');
  refs.logOutItem.classList.add('is-hidden');
  refs.libraryItem.classList.add('is-hidden');
  refs.logoutBtn.classList.add('action-log-out');
}

export function controlHomeLibrary(type) {
  console.log(type);
  if (type === 'home') {
    refs.libraryControls.classList.add('is-hidden');
    refs.searchMovie.classList.remove('is-hidden');
  } else {
    refs.libraryControls.classList.remove('is-hidden');
    refs.searchMovie.classList.add('is-hidden');
  }
}

export function switchToLogin() {
  refs.singUpForm.classList.add('is-hidden');
  refs.loginForm.classList.remove('is-hidden');
}

export function switchToSingUp() {
  refs.loginForm.classList.add('is-hidden');
  refs.singUpForm.classList.remove('is-hidden');
}
