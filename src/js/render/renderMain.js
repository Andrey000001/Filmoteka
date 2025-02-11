import {fetchMovieWithGenres } from '../api/moviesApi';
import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';

renderAllMovies()

async function renderAllMovies() {
    const moviesDetails= await fetchMovieWithGenres();
    const result = mainTpl(moviesDetails)
    refs.main.innerHTML = result
    
}

