import { fetchAllMovies } from '../api/moviesApi';
import refs from '../utils/refs';
import mainTpl from '../../templates/main.hbs';

renderAllMovies();

async function renderAllMovies() {
    const movies = await fetchAllMovies();
    const result = mainTpl(movies)
    refs.main.innerHTML = result
}

