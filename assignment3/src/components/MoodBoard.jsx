import { useState } from 'react';

export function MoodBoard() {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        
        setItems([...items, { id: crypto.randomUUID(), value: inputValue }]);
        setInputValue('');
    };

    const removeItem = (id) => {
        
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mood Board</h2>
            
            <form onSubmit={handleAddItem} style={{ marginBottom: '20px' }}>
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter color or image URL..."
                    style={{ padding: '8px', width: '250px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', marginLeft: '5px' }}>Add</button>
            </form>

            <div style={{ 
                display: 'grid', 
                gap: '15px', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' 
            }}>
                {items.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => removeItem(item.id)}
                        style={{ 
                            height: '150px',
                            background: item.value.startsWith('#') ? item.value : `url(${item.value})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '2px solid #333',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}