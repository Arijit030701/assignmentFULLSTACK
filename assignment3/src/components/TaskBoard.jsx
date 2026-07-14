import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// --- THE PURE FUNCTION ---
const groupTasks = (tasks) => {
    const groups = { overdue: [], today: [], upcoming: [], noDate: [], completed: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        if (task.isCompleted) {
            groups.completed.push(task);
            return; 
        }
        if (!task.dueDate) {
            groups.noDate.push(task);
            return;
        }

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0); // Where the glitch cut off last time!

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

export function TaskBoard({ tasks, setTasks }) {
    // 1. Core Data
    // const [tasks, setTasks] = useLocalStorage('cipher-tasks', []);
    const [subtasks, setSubtasks] = useLocalStorage('cipher-subtasks', []); 
    
    // 2. New Task UI States
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    // 3. Inline Edit States
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitleText, setEditTitleText] = useState("");
    const [editingDateId, setEditingDateId] = useState(null);
    const editInputRef = useRef(null);

    // 4. Fade & Completion States
    const [fadingTaskIds, setFadingTaskIds] = useState([]); 
    const [showCompleted, setShowCompleted] = useState(false); 

    // 5. NEW: Subtask UI States
    const [expandedTaskIds, setExpandedTaskIds] = useState([]);
    const [newSubtaskTitles, setNewSubtaskTitles] = useState({}); // Tracks inputs per parent task

    useEffect(() => {
        if (editingTaskId && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [editingTaskId]);

    // --- PARENT TASK FUNCTIONS ---
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
        // Flat state deletion: Delete all subtasks where the parentId matches the deleted task
        setSubtasks(subtasks.filter(subtask => subtask.parentId !== taskId));
    };

    const toggleTaskCompletion = (task) => {
        if (task.isCompleted) {
            setTasks(tasks.map(t => t.id === task.id ? { ...t, isCompleted: false } : t));
            return;
        }

        setFadingTaskIds(prev => [...prev, task.id]);

        setTimeout(() => {
            setTasks(currentTasks => currentTasks.map(t =>
                t.id === task.id ? { ...t, isCompleted: true } : t
            ));
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

    const startEditingTitle = (task) => {
        if (task.isCompleted) return;
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

    // --- NEW: SUBTASK FUNCTIONS (P1f) ---
    const toggleSubtaskExpand = (taskId) => {
        setExpandedTaskIds(prev => 
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const handleAddSubtask = (taskId, e) => {
        e.preventDefault();
        const titleText = newSubtaskTitles[taskId]?.trim();
        if (!titleText) return;

        const newSubtask = {
            id: crypto.randomUUID(),
            parentId: taskId, // The Foreign Key
            title: titleText,
            isCompleted: false
        };

        setSubtasks([...subtasks, newSubtask]);
        setNewSubtaskTitles({ ...newSubtaskTitles, [taskId]: '' }); // Clear just this specific input
    };

    const toggleSubtaskCompletion = (subtaskId) => {
        setSubtasks(subtasks.map(st => 
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        ));
    };

    const deleteSubtask = (subtaskId) => {
        setSubtasks(subtasks.filter(st => st.id !== subtaskId));
    };

    const groupedTasks = groupTasks(tasks);

    // --- UI HELPER ---
    const renderTaskSection = (title, tasksInGroup, isCompletedSection = false) => {
        if(tasksInGroup.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '25px' }}>
                <h3 
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
                    {isCompletedSection && (
                        <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>{showCompleted ? '▼' : '▶'}</span>
                    )}
                </h3>
                
                {(!isCompletedSection || showCompleted) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {tasksInGroup.map(task => {
                            const isFading = fadingTaskIds.includes(task.id);
                            const isDone = task.isCompleted || isFading;
                            const isExpanded = expandedTaskIds.includes(task.id);

                            // P1f: Derived State for Subtasks (Calculated on the fly)
                            const taskSubtasks = subtasks.filter(st => st.parentId === task.id);
                            const completedCount = taskSubtasks.filter(st => st.isCompleted).length;
                            const totalCount = taskSubtasks.length;

                            return (
                                <div 
                                    key={task.id} 
                                    style={{ 
                                        border: '1px solid #333', 
                                        borderRadius: '5px',
                                        background: isDone ? '#1a1a1a' : 'transparent',
                                        transition: 'all 0.4s ease',
                                        opacity: isFading ? 0 : 1,
                                    }}
                                >
                                    {/* MAIN TASK ROW */}
                                    <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', gap: '15px', width: '80%', alignItems: 'flex-start' }}>
                                            
                                            <input 
                                                type="checkbox" 
                                                checked={isDone}
                                                onChange={() => toggleTaskCompletion(task)}
                                                style={{ marginTop: '5px', cursor: 'pointer' }}
                                            />

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? '#555' : 'inherit' }}>
                                                
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                                                        <strong onClick={() => startEditingTitle(task)} style={{ cursor: isDone ? 'default' : 'text' }}>
                                                            {task.title}
                                                        </strong>
                                                    )}

                                                    {/* P1f: Progress Badge */}
                                                    {totalCount > 0 && (
                                                        <span style={{ fontSize: '0.75rem', background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>
                                                            {completedCount}/{totalCount}
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                                                    
                                                    {/* P1f: Subtask Collapse Toggle */}
                                                    {!isDone && (
                                                        <small 
                                                            onClick={() => toggleSubtaskExpand(task.id)}
                                                            style={{ color: '#66b3ff', cursor: 'pointer' }}
                                                        >
                                                            {isExpanded ? 'Hide Subtasks' : 'Add/View Subtasks'}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                    </div>

                                    {/* SUBTASK EXPANDED AREA */}
                                    {isExpanded && !isDone && (
                                        <div style={{ borderTop: '1px solid #333', padding: '10px 10px 10px 40px', background: 'rgba(0,0,0,0.2)' }}>
                                            
                                            {/* Subtask List */}
                                            {taskSubtasks.map(st => (
                                                <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.9rem' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <input 
                                                            type="checkbox" 
                                                            checked={st.isCompleted} 
                                                            onChange={() => toggleSubtaskCompletion(st.id)} 
                                                        />
                                                        <span style={{ textDecoration: st.isCompleted ? 'line-through' : 'none', color: st.isCompleted ? '#666' : 'inherit' }}>
                                                            {st.title}
                                                        </span>
                                                    </div>
                                                    <button onClick={() => deleteSubtask(st.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem' }}>x</button>
                                                </div>
                                            ))}

                                            {/* Add Subtask Form */}
                                            <form onSubmit={(e) => handleAddSubtask(task.id, e)} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <input 
                                                    type="text" 
                                                    placeholder="Add a subtask..." 
                                                    value={newSubtaskTitles[task.id] || ''}
                                                    onChange={(e) => setNewSubtaskTitles({ ...newSubtaskTitles, [task.id]: e.target.value })}
                                                    style={{ flex: 1, padding: '5px', fontSize: '0.9rem' }}
                                                />
                                                <button type="submit" style={{ padding: '5px 10px' }}>Add</button>
                                            </form>
                                        </div>
                                    )}

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
                        <button type="button" onClick={() => setShowPicker(true)} style={{ cursor: 'pointer', padding: '5px 10px' }}>
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
                            <input type="date" onChange={handleCustomDateChange} style={{ padding: '5px' }} />
                            <button type="button" onClick={() => { setShowCustomPicker(false); setShowPicker(false); }} style={{ color: 'red' }}>Cancel</button>
                        </>
                    )}
                </div>      
            </form>

            {renderTaskSection("Overdue", groupedTasks.overdue)}
            {renderTaskSection("Today", groupedTasks.today)}
            {renderTaskSection("Upcoming", groupedTasks.upcoming)}
            {renderTaskSection("No Date", groupedTasks.noDate)}
            {renderTaskSection("Completed", groupedTasks.completed, true)}
            
            {tasks.length === 0 && (
                <p style={{ color: '#888', textAlign: 'center' }}>No tasks yet. Add one above!</p>
            )}
        </div>
    );
}