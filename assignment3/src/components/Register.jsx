import { useState } from 'react';
import axios from 'axios';

export default function Register({setToken, switchToLogin}){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault(); 
        setError(null);

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                name,
                email,
                password
            });
            console.log("Full Backend Response:", response);
            console.log("Extracted Token:", response.data.token);
            // setToken(response.data.token);
            switchToLogin();
        }catch(err) {
            console.error("Axios caught an error:", err);
            const backendError = err.response?.data?.error;

            setError(backendError || "Network error. Is your backend running?");
        }
    };

    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h2>Create an Account</h2>
            
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px', marginTop: '20px' }}>

                <input
                    type="text"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

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
                        padding: '10px', cursor: 'pointer', backgroundColor: '#008CBA', 
                        color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold'
                    }}
                >
                    Register
                </button>
            </form>
            <p style={{ marginTop: '20px' }}>
                Already have an account?{' '}
                <span 
                    onClick={switchToLogin} 
                    style={{ color: '#4CAF50', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    Login here
                </span>
            </p>
        </div>
    );
}