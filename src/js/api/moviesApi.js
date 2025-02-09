const BASE_URL = 'https://api.themoviedb.org/3/trending/all/week?language=en-US'; 

const option = { 
    method: 'GET',
    headers: {
        accept:'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzFjMjFjYjNkZTBmMzFmY2NlMmNjZTA0OWUyYzcwYyIsIm5iZiI6MTcwMjEzODA0NC40MTYsInN1YiI6IjY1NzQ5MGJjYmJlMWRkMDBjNDBjMDZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y17vHfucj7GAogS3QQoD6Z-vnloS3zkI6pvBbONmDpk'
    }
}
export const fetchAllMovies = async () => {
    const resp = await fetch(BASE_URL,option)
    const {results} = await resp.json()
    return results || []
}

