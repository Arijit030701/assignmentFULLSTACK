import { useTimer } from '../hooks/useTimer';

export function FocusTimer() {

    const { secondsRemaining, isRunning, start, pause, reset } = useTimer(1500);

    
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#111', color: '#fff', textAlign: 'center', marginTop: '20px' }}>
            <h2>Focus Timer</h2>
            
            
            <div style={{ fontSize: '3rem', fontFamily: 'monospace', margin: '20px 0' }}>
                {formatTime(secondsRemaining)}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {!isRunning ? (
                    <button onClick={start} style={{ padding: '10px 20px', cursor: 'pointer' }}>Start</button>
                ) : (
                    <button onClick={pause} style={{ padding: '10px 20px', cursor: 'pointer' }}>Pause</button>
                )}
                <button onClick={reset} style={{ padding: '10px 20px', cursor: 'pointer' }}>Reset</button>
            </div>
        </div>
    );
}