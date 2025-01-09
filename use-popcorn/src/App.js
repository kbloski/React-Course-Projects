import { useEffect, useState } from "react";
import { tempMovieData, tempWatchedData } from "./store";

const API_KEY = 'c38fbbc8';

const average = (arr) =>
  arr.reduce( (acc, curVal, index, arr) => acc + curVal / arr.length, 0);

export default function App() {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);


    useEffect( () => {
        fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=Interstellar`)
        .then( res => res.json())
        .then( data => setMovies( data.Search)) 
    }, [])

    return (
        <>
            {/* Provide elements */}
            <TheNavigation
                element={
                    <>
                        <Logo />
                        <Search />
                        <NumResults movies={movies} />
                    </>
                }
            ></TheNavigation>

            {/* Provide elements too */}
            <Main>
                <Box>
                    <MoviesList movies={movies} />
                </Box>
                <Box>
                    <SummaryHeader watched={watched} />
                    <WatchedMovieList watched={watched} />
                </Box>
            </Main>
        </>
    );
}

function Main({ children}){
  return <main className="main">
      {children}
  </main>;
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <Button
                className="btn-toggle"
                onClick={() => setIsOpen((open) => !open)}
            >
                {isOpen ? "–" : "+"}
            </Button>
            {isOpen && children}
        </div>
    );
}

function Button({ children, onClick, className }) {
    return (
        <button onClick={onClick} className={className}>
            {children}
        </button>
    );
}

function TheNavigation({ element }){
  
  return <nav className="nav-bar">
          { element}
      </nav>;
}

function Search(){
  const [query, setQuery] = useState("");
  return <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
    />
}

function NumResults({ movies }){
  return   <p className="num-results">
      Found <strong>{movies.length}</strong> results
  </p>
}

function Logo(){
  return <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
  </div>
}

function MoviesList({ movies}){
  return <ul className="list">
    {movies?.map((movie) => <Movie key={movie.imdbID} movie={movie} />)}
  </ul>
}

function Movie({ movie}){
  return <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
          <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
          </p>
      </div>
  </li>;
}

function WatchedMovieList({ watched}){
  return (
      <ul className="list">
          {watched.map((movie) => (
              <WatchedMovie key={movie.imdbID} movie={movie} />
          ))}
      </ul>
  );
}

function WatchedMovie({ movie }){
  return (
      <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
              <p>
                  <span>⭐️</span>
                  <span>{movie.imdbRating}</span>
              </p>
              <p>
                  <span>🌟</span>
                  <span>{movie.userRating}</span>
              </p>
              <p>
                  <span>⏳</span>
                  <span>{movie.runtime} min</span>
              </p>
          </div>
      </li>
  );
}



function SummaryHeader({ watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return <div className="summary">
          <h2>Movies you watched</h2>
          <div>
              <p>
                  <span>#️⃣</span>
                  <span>{watched.length} movies</span>
              </p>
              <p>
                  <span>⭐️</span>
                  <span>{avgImdbRating}</span>
              </p>
              <p>
                  <span>🌟</span>
                  <span>{avgUserRating}</span>
              </p>
              <p>
                  <span>⏳</span>
                  <span>{avgRuntime} min</span>
              </p>
          </div>
      </div>
}