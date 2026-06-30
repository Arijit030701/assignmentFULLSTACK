import { useLocalStorage } from '../hooks/useLocalStorage';
import { Sidebar } from './Sidebar'; 
import { TaskBoard } from './TaskBoard';
import { GoalTracker } from './GoalTracker';
import { FocusTimer } from './FocusTimer';
import { MoodBoard } from './MoodBoard';
import { useState } from 'react';

export function Dashboard() {
    // console.log("I AM INSIDE THE DASHBOARD COMPONENT"); 
    const [activeSection, setActiveSection] = useLocalStorage('activeSection', 'tasks');
    const [tasks, setTasks] = useLocalStorage('cipher-tasks', []);
    // console.log("Dashboard Tasks:", tasks);
    return (
        <div style={{ display: 'flex', height: '100vh', border: '5px solid yellow' }}>
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {activeSection === 'tasks' && <TaskBoard tasks={tasks} setTasks={setTasks} />}
                {activeSection === 'goals' && <GoalTracker />}
                {activeSection === 'timer' && <FocusTimer tasks={tasks} />}
                {activeSection === 'mood' && <MoodBoard />}
            </main>
        </div>
    );
}