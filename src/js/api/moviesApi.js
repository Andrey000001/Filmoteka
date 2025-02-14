const BASE_URL = 'https://api.themoviedb.org/3';

const option = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzFjMjFjYjNkZTBmMzFmY2NlMmNjZTA0OWUyYzcwYyIsIm5iZiI6MTcwMjEzODA0NC40MTYsInN1YiI6IjY1NzQ5MGJjYmJlMWRkMDBjNDBjMDZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y17vHfucj7GAogS3QQoD6Z-vnloS3zkI6pvBbONmDpk',
  },
};

// fetchAllMovies
export const fetchAllMovies = async (page = 1) => {
  const resp = await fetch(
    `${BASE_URL}/trending/all/week?language=en-US&page=${page}`,
    option
  );
  const data = await resp.json();
  return data || [];
};

//fetchGenres
export const fetchGenres = async () => {
  const resp = await fetch(`${BASE_URL}/genre/movie/list?language=en`, option);
  const { genres } = await resp.json();
  return genres || [];
};
//fetchMovieById
export const fetchMovieById = async id => {
  const resp = await fetch(`${BASE_URL}/movie/${id}`, option);
  const data = await resp.json();
  return data;
};

// fetchMovieWithGenres
export const fetchMovieWithGenres = async page => {
  const [movies, genres] = await Promise.all([
    fetchAllMovies(page),
    fetchGenres(),
  ]);
  const { results } = movies;
  if (!movies || !results) {
    console.error('Movies or movies.results is undefined', movies);
    return [];
  }
  const genreMap = new Map(genres.map(g => [g.id, g.name]));

  return results.map(movie => {
    const genreNames = Array.isArray(movie.genre_ids)
      ? movie.genre_ids.map(id => genreMap.get(id))
      : 'Unknown';
    return {
      ...movie,
      genreNames,
      release_date: movie.release_date
        ? movie.release_date.slice(0, 4)
        : 'Unknown',
      id: movie.id || 'defaultId',
    };
  });
};

//fetchMovieByIdWithGenres
export const fetchMovieByIdWithGenres = async id => {
  const data = await fetchMovieById(id);
  if (!data || !Array.isArray(data.genres)) {
    return { ...data, genreNames: [] };
  }
  const genreMap = new Map(data.genres.map(g => [g.id, g.name]));
  const genreNames = data.genres.map(g => genreMap.get(g.id));
  return { ...data, genreNames };
};

export async function fetchByName(query, page = 1) {
  const response = await fetch(
    `${BASE_URL}/search/movie?query=${query}&page=${page}`,
    option
  );
  return response.json();
}
