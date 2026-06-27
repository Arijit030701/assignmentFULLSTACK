import './App.css'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useState } from 'react'

function App() {
  // We call our new hook here. 
  // 'test-word' is the key it saves under. 'Hello' is the starting value.
  const [testValue, setTestValue] = useLocalStorage('test-word', 'Hello');
  // const [testValue, setTestValue] = useState('Hello')
  return (
    <div>
      <h1>Testing useLocalStorage</h1>
      
      <p>Current Value: <strong>{testValue}</strong></p>
      
      <input 
        type="text" 
        value={testValue} 
        onChange={(e) => setTestValue(e.target.value)} 
      />
      <p><small>Change the text, then refresh the page!</small></p>
    </div>
  )
}

export default App