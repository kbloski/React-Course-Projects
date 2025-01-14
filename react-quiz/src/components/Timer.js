import { useEffect, useState } from "react";

export default function Timer({ dispatch, maxTime }) {
    const [time, setTime] = useState(maxTime)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (time <= 0) dispatch({ type: "finish" });
            else setTime( t => t - 1);
            
            // dispatch({ type: "finish" });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return <div className="timer">🕛{time} sec</div>;
}
