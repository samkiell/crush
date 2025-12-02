'use client';
import { useState } from 'react';

export default function CrushCal({ onClose }) {
  const [display, setDisplay] = useState('0');

  const handlePress = (val) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        setDisplay(eval(display).toString()); 
      } catch {
        setDisplay('Error');
      }
    } else if (val === '√') {
      setDisplay(Math.sqrt(parseFloat(display)).toString());
    } else {
      setDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl w-80 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-primary">Crush Cal!</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded mb-4 text-right text-2xl font-mono text-gray-800 dark:text-gray-100 overflow-hidden">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['C', '√', '%', '/'].map(b => <button key={b} onClick={() => handlePress(b)} className="btn btn-sm btn-ghost">{b}</button>)}
          {['7', '8', '9', '*'].map(b => <button key={b} onClick={() => handlePress(b)} className="btn btn-sm btn-neutral">{b}</button>)}
          {['4', '5', '6', '-'].map(b => <button key={b} onClick={() => handlePress(b)} className="btn btn-sm btn-neutral">{b}</button>)}
          {['1', '2', '3', '+'].map(b => <button key={b} onClick={() => handlePress(b)} className="btn btn-sm btn-neutral">{b}</button>)}
          {['0', '.', '=', 'M+'].map(b => <button key={b} onClick={() => handlePress(b)} className={`btn btn-sm ${b === '=' ? 'btn-primary' : 'btn-neutral'}`}>{b}</button>)}
        </div>
      </div>
    </div>
  );
}
