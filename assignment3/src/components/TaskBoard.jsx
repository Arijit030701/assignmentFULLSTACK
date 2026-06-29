import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
const groupTasks = (tasks) => {
    const groups = { overdue: [], today: [], upcoming: [], noDate: [] };
    const today = new Date();
    today.setHours(0,0,0,0);

    tasks.forEach(task => {
        if(!task.dueDate){
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
    // 1. Our long-term memory (Storage)
    const [tasks, setTasks] = useLocalStorage('cipher-tasks', []);
    const [subtasks, setSubtasks] = useLocalStorage('cipher-subtasks', []);
    // 2. Our short-term memory (What is currently typed in the input box)
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const [newTaskDate, setNewTaskDate] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const [showCustomPicker, setShowCustomPicker] = useState(false);

    const handleQuickDate = (daysToAdd) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        setNewTaskDate(date.toISOString());
        setShowPicker(false); // Hide the menu after clicking
    };
    const handleCustomDateChange = (e) => {
        const date = new Date(e.target.value);
        setNewTaskDate(date.toISOString());
        setShowPicker(false);
        setShowCustomPicker(false);
    };

    //this function runs when i submit the form
    const handleAddTask = (e) => {
        e.preventDefault();
        
        if(newTaskTitle.trim() == '') return;
        const newTask ={
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
    const groupedTasks = groupTasks(tasks);
    const TaskSection = ({title, tasksInGroup}) => {
        if(tasksInGroup.length === 0) return null
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
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <strong>{task.title}</strong>
                                {/* Render the date on the task if it exists */}
                                {task.dueDate && (
                                    <small style={{ color: '#888' }}>
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </small>
                                )}
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
        
        {/* 1. Paste or place your Form here */}
        <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="What needs to be done? (Press Enter to add)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    
            {/* State 1: Default or Date Selected (Shows Button) */}
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
        <TaskSection title="Overdue" tasksInGroup={groupedTasks.overdue} />
            <TaskSection title="Today" tasksInGroup={groupedTasks.today} />
            <TaskSection title="Upcoming" tasksInGroup={groupedTasks.upcoming} />
            <TaskSection title="No Date" tasksInGroup={groupedTasks.noDate} />
        {/* 2. Optional: Add the list loop below it to see added tasks */}
        {tasks.length === 0 && (
                <p style={{ color: '#888', textAlign: 'center' }}>No tasks yet. Add one above!</p>
        )}
    </div>
);
}  
