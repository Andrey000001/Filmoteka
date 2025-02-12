import '../api/moviesApi.js'
import '../render/renderMain.js'
import refs from '../utils/refs.js'
import modalRenderEl from '../../templates/modalMovie.hbs'
import {fetchMovieByIdWithGenres} from '../api/moviesApi.js'

document.addEventListener('click',onClickMovie)

async function onClickMovie(e) { 
    const movieEl = e.target.closest('[data-press="movie"]')
    if(movieEl)  {
        const data = await fetchMovieByIdWithGenres(movieEl.id)
        console.log(data);
        const elementModal = modalRenderEl(data)
        refs.modalContent.innerHTML = elementModal
        refs.backdrop.classList.add('is-open')
        document.addEventListener('keydown',handelPressButton)
    }
}
function handelPressButton(e) {
    if(e.code === 'Escape') {
        console.log('e');
        refs.backdrop.classList.remove('is-open')
        document.removeEventListener('keydown',handelPressButton)
    }
}

