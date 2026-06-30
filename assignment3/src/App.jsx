import { Dashboard } from './components/Dashboard';
console.log("APP.JSX IS LOADING");
function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <Dashboard />
    </div>
  );
}

export default App;