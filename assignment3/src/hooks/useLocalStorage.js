import { useState, useEffect } from 'react';
export function useLocalStorage(key, initialValue) {
  // 1. Read from localStorage when the app first loads
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // 2. Save to localStorage every time 'value' changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  // 3. Return the state and the updater function
  return [value, setValue];
}