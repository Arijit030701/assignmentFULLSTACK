import { useState, useRef, useEffect } from 'react';
import { GoalCard } from './GoalCard';
import axios from 'axios';

export function GoalTracker({ goals, setGoals, token }) {
    
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [editingGoalId, setEditingGoalId] = useState(null);
    const [editGoalText, setEditGoalText] = useState("");
    const editInputRef = useRef(null);

    useEffect(() => {
        if (editingGoalId && editInputRef.current) editInputRef.current.focus();
    }, [editingGoalId]);
    
    const handleAddGoal = async (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        try{
            const response = await axios.post('http://localhost:3000/api/goals', 
                { title: newGoalTitle.trim(), progress: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGoals([...goals, response.data]);
            setNewGoalTitle('');
        }catch(error){
            console.error("Failed to add goal:", error);
        }
    };

    const saveGoal = async (goalId) => {
        if(!editGoalText.trim()){
            setEditingGoalId(null);
            return;
        }
        try{
            await axios.patch(`http://localhost:3000/api/goals/${goalId}`,
                { title: editGoalText.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setGoals(goals.map(g => g.id === goalId ? { ...g, title: editGoalText.trim() } : g));
            setEditingGoalId(null);
        } catch (error) {
            console.error("Failed to update goal title:", error);
        }
    };

    const handleUpdateProgress = async (goalId, newProgress) => {
        try {
            await axios.patch(`http://localhost:3000/api/goals/${goalId}`,
                { progress: newProgress },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGoals(goals.map(g => g.id === goalId ? { ...g, progress: newProgress } : g));
        } catch (error) {
            console.error("Failed to update progress:", error);
        }
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