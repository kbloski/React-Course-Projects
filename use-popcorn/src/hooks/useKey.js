import { useEffect } from "react";

export function useKey(keyCode, action){
    function callback(e){
        if (e.code.toLowerCase() !== keyCode.toLowerCase()) return;
        action?.()
    }

    useEffect( () => {
        document.addEventListener('keydown', callback)
    }, [ action ])

    return () => {
        document.removeEventListener('keydown', callback)
    }
}