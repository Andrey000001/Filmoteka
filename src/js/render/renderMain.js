import {fetchMovieWithGenres } from '../api/moviesApi';
import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';

renderAllMovies()

async function renderAllMovies() {
    const moviesDetails = await fetchMovieWithGenres();
    console.log(moviesDetails);
    const result = mainTpl(moviesDetails)
    console.log(refs.main);
    refs.main.innerHTML = result
    
}

