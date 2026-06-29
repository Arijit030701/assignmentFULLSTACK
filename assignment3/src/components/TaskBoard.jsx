import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- THE PURE FUNCTION ---
const groupTasks = (tasks) => {
    const groups = { overdue: [], today: [], upcoming: [], noDate: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        if (!task.dueDate) {
            groups.noDate.push(task);
            return;
        }

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0); // Timezone Bug Fix from previous step

        if (taskDate < today) {
            groups.overdue.push(task);
        } else if (taskDate.getTime() === today.getTime()) {
            groups.today.push(task);
        } else {
            groups.upcoming.push(task);
        }
    });
    return groups;
}

export function TaskBoard() {
    const [tasks, setTasks] = useLocalStorage('cipher-tasks', []);
    const [subtasks, setSubtasks] = useLocalStorage('cipher-subtasks', []);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const [newTaskDate, setNewTaskDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    // NEW: Inline Edit States (P1d)
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitleText, setEditTitleText] = useState("");
    const [editingDateId, setEditingDateId] = useState(null);
    const editInputRef = useRef(null);

    // NEW: Focus Effect for Inline Edit
    // Whenever editingTaskId changes, React grabs the input box and forces the cursor inside it
    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    // --- QUICK ADD FUNCTIONS ---
    const handleQuickDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        setNewTaskDate(date.toISOString());
        setShowPicker(false); 
    };

    const handleCustomDateChange = (e) => {
        const date = new Date(e.target.value);
        setNewTaskDate(date.toISOString());
        setShowPicker(false);
        setShowCustomPicker(false);
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if(newTaskTitle.trim() === '') return;
        
        const newTask = {
            id: crypto.randomUUID(), 
            title: newTaskTitle.trim(),
            dueDate: newTaskDate,
            isCompleted: false
        }
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDate(null);
        setShowPicker(false);
        setShowCustomPicker(false);
    };

    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
        setSubtasks(subtasks.filter(subtask => subtask.parentId !== taskId));
    };

    // --- INLINE EDIT FUNCTIONS (P1d) ---
    const startEditingTitle = (task) => {
        setEditingTaskId(task.id);
        setEditTitleText(task.title);
    };

    const saveTitle = (taskId) => {
        if (editTitleText.trim() === '') {
            setEditingTaskId(null); // Don't save empty titles, just close it
            return;
        }
        // The Array Map Update: Find the specific task and overwrite its title
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, title: editTitleText.trim() } : task
        ));
        setEditingTaskId(null); // Close the input
    };

    const updateTaskDate = (taskId, daysToAdd) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + daysToAdd);
        
        // The Array Map Update: Find the specific task and overwrite its date
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, dueDate: newDate.toISOString() } : task
        ));
        setEditingDateId(null); // Close the menu
    };

    const groupedTasks = groupTasks(tasks);

    // --- UI HELPER COMPONENT ---
    const renderTaskSection = (title, tasksInGroup) => {
        if(tasksInGroup.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '25px' }}>
                <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px', color: '#aaa' }}>
                    {title} <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>({tasksInGroup.length})</span>
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                    {tasksInGroup.map(task => (
                        <div 
                            key={task.id} 
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #333', 
                                borderRadius: '5px',
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '80%' }}>
                                
                                {/* 1. The Title Swap Logic (P1d) */}
                                {editingTaskId === task.id ? (
                                    <input
                                        ref={editInputRef} // Tied to our useEffect focus
                                        value={editTitleText}
                                        onChange={(e) => setEditTitleText(e.target.value)}
                                        onBlur={() => saveTitle(task.id)} // Saves when you click away
                                        onKeyDown={(e) => e.key === 'Enter' && saveTitle(task.id)} // Saves on Enter
                                        style={{ padding: '5px', fontSize: '1rem' }}
                                    />
                                ) : (
                                    <strong 
                                        onClick={() => startEditingTitle(task)}
                                        style={{ cursor: 'text' }} // Shows the typing cursor on hover
                                    >
                                        {task.title}
                                    </strong>
                                )}

                                {/* 2. The Date Pill Swap Logic (P1d) */}
                                <div>
                                    {editingDateId === task.id ? (
                                        <div style={{ display: 'flex', gap: '5px', fontSize: '0.8rem' }}>
                                            <button onClick={() => updateTaskDate(task.id, 0)}>Today</button>
                                            <button onClick={() => updateTaskDate(task.id, 1)}>Tomorrow</button>
                                            <button onClick={() => updateTaskDate(task.id, 7)}>This Week</button>
                                            <button onClick={() => setEditingDateId(null)} style={{ color: 'red' }}>X</button>
                                        </div>
                                    ) : (
                                        <small 
                                            onClick={() => setEditingDateId(task.id)}
                                            style={{ color: '#888', cursor: 'pointer', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}
                                        >
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '📅 Add Date'}
                                        </small>
                                    )}
                                </div>

                            </div>
                            
                            <button 
                                onClick={() => handleDeleteTask(task.id)}
                                style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Task Board</h2>
            
            <form onSubmit={handleAddTask} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', borderRadius: '8px' }}>
                <input
                    type="text"
                    placeholder="What needs to be done? (Press Enter to add)"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {!showPicker && !showCustomPicker && (
                        <button 
                            type="button" 
                            onClick={() => setShowPicker(true)}
                            style={{ cursor: 'pointer', padding: '5px 10px' }}
                        >
                            📅 {newTaskDate ? new Date(newTaskDate).toLocaleDateString() : 'Add Date'}
                        </button>
                    )}

                    {showPicker && !showCustomPicker && (
                        <>
                            <button type="button" onClick={() => handleQuickDate(0)}>Today</button>
                            <button type="button" onClick={() => handleQuickDate(1)}>Tomorrow</button>
                            <button type="button" onClick={() => handleQuickDate(7)}>This Week</button>
                            <button type="button" onClick={() => setShowCustomPicker(true)}>Custom</button>
                            <button type="button" onClick={() => setShowPicker(false)} style={{ color: 'red' }}>Cancel</button>
                        </>
                    )}

                    {showCustomPicker && (
                        <>
                            <input 
                                type="date" 
                                onChange={handleCustomDateChange} 
                                style={{ padding: '5px' }}
                            />
                            <button type="button" onClick={() => { setShowCustomPicker(false); setShowPicker(false); }} style={{ color: 'red' }}>Cancel</button>
                        </>
                    )}
                </div>      
            </form>

            {renderTaskSection("Overdue", groupedTasks.overdue)}
            {renderTaskSection("Today", groupedTasks.today)}
            {renderTaskSection("Upcoming", groupedTasks.upcoming)}
            {renderTaskSection("No Date", groupedTasks.noDate)}
            
            {tasks.length === 0 && (
                <p style={{ color: '#888', textAlign: 'center' }}>No tasks yet. Add one above!</p>
            )}
        </div>
    );
}