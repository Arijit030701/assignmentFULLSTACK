import { useState, useEffect } from 'react';

export function useTimer(initialSeconds = 1500){
    const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() =>  {
        let intervalId;
        if(isRunning && secondsRemaining > 0){
            intervalId = setInterval(() => {
                setSecondsRemaining((prev) => prev - 1);
            }, 1000);
        }

        else if (secondsRemaining === 0) {
            setIsRunning(false);
        }

        return () => {
            clearInterval(intervalId);
        };
    }, [isRunning, secondsRemaining]);

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = () => {
        setIsRunning(false);
        setSecondsRemaining(initialSeconds);
    };

    return { secondsRemaining, isRunning, start, pause, reset };
}