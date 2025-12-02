'use client';
import { useState, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

export default function CrushCal({ onClose, isDocked = false, onToggleDock }) {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [expanded, setExpanded] = useState(!isDocked);

  useEffect(() => {
    if (isDocked) setExpanded(false);
  }, [isDocked]);

  const handlePress = (val) => {
    if (val === 'C') setDisplay('0');
    else if (val === 'AC') {
      setDisplay('0');
      setMemory(0);
    }
    else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        setDisplay(String(eval(display.replace('x', '*').replace('÷', '/')))); 
      } catch {
        setDisplay('Error');
      }
    } else if (val === '√') {
      setDisplay(String(Math.sqrt(parseFloat(display))));
    } else if (val === '+/-') {
      setDisplay(String(parseFloat(display) * -1));
    } else if (val === 'M+') {
      setMemory(memory + parseFloat(display));
      setDisplay('0');
    } else if (val === 'M-') {
      setMemory(memory - parseFloat(display));
      setDisplay('0');
    } else if (val === 'MR') {
      setDisplay(String(memory));
    } else if (val === 'MC') {
      setMemory(0);
    } else {
      setDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  const btnClass = "btn btn-sm h-12 text-lg font-bold rounded-lg shadow-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all";
  const numClass = `${btnClass} btn-neutral bg-base-100 border-base-300 hover:bg-base-200 text-base-content`;
  const opClass = `${btnClass} btn-ghost bg-base-200 border-base-300 hover:bg-base-300 text-primary`;
  const actionClass = `${btnClass} btn-error btn-outline border-error/20`;

  if (!expanded && isDocked) {
    return (
      <div className="bg-base-100 border-b border-base-200 p-2 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="font-mono text-xl font-bold px-2 truncate max-w-[200px]">{display}</div>
        <div className="flex gap-2">
           <button onClick={() => setExpanded(true)} className="btn btn-sm btn-ghost btn-square">
             <Maximize2 size={18} />
           </button>
           <button onClick={onClose} className="btn btn-sm btn-ghost btn-square text-error">
             <X size={18} />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      ${isDocked ? 'absolute top-0 right-0 m-4 w-80 shadow-2xl z-50' : 'fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]'}
    `}>
      <div className={`bg-base-100 p-4 rounded-2xl shadow-2xl border border-base-300 flex flex-col gap-3 ${!isDocked && 'w-full max-w-sm mx-4'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            Crush Cal <span className="text-xs bg-primary/10 px-2 py-0.5 rounded text-primary">FX-991</span>
          </h3>
          <div className="flex gap-1">
            {isDocked && (
              <button onClick={() => setExpanded(false)} className="btn btn-xs btn-ghost btn-square">
                <Minimize2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="btn btn-xs btn-ghost btn-square hover:bg-error/10 hover:text-error">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="bg-base-200/50 p-4 rounded-xl text-right font-mono text-3xl font-bold tracking-wider text-base-content shadow-inner border border-base-200 overflow-hidden break-all">
          {display}
          {memory !== 0 && <div className="text-xs text-primary mt-1">M</div>}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2">
          {['MC', 'MR', 'M-', 'M+'].map(b => 
            <button key={b} onClick={() => handlePress(b)} className="btn btn-xs btn-ghost text-xs font-bold text-base-content/60">{b}</button>
          )}
          
          <button onClick={() => handlePress('C')} className={actionClass}>C</button>
          <button onClick={() => handlePress('√')} className={opClass}>√</button>
          <button onClick={() => handlePress('%')} className={opClass}>%</button>
          <button onClick={() => handlePress('/')} className={opClass}>÷</button>

          {['7', '8', '9'].map(b => <button key={b} onClick={() => handlePress(b)} className={numClass}>{b}</button>)}
          <button onClick={() => handlePress('*')} className={opClass}>x</button>

          {['4', '5', '6'].map(b => <button key={b} onClick={() => handlePress(b)} className={numClass}>{b}</button>)}
          <button onClick={() => handlePress('-')} className={opClass}>-</button>

          {['1', '2', '3'].map(b => <button key={b} onClick={() => handlePress(b)} className={numClass}>{b}</button>)}
          <button onClick={() => handlePress('+')} className={opClass}>+</button>

          <button onClick={() => handlePress('0')} className={numClass}>0</button>
          <button onClick={() => handlePress('.')} className={numClass}>.</button>
          <button onClick={() => handlePress('+/-')} className={numClass}>±</button>
          <button onClick={() => handlePress('=')} className={`${btnClass} btn-primary text-white border-primary-focus shadow-primary/20`}>=</button>
        </div>
      </div>
    </div>
  );
}
