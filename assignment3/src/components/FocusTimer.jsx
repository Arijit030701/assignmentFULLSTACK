import { useState } from 'react';
import { useTimer } from '../hooks/useTimer';

export function FocusTimer({ tasks }) {
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const { secondsRemaining, isRunning, start, pause, reset } = useTimer(1500);

    // 1. Get the list of incomplete tasks for the dropdown
    const incompleteTasks = tasks ? tasks.filter(t => !t.isCompleted) : [];

    // 2. Find the task object if one is selected
    const selectedTask = tasks ? tasks.find(t => t.id === selectedTaskId) : null;

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '8px', background: '#111', color: '#fff', textAlign: 'center', marginTop: '20px' }}>
            <h2>Focus Timer</h2>

            {/* Dropdown for incomplete tasks */}
            <div style={{ marginBottom: '20px' }}>
                <select 
                    value={selectedTaskId} 
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    style={{ padding: '10px', width: '80%', borderRadius: '4px', background: '#222', color: '#fff', cursor: 'pointer' }}
                >
                    <option value="">Select a task to focus on...</option>
                    {incompleteTasks.map(task => (
                        <option key={task.id} value={task.id}>
                            {task.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Status Display */}
            {selectedTask ? (
                <div style={{ margin: '10px 0', color: '#66b3ff', fontWeight: 'bold' }}>
                    Focusing on: {selectedTask.title}
                </div>
            ) : (
                <div style={{ margin: '10px 0', color: '#888' }}>
                    No task selected
                </div>
            )}
            
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