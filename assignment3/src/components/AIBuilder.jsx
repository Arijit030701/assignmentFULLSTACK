import { useState } from 'react';
import axios from 'axios';

export function AIBuilder({ token }) {
    const [prompt, setPrompt] = useState(''); // prompt: the text the user types describing the feature they want.
    const [componentName, setComponentName] = useState('');// componentName: the name for the generated file/component.
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleGenerate = async () => {
        if (!prompt || !componentName) {
            setMessage("Please fill out both the component name and the prompt!");
            return;
        }

        setStatus('loading');
        setMessage("AI is writing your code... Please wait.");

        try {
            const response = await axios.post(
                'http://localhost:3000/api/ai/generate-feature',
                { prompt, componentName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setStatus('success');
            setMessage(response.data.message);
            setPrompt('');
            setComponentName('');
        } catch (error) {
            setStatus('error');
            setMessage("Failed to generate component. Check the backend server console.");
        }
    };

    return (
        <div style={{ padding: '20px', background: '#222', borderRadius: '8px', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
            <h2> AI Feature Builder</h2>
            <p style={{ color: '#ccc' }}>Describe what you want to build, and the AI will write the React code directly to your project folder.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input 
                    type="text" 
                    placeholder="Component Name (e.g., GreenButton)" 
                    value={componentName}
                    // This forces the input to be a valid component name without spaces
                    onChange={(e) => setComponentName(e.target.value.replace(/\s+/g, ''))} 
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', fontSize: '16px' }}
                />
                
                <textarea 
                    placeholder="Describe the feature in detail... (e.g., A button with a green background that alerts 'Hello' when clicked)" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                    style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', fontSize: '16px', resize: 'vertical' }}
                />
                
                <button 
                    onClick={handleGenerate}
                    disabled={status === 'loading'}
                    style={{ 
                        padding: '12px', 
                        background: status === 'loading' ? '#555' : '#4CAF50', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}
                >
                    {status === 'loading' ? 'Generating...' : 'Generate Feature'}
                </button>
                
                {message && (
                    <div style={{ 
                        marginTop: '10px', 
                        padding: '12px', 
                        borderRadius: '4px',
                        background: status === 'error' ? '#ff4444' : '#333',
                        color: status === 'success' ? '#4CAF50' : '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}