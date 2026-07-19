import { useState } from 'react';
import axios from 'axios';

export default function Login({setToken, switchToRegister}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email,
                password
            });
            //email password dala wo backend ke pass gya and if correct then wo response.data.token ke inside JWT string de diya
            setToken(response.data.token);
        }catch(err){
            const backendError = err.response?.data?.error;
            setError(backendError || "Network error. Is your backend ru;nning?")
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
        <h2>Login to Cipher</h2>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', marginTop: '20px' }}>
            <input
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button 
            type="submit" 
            style={{ 
                padding: '10px', 
                cursor: 'pointer', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontWeight: 'bold'
            }}
            >
            Login
            </button>
        </form>

        <p style={{ marginTop: '20px' }}>
                Don't have an account?{' '}
                <span 
                    onClick={switchToRegister} 
                    style={{ color: '#008CBA', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Register here
                </span>
            </p>
        </div>
    );
};

