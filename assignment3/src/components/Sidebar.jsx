export function Sidebar({ activeSection, setActiveSection }) {
    const navButtonStyle = (section) => ({
        padding: '10px 20px',
        marginBottom: '5px',
        cursor: 'pointer',
        backgroundColor: activeSection === section ? '#333' : 'transparent',
        color: 'white',
        border: 'none',
        textAlign: 'left',
        borderRadius: '5px',
        width: '100%'
    });

    return (
        <nav style={{ width: '200px', background: '#111', padding: '20px', borderRight: '1px solid #333' }}>
            <h2>Menu</h2>
            <button style={navButtonStyle('tasks')} onClick={() => setActiveSection('tasks')}>Tasks</button>
            <button style={navButtonStyle('goals')} onClick={() => setActiveSection('goals')}>Goals</button>
            <button style={navButtonStyle('timer')} onClick={() => setActiveSection('timer')}>Focus Timer</button>
            <button style={navButtonStyle('mood')} onClick={() => setActiveSection('mood')}>Mood Board</button>
        </nav>
    );
}