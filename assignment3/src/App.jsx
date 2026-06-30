import { TaskBoard } from './components/TaskBoard';
import { GoalTracker } from './components/GoalTracker';
import { FocusTimer } from './components/FocusTimer';
import { MoodBoard } from './components/MoodBoard'; // 1. Import it

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Dashboard</h1>
      
      <TaskBoard />
      
      <hr style={{ margin: '40px 0', borderColor: '#333' }} />
      
      <GoalTracker />

      <hr style={{ margin: '40px 0', borderColor: '#333' }} />
      
      <FocusTimer />
      
      <hr style={{ margin: '40px 0', borderColor: '#333' }} />
      
      {/* 2. Add it here */}
      <MoodBoard /> 
      
    </div>
  );
}

export default App;