import { controlSentens } from '../utils/state';

const BASE_URL = 'https://api.themoviedb.org/3';
const option = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzFjMjFjYjNkZTBmMzFmY2NlMmNjZTA0OWUyYzcwYyIsIm5iZiI6MTcwMjEzODA0NC40MTYsInN1YiI6IjY1NzQ5MGJjYmJlMWRkMDBjNDBjMDZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.y17vHfucj7GAogS3QQoD6Z-vnloS3zkI6pvBbONmDpk',
  },
};

const mapMovieData = (movie, genreMap) => {
  let genreNames = [];

  if (Array.isArray(movie.genre_ids)) {
    genreNames = movie.genre_ids.map(id => genreMap.get(id)).filter(Boolean);
  } else if (Array.isArray(movie.genres)) {
    genreNames = movie.genres.map(genre => genre.name);
  } else {
    console.warn('⚠️ Жанры не найдены:', movie);
    genreNames = ['Unknown'];
  }

  if (genreNames.length > 3) {
    genreNames.splice(3, genreNames.length - 3, 'other');
  }
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : movie.first_air_date
      ? movie.first_air_date.slice(0, 4)
      : 'Unknown';

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
      : '../../assets/images/stub/stub.jpg';

  return {
    ...movie,
    imageUrl,
    genreNames,
    title: controlSentens(movie.name || movie.original_title || 'Unknown'),
    release_date: releaseYear,
    id: movie.id || 'defaultId',
  };
};

// Получение всех фильмов за неделю
export const fetchAllMovies = async (page = 1) => {
  const resp = await fetch(
    `${BASE_URL}/trending/all/week?language=en-US&page=${page}`,
    option
  );
  const data = await resp.json();
  return data || [];
};

export const fetchGenres = async () => {
  const resp = await fetch(`${BASE_URL}/genre/movie/list?language=en`, option);
  const { genres } = await resp.json();
  return genres || [];
};

export const fetchMovieById = async id => {
  const resp = await fetch(`${BASE_URL}/movie/${id}`, option);
  return await resp.json();
};

// Поиск фильмов по названию
export const fetchByName = async (query, page = 1) => {
  const resp = await fetch(
    `${BASE_URL}/search/movie?query=${query}&page=${page}`,
    option
  );
  const movies = await resp.json();
  const genres = await fetchGenres();

  if (!movies || !movies.results) {
    console.error('Movies or movies.results is undefined', movies);
    return [];
  }

  const genreMap = new Map(genres.map(g => [g.id, g.name]));

  return {
    total_pages: movies.total_pages,
    results: movies.results.map(movie => mapMovieData(movie, genreMap)),
  };
};

// Получение фильмов с жанрами
export const fetchMovieWithGenres = async (page = 1) => {
  const [movies, genres] = await Promise.all([
    fetchAllMovies(page),
    fetchGenres(),
  ]);

  if (!movies || !movies.results) {
    console.error('Movies or movies.results is undefined', movies);
    return [];
  }

  const genreMap = new Map(genres.map(g => [g.id, g.name]));

  // if (Array.isArray(data) && data.length > 0) {
  //   return data.map(movie => mapMovieData(movie, genreMap));
  // }

  return movies.results.map(movie => mapMovieData(movie, genreMap));
};

// Получение фильмов по нескольким ID с жанрами
export const fetchMoviesByIdsWithGenres = async ids => {
  console.log(ids);

  const [data, genres] = await Promise.all([
    Promise.all(ids.map(id => fetchMovieById(id))),
    fetchGenres(),
  ]);

  const genreMap = new Map(genres.map(g => [g.id, g.name]));
  console.log(genreMap);

  return data.map(movie => mapMovieData(movie, genreMap));
};

// Получение фильма с жанрами по ID
export const fetchMovieByIdWithGenres = async id => {
  const data = await fetchMovieById(id);

  if (!data || !Array.isArray(data.genres)) {
    return { ...data, genreNames: [] };
  }

  const genreMap = new Map(data.genres.map(g => [g.id, g.name]));
  const genreNames = data.genres.map(g => genreMap.get(g.id));

  return { ...data, genreNames };
};

// Получение видео по ID фильма
export const fetchVideoByMovie = async id => {
  try {
    const resp = await fetch(
      `${BASE_URL}/movie/${id}/videos?language=en-US`,
      option
    );

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();
    console.log(data);

    return data.results || [];
  } catch (error) {
    console.error('Error in fetchVideoByMovie:', error);
    return [];
  }
};
