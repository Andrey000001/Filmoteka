const BASE_URL = 'https://api.themoviedb.org/3'; 

const option = { 
    method: 'GET',
    headers: {
        accept:'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzFjMjFjYjNkZTBmMzFmY2NlMmNjZTA0OWUyYzcwYyIsIm5iZiI6MTcwMjEzODA0NC40MTYsInN1YiI6IjY1NzQ5MGJjYmJlMWRkMDBjNDBjMDZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y17vHfucj7GAogS3QQoD6Z-vnloS3zkI6pvBbONmDpk'
    }
}
export const fetchAllMovies = async () => {
    const resp = await fetch(`${BASE_URL}/trending/all/week?language=en-US`,option)
    const {results} = await resp.json()
    return results || []
}

export const fetchGenres = async () => {
    const resp = await fetch(`${BASE_URL}/genre/movie/list?language=en`,option)
    const {genres} = await resp.json()
    return genres || []
}
export const fetchMovieById = async (id) => {
    const resp = await fetch(`${BASE_URL}/movie/${id}`,option)
    const data = await resp.json()
    return data

}
export const fetchMovieWithGenres = async() => {
    const [movies,genres] = await Promise.all([fetchAllMovies(),fetchGenres()])
    const genreMap = new Map(genres.map(g => [g.id ,g.name]))
    return movies.map(movie => ({ ...movie ,
        genreNames: movie.genre_ids.map(id => genreMap.get(id) || 'Unknown').join(', '),
        release_date: movie.release_date ? movie.release_date.slice(0,4) : 'Unknown',
        id: movie.id || 'defaultId'
    }))
}

export const fetchMovieByIdWithGenres = async(id) => {
    const data = await fetchMovieById(id)
    if(!data || !Array.isArray(data.genres)) {
        return {...data,genreNames: []}
    }
    const genreMap = new Map(data.genres.map(g => [g.id ,g.name]))
    const genreNames = data.genres.map(g => genreMap.get(g.id))
    return {...data,genreNames}
}

