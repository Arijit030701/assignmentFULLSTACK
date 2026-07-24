export function GoalCard({ goal, onUpdateProgress }) {
    const progress = goal.progress ?? 0;

    const updateProgress = (amount) => {
        const newValue = progress + amount;
        const clampedValue = Math.max(0, Math.min(100, newValue));
        onUpdateProgress(goal.id, clampedValue);
    };

    return (
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '15px', background: '#111' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '1.1rem', color: '#fff' }}>{goal.title}</strong>
                
                {/* THE FIX: Added explicit colors, padding, and borders to the buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            updateProgress(-10);
                        }} 
                        style={{ 
                            cursor: 'pointer', 
                            background: '#333', 
                            color: '#fff', 
                            border: '1px solid #555', 
                            borderRadius: '4px',
                            padding: '4px 12px',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        -
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            updateProgress(10);
                        }} 
                        style={{ 
                            cursor: 'pointer', 
                            background: '#333', 
                            color: '#fff', 
                            border: '1px solid #555', 
                            borderRadius: '4px',
                            padding: '4px 12px',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        +
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                    height: '100%', 
                    width: `${progress}%`, 
                    background: progress === 100 ? '#4caf50' : '#2196f3', 
                    transition: 'width 0.4s ease' 
                }} />
            </div>
            <div style={{ textAlign: 'right', marginTop: '6px', color: '#aaa', fontWeight: 'bold' }}>
                {progress}%
            </div>
        </div>
    );
}