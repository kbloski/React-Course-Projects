import { useEffect, useReducer, useRef, useState } from "react";
import StarRating from "./components/StarRating";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useKey } from "./hooks/useKey";

const average = (arr) =>
    arr.reduce((acc, curVal, index, arr) => acc + curVal / arr.length, 0);

export default function App() {
    const [query, setQuery] = useState('');
    const [movies, isLoading, error] = useMovies(query)
    const { watched, setWatched, addWatched } = useLocalStorageState()


    const [selectedId, setSelectedId] = useState(null);
    function handleSelectMovie(id) {
        setSelectedId(id);
    }

    function handleClearSelectId() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        addWatched( movie )
    }
    
    function handleDeleteWatched( imbdId ){
        const newWatched = watched.filter((movie) => movie.imbdId !== imbdId)
        setWatched( newWatched );
        localStorage.setItem('watched', JSON.stringify( newWatched))
    }

    useEffect( () => {
        handleClearSelectId()
        console.log('test')
    }, [isLoading])

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
    const inputEl = useRef( null)

    
    function onSearch( value ) {
        setQuery( value )
        onSetValue( value );
    }
    
    useKey('enter', () => {
        inputEl.current.focus()
    })


    return (
        <>
            <input
                className="search"
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={e => onSearch( e.target.value )}
                // onBlur={onSearch}
                // onChange={(e) => setQuery(e.target.value)}
                ref={inputEl}
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
    const [isLoading, setIsLoading] = useState(false);
    const existWatched = watched.find((w) => w.imbdId == selectedId);
    
    const countRef= useRef(0)

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
            countRatingDecisions: countRef.current
        };

        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    useEffect( () => {
        if (userRating) countRef.current++;
    }, [userRating])

    useEffect( () => {
        const oldTitle = document.title;
        if (title) document.title = title;

        return () => {
            document.title = oldTitle
        }
    }, [ title])

    useEffect(() => {
        const API_KEY = process.env.REACT_APP_API_KEY;

        async function getMovieData() {
            setIsLoading(true);
            const res = await fetch(
                `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`
            );

            if (!res.ok) throw new Error("Error with get movie.");
            const data = await res.json();

            setMovie(data);
            setIsLoading(false);
        }


        getMovieData();
    }, [selectedId]);

    useKey("Escape", onCloseMovie);

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
