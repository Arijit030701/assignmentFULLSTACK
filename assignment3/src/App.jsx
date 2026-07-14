import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div style={{ background: '#333', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>--- START OF APP.JSX ---</h1>
      
      <Dashboard />
      
      <h1 style={{ color: 'red' }}>--- END OF APP.JSX ---</h1>
    </div>
  );
}

export default App;