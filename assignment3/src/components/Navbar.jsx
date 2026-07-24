export function Navbar({ setToken }) {
    
    const handleLogout = () => {
        // 1. Clear the token from browser storage
        localStorage.removeItem('token'); 
        
        // 2. Clear the token state in React
        if (setToken) {
            setToken(null); 
        }
        
        // 3. Force the browser to reload and go to the root URL
        // This completely bypasses the need for react-router-dom!
        window.location.href = '/'; 
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', background: '#222', color: '#fff', marginBottom: '20px', borderRadius: '8px' }}>
            <h3 style={{ margin: 0 }}>Cipher App</h3>
            <button 
                onClick={handleLogout}
                style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
                Log Out
            </button>
        </div>
    );
}