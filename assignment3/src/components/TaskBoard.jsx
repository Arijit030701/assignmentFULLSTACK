import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function TaskBoard() {
    // 1. Our long-term memory (Storage)
    const [tasks, setTasks] = useLocalStorage('cipher-tasks', []);
  
    // 2. Our short-term memory (What is currently typed in the input box)
    const [newTaskTitle, setNewTaskTitle] = useState('');

    //this function runs when i submit the form
    const handleAddTask = (e) => {
        e.preventDefault();
        
        if(newTaskTitle.trim() == '') return;
        const newTask ={
            id: crypto.randomUUID(), 
            title: newTaskTitle.trim(),
            dueDate: null,
            isCompleted: false
        }
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
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
        </form>

        {/* 2. Optional: Add the list loop below it to see added tasks */}
        {tasks.map((task) => (
            <div key={task.id} style={{ padding: '10px 0' }}>
                <strong>{task.title}</strong>
            </div>
        ))}
    </div>
);
}  
