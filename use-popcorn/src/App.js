import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";

const average = (arr) =>
    arr.reduce((acc, curVal, index, arr) => acc + curVal / arr.length, 0);

export default function App() {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [query, setQuery] = useState("interstellar");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    function handleSelectMovie(id) {
        setSelectedId(id);
    }

    function handleClearSelectId() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        const existMovie = watched.find(
            (watched) => watched.imbdId == movie.imbdId
        );

        if (!existMovie) return setWatched((watched) => [...watched, movie]);

        setWatched((watched) =>
            watched.map((w) => {
                if (w.imbdId !== existMovie.imbdId) return w;
                return { ...w, ...movie };
            })
        );
    }

    function handleDeleteWatched( imbdId ){
        setWatched( watched =>
            watched.filter((movie) => movie.imbdId !== imbdId)
        );
    }

    useEffect( () => {
        if (!selectedId) document.title = 'UsePopcorn'
    }, [selectedId])

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_API_KEY;

        async function fetchMovies() {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
                );

                if (!response.ok)
                    throw new Error(
                        "Something went wrong with fetching movies. "
                    );

                const data = await response.json();

                setMovies(data?.Search ?? []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (!query) return;
        fetchMovies();
    }, [query]);

    return (
        <>
            {/* Provide elements */}
            <TheNavigation
                element={
                    <>
                        <Logo />
                        <Search onSetValue={setQuery} />
                        <NumResults movies={movies} />
                    </>
                }
            ></TheNavigation>

            {/* Provide elements too */}
            <Main>
                <Box>
                    {isLoading && !error && <Loader />}
                    {!isLoading && !error && (
                        <MoviesList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    )}
                    {!isLoading && error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {!selectedId && (
                        <>
                            <SummaryHeader watched={watched} />
                            <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched}/>
                        </>
                    )}
                    {!!selectedId && (
                        <>
                            <MovieDetails
                                watched={watched}
                                selectedId={selectedId}
                                onCloseMovie={handleClearSelectId}
                                onAddWatched={handleAddWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

function Main({ children }) {
    return <main className="main">{children}</main>;
}

function ErrorMessage({ message }) {
    return (
        <p className="error">
            <span> 🛑 </span> {message}
        </p>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
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

function TheNavigation({ element }) {
    return <nav className="nav-bar">{element}</nav>;
}

function Search({ onSetValue }) {
    const [query, setQuery] = useState("");

    function onSearch() {
        onSetValue(query);
    }

    return (
        <>
            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={query}
                onBlur={onSearch}
                onChange={(e) => setQuery(e.target.value)}
            />
        </>
    );
}

function NumResults({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}

function MoviesList({ movies, onSelectMovie }) {
    return (
        <ul className="list">
            {movies?.map((movie) => (
                <Movie
                    key={movie.imdbID}
                    movie={movie}
                    onSelectMovie={onSelectMovie}
                />
            ))}
        </ul>
    );
}

function Movie({ movie, onSelectMovie }) {
    return (
        <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
    return (
        <ul className="list">
            {watched.map((movie) => (
                <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} />
            ))}
        </ul>
    );
}

function WatchedMovie({ movie, onDeleteWatched }) {
    function handleDeleteWatched(){
        onDeleteWatched(movie.imbdId);
    }

    return (
        <li key={movie.imdbID}>
            <img src={movie.poster} alt={`${movie.title} poster`} />
            <h3>{movie.title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imbdRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>

                <button
                    className="btn-delete"
                    onClick={handleDeleteWatched}
                ></button>
            </div>
        </li>
    );
}

function SummaryHeader({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));

    return (
        <div className="summary">
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
    );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
    const [movie, setMovie] = useState({});
    const [userRating, setUserRating] = useState("");

    const existWatched = watched.find((w) => w.imbdId == selectedId);

    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movie;

    const [isLoading, setIsLoading] = useState(false);

    function handleCloseMovie() {
        onCloseMovie();
    }

    function handleAdd() {
        const newWatchedMovie = {
            imbdId: selectedId,
            title,
            year,
            poster,
            userRating,
            imbdRating: Number(imdbRating),
            runtime: Number(runtime.split(" ")[0]),
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_API_KEY;

        async function getMovieData() {
            setIsLoading(true);
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
            );

            if (!res.ok) throw new Error("Error with get movie.");
            const data = await res.json();

            if (data?.Title) document.title = data?.Title;

            setMovie(data);
            setIsLoading(false);
        }


        getMovieData();
    }, [selectedId]);

    return (
        <div className="details">
            {!!isLoading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button className="btn-back" onClick={handleCloseMovie}>
                            &larr;
                        </button>
                        {!!poster && <img src={poster} alt="Poster of movie" />}
                        <div className="details-overview">
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐</span>
                                {imdbRating} IMBD rating
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            {!existWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className="btn-add"
                                            onClick={handleAdd}
                                        >
                                            Add to list
                                        </button>
                                    )}
                                </>
                            ): <p>You raited with movie { existWatched?.userRating} ⭐</p>}
                        </div>
                        <p>
                            <em> {plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
