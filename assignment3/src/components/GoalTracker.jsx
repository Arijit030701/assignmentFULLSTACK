import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GoalCard } from './GoalCard';

export function GoalTracker() {
    const [goals, setGoals] = useLocalStorage('cipher-goals', []);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editGoalText, setEditGoalText] = useState("");
    const editInputRef = useRef(null);

    useEffect(() => {
        if (editingGoalId && editInputRef.current) editInputRef.current.focus();
    }, [editingGoalId]);
    
    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        setGoals([...goals, { id: crypto.randomUUID(), title: newGoalTitle.trim(), progress: 0 }]);
        setNewGoalTitle('');
    };

    const saveGoal = (goalId) => {
        setGoals(goals.map(g => g.id === goalId ? { ...g, title: editGoalText.trim() } : g));
        setEditingGoalId(null);
    };

    const handleUpdateProgress = (goalId, newProgress) => {
        setGoals(goals.map(g => g.id === goalId ? { ...g, progress: newProgress } : g));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Goal Tracker</h2>
            <form onSubmit={handleAddGoal} style={{ marginBottom: '20px' }}>
                <input
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="New goal..."
                    style={{ width: '100%', padding: '10px' }}
                />
            </form>

            {goals.map(goal => (
                <div key={goal.id} style={{ marginBottom: '15px' }}>
                    {editingGoalId === goal.id ? (
                        <input
                            ref={editInputRef}
                            value={editGoalText}
                            onChange={(e) => setEditGoalText(e.target.value)}
                            onBlur={() => saveGoal(goal.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveGoal(goal.id)}
                            style={{ width: '100%', padding: '15px' }}
                        />
                    ) : (
                        <div onClick={() => { setEditingGoalId(goal.id); setEditGoalText(goal.title); }}>
                            <GoalCard goal={goal} onUpdateProgress={handleUpdateProgress} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}