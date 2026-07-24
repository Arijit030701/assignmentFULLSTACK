import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import axios from 'axios';

export function FocusTimer({ tasks, token }) {
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const INITIAL_TIME = 10;
    const { secondsRemaining, isRunning, start, pause, reset } = useTimer(INITIAL_TIME);

    // Track when the timer session started
    const [startTime, setStartTime] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        if (secondsRemaining === 0 && startTime) {
            handleCompleteSession();
        }
    }, [secondsRemaining]);

    const handleStart = () => {
        setStartTime(new Date()); // Record exact start time
        start();
    };

    const handleCompleteSession = async () => {
        const endTime = new Date();
        // const durationMinutes = Math.round((INITIAL_TIME - secondsRemaining) / 60);

        const durationMinutes = 1;
        if (durationMinutes < 1) return; // Don't save if less than a minute

        try {
            await axios.post('http://localhost:3000/api/focus', {
                duration: durationMinutes,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString()
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Focus session saved successfully!");
            fetchAnalytics();
        } catch (error) {
            console.error("Backend Error:", error.response?.data || error.message);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/focus/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        }
    };

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
                    <button onClick={handleStart} style={{ padding: '10px 20px', cursor: 'pointer' }}>Start</button>
                ) : (
                    <button onClick={pause} style={{ padding: '10px 20px', cursor: 'pointer' }}>Pause</button>
                )}
                <button onClick={reset} style={{ padding: '10px 20px', cursor: 'pointer' }}>Reset</button>
            </div>

            <hr style={{ borderColor: '#333', margin: '20px 0' }} />
            <button onClick={fetchAnalytics} style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Load Analytics Stats
            </button>

            {analytics && (
                <div style={{ marginTop: '15px', background: '#222', padding: '12px', borderRadius: '6px', textAlign: 'left' }}>
                    <p><strong>Total Sessions Completed:</strong> {analytics.totalSessions}</p>
                    <p><strong>Total Minutes Focused:</strong> {analytics.totalMinutesFocused} mins</p>
                </div>
            )}

        </div>
    );
}