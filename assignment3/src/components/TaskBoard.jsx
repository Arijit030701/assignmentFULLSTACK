import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- THE PURE FUNCTION ---
const groupTasks = (tasks) => {
    // 1. Added a 'completed' bucket
    const groups = { overdue: [], today: [], upcoming: [], noDate: [], completed: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        // 2. Intercept completed tasks first
        if (task.isCompleted) {
            groups.completed.push(task);
            return; // Skip the date sorting entirely
        }

        if (!task.dueDate) {
            groups.noDate.push(task);
            return;
        }

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0); 

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

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitleText, setEditTitleText] = useState("");
    const [editingDateId, setEditingDateId] = useState(null);
    const editInputRef = useRef(null);

    // NEW: P1e States
    const [fadingTaskIds, setFadingTaskIds] = useState([]); // The "Waiting Room"
    const [showCompleted, setShowCompleted] = useState(false); // Collapsible toggle

    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    // --- NEW: THE COMPLETION LOGIC (P1e) ---
    const toggleTaskCompletion = (task) => {
        // If un-checking a completed task, do it instantly
        if (task.isCompleted) {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, isCompleted: false } : t));
            return;
        }

        // If checking a task, send it to the waiting room for the CSS transition
        setFadingTaskIds(prev => [...prev, task.id]);

        // Start the 400ms stopwatch
        setTimeout(() => {
            // ALWAYS use the callback version of setTasks inside a setTimeout 
            // to guarantee you are modifying the most recent data
            setTasks(currentTasks => currentTasks.map(t =>
                t.id === task.id ? { ...t, isCompleted: true } : t
            ));
            
            // Remove it from the waiting room
            setFadingTaskIds(prev => prev.filter(id => id !== task.id));
        }, 400); 
    };

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

    const startEditingTitle = (task) => {
        if (task.isCompleted) return; // Prevent editing completed tasks
        setEditingTaskId(task.id);
        setEditTitleText(task.title);
    };

    const saveTitle = (taskId) => {
        if (editTitleText.trim() === '') {
            setEditingTaskId(null); 
            return;
        }
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, title: editTitleText.trim() } : task
        ));
        setEditingTaskId(null); 
    };

    const updateTaskDate = (taskId, daysToAdd) => {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + daysToAdd);
        
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, dueDate: newDate.toISOString() } : task
        ));
        setEditingDateId(null); 
    };

    const groupedTasks = groupTasks(tasks);

    // --- UPDATED UI HELPER ---
    const renderTaskSection = (title, tasksInGroup, isCompletedSection = false) => {
        if(tasksInGroup.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '25px' }}>
                <h3 
                    // Add a click handler if it's the completed section to toggle it
                    onClick={() => isCompletedSection && setShowCompleted(!showCompleted)}
                    style={{ 
                        borderBottom: '1px solid #444', 
                        paddingBottom: '5px', 
                        color: '#aaa',
                        cursor: isCompletedSection ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {title} <span style={{ fontSize: '0.8rem', marginLeft: '10px' }}>({tasksInGroup.length})</span>
                    {/* Add the collapse arrow icon */}
                    {isCompletedSection && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{showCompleted ? '▼' : '▶'}</span>
                    )}
                </h3>
                
                {/* Only render the tasks if it is NOT the completed section, OR if showCompleted is true */}
                {(!isCompletedSection || showCompleted) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {tasksInGroup.map(task => {
                            // Check if this specific task is currently in the waiting room
                            const isFading = fadingTaskIds.includes(task.id);
                            const isDone = task.isCompleted || isFading;

                            return (
                                <div 
                                    key={task.id} 
                                    style={{ 
                                        padding: '10px', 
                                        border: '1px solid #333', 
                                        borderRadius: '5px',
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        background: isDone ? '#1a1a1a' : 'transparent',
                                        
                                        // The CSS Transition Engine
                                        transition: 'all 0.4s ease',
                                        opacity: isFading ? 0 : 1,
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '15px', width: '80%', alignItems: 'flex-start' }}>
                                        
                                        {/* The Checkbox */}
                                        <input 
                                            type="checkbox" 
                                            checked={isDone}
                                            onChange={() => toggleTaskCompletion(task)}
                                            style={{ marginTop: '5px', cursor: 'pointer' }}
                                        />

                                        <div style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            gap: '5px', 
                                            width: '100%',
                                            // Strike-through text if it's fading or completed
                                            textDecoration: isDone ? 'line-through' : 'none',
                                            color: isDone ? '#555' : 'inherit'
                                        }}>
                                            
                                            {editingTaskId === task.id ? (
                                                <input
                                                    ref={editInputRef}
                                                    value={editTitleText}
                                                    onChange={(e) => setEditTitleText(e.target.value)}
                                                    onBlur={() => saveTitle(task.id)} 
                                                    onKeyDown={(e) => e.key === 'Enter' && saveTitle(task.id)} 
                                                    style={{ padding: '5px', fontSize: '1rem' }}
                                                />
                                            ) : (
                                                <strong 
                                                    onClick={() => startEditingTitle(task)}
                                                    style={{ cursor: isDone ? 'default' : 'text' }} 
                                                >
                                                    {task.title}
                                                </strong>
                                            )}

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
                                                        onClick={() => { if(!isDone) setEditingDateId(task.id) }}
                                                        style={{ color: '#888', cursor: isDone ? 'default' : 'pointer', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}
                                                    >
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '📅 Add Date'}
                                                    </small>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDeleteTask(task.id)}
                                        style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
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
            
            {/* NEW: The Completed Section. We pass 'true' as the third argument to enable the collapse logic */}
            {renderTaskSection("Completed", groupedTasks.completed, true)}
            
            {tasks.length === 0 && (
                <p style={{ color: '#888', textAlign: 'center' }}>No tasks yet. Add one above!</p>
            )}
        </div>
    );
}