import { useEffect, useState } from "react";

export function useMovies( query){
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
            const API_KEY = process.env.REACT_APP_API_KEY;
            const controller = new AbortController()
    
            async function fetchMovies() {
                
                try {
                    setIsLoading(true);
    
                    const response = await fetch(
                        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
                        { signal: controller.signal }
                    );
    
                    if (!response.ok)
                        throw new Error(
                            "Something went wrong with fetching movies. "
                        );
    
                    const data = await response.json();
    
                    setMovies(data?.Search ?? []);
                    setError('')
                } catch (err) {
                    if (err.name === 'AbortError') return;
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            }

            if (!query) return;
            fetchMovies();
    
            return () => {
                controller.abort()
            }
        }, [query]);


        return [
            movies,
            isLoading,
            error
        ]



}