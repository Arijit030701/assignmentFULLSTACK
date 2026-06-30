import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskBoard } from './TaskBoard';
import { GoalTracker } from './GoalTracker';
import { FocusTimer } from './FocusTimer';
import { MoodBoard } from './MoodBoard';

export function Dashboard() {
    
    const [activeSection, setActiveSection] = useLocalStorage('activeSection', 'tasks');

    
    const navButtonStyle = (section) => ({
        padding: '10px 20px',
        marginBottom: '5px',
        cursor: 'pointer',
        backgroundColor: activeSection === section ? '#333' : 'transparent',
        color: 'white',
        border: 'none',
        textAlign: 'left',
        borderRadius: '5px'
    });

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar Navigation */}
            <nav style={{ width: '200px', background: '#111', padding: '20px', borderRight: '1px solid #333' }}>
                <h2>Menu</h2>
                <button style={navButtonStyle('tasks')} onClick={() => setActiveSection('tasks')}>Tasks</button>
                <button style={navButtonStyle('goals')} onClick={() => setActiveSection('goals')}>Goals</button>
                <button style={navButtonStyle('timer')} onClick={() => setActiveSection('timer')}>Focus Timer</button>
                <button style={navButtonStyle('mood')} onClick={() => setActiveSection('mood')}>Mood Board</button>
            </nav>

            {/* Content Area */}
            <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {activeSection === 'tasks' && <TaskBoard />}
                {activeSection === 'goals' && <GoalTracker />}
                {activeSection === 'timer' && <FocusTimer />}
                {activeSection === 'mood' && <MoodBoard />}
            </main>
        </div>
    );
}