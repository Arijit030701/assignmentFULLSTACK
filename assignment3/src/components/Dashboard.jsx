import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Sidebar } from './Sidebar'; 
import { TaskBoard } from './TaskBoard';
import { GoalTracker } from './GoalTracker';
import { FocusTimer } from './FocusTimer';
import { MoodBoard } from './MoodBoard';
import { Navbar } from './Navbar';
import { AIBuilder } from './AIBuilder';
import MagicButton from './MagicButton';
import { DynamicRenderer } from './DynamicRenderer';

// 1. Accept setToken as a prop so we can pass it to the Navbar
export function Dashboard({ token, setToken }) {
    // UI state can stay in local storage
    const [activeSection, setActiveSection] = useLocalStorage('activeSection', 'tasks');
    
    // Change tasks to standard useState
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);

    // Fetch tasks from the backend on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data);

                const goalsRes = await axios.get('http://localhost:3000/api/goals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGoals(goalsRes.data);
            } catch (error) {
                console.error("Failed to fetch tasks from database:", error);
            }
        };

        // Only try to fetch if we actually have a token
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <div style={{ display: 'flex', height: '100vh', border: '5px solid yellow' }}>
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {/* 2. Add the Navbar at the very top of your main content area */}
                <Navbar setToken={setToken} />

                {activeSection === 'tasks' && (
                    <>
                    <MagicButton />  
                    <TaskBoard tasks={tasks} setTasks={setTasks} token={token} />
                    </>
                )}
                
                {activeSection === 'goals' && (
                    <GoalTracker goals={goals} setGoals={setGoals} token={token} />
                )}
                
                {/* 3. Added the token prop here so your FocusTimer can save sessions! */}
                {activeSection === 'timer' && (
                    <FocusTimer tasks={tasks} token={token} />
                )}

                {activeSection === 'mood' && <MoodBoard />}
                
                {activeSection === 'ai' && (
                    <>
                        <AIBuilder token={token} />
                        <h3 style={{ marginTop: '30px' }}>Live AI-Generated Features</h3>
                        <DynamicRenderer />
                    </>
                )}


            </main>
        </div>
    );
}