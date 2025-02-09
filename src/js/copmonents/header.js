import refs from '../utils/refs'

function showeActions(isActive) {
    refs.searchMovie.style.display = isActive ? 'none' : 'flex'
    refs.libraryControls.style.display = isActive ? "flex" : 'none';
   
}

refs.homeBtn.addEventListener('click',handleHomeClick)
refs.libraryBtn.addEventListener('click',handleLibraryClick)
let activePage = 'Home';

function handleHomeClick() {
    refs.homeBtn.classList.add('is-active')
    refs.libraryBtn.classList.remove('is-active')
    if(activePage === 'Home') return  
    console.log('a');
    activePage = 'Home'
    showeActions(false)
}

function handleLibraryClick() {
    refs.libraryBtn.classList.add('is-active')
    refs.homeBtn.classList.remove('is-active')
    if(activePage === 'Library') return 
    console.log('d');
 activePage = 'Library';
 showeActions(true)
  
}