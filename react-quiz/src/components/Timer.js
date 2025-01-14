import { useEffect, useState } from "react";

export default function Timer({ dispatch, maxTime }) {
    const [time, setTime] = useState(maxTime)
    const minuts = Math.floor( time / 60)
    const seconds = time % 60

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (time <= 0){
                dispatch({ type: "finish" });
            } 
            else setTime( t => t - 1);
            
            // dispatch({ type: "finish" });
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [ time ]);

    return <div className="timer">
        {String(minuts).padStart(2, '0')} : {String(seconds).padStart(2,'0')}
    </div>;
}
