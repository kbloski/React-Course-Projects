import { useState , useEffect } from "react"

export function useLocalStorageState(){
    const [watched, setWatched] = useState([])

    useEffect( () => {
        const items = localStorage.getItem('watched')
        if (!items) return;
        setWatched( JSON.parse(items) )
    }, [])

    function addWatched( movie ){

        const existMovie = watched.find(
                (watched) => watched.imbdId == movie.imbdId
            );
    
            if (!existMovie) setWatched((watched) => [...watched, movie]);
            else {
                setWatched((watched) =>
                    watched.map((w) => {
                        if (w.imbdId !== existMovie.imbdId) return w;
                        return { ...w, ...movie };
                    })
                );
            }
    
            localStorage.setItem('watched', JSON.stringify( [...watched, movie]))
    }


    return {
        watched, 
        setWatched,
        addWatched
    }
}