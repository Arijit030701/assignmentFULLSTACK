import React from 'react';

export default function PurpleAIButton() {
  const handleClick = () => {
    alert("The AI built this!");
  };

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-slate-50 rounded-xl p-8">
      <button
        onClick={handleClick}
        className="px-10 py-5 text-2xl font-black text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-2xl shadow-2xl hover:shadow-purple-500/40 transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 tracking-wide"
      >
        Click Me!
      </button>
    </div>
  );
}