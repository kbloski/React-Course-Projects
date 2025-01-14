import { useEffect, useState } from "react";

export function useQuestions( ){
    const [questions, setQuestions] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [error, setError] = useState(null)

    useEffect( () => {
        setIsLoading( true );
        fetch("/api/questions.json")
        .then((res) => {
            if (!res.ok) throw new Error("Error load questions");
            return res.json();
        })
        .then((data) => setQuestions( data?.questions )
        )
        .catch((err) => {
            setError( err.message)
            console.error(err);
        })
        .finally( () => setIsLoading(false));
    }, [])

    return {
        questions,
        isLoading,
        error
    }
}