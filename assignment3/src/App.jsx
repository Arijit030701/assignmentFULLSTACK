import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import { useLocalStorage } from './hooks/useLocalStorage';
function App() {
  const [token, setToken] = useLocalStorage('token', null);
  const [isLoginView, setIsLoginView] = useState(true);
  return (
    <div style={{ background: '#333', color: 'white', minHeight: '100vh' }}>
      
      {token ? (
        <Dashboard token={token} setToken={setToken} /> 
      ) : (
        isLoginView ? (
          <Login 
            setToken={setToken} 
            switchToRegister={() => setIsLoginView(false)}
          /> 
      ) : (
          <Register 
            setToken={setToken}
            switchToLogin={() => setIsLoginView(true)}
            />
      )
    )}  
      
    </div>
  );
}

export default App;