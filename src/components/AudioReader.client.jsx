'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Loader2 } from 'lucide-react';

export default function AudioReader({ text, options, explanation = null }) {
  const [status, setStatus] = useState('idle'); // idle, playing, paused
  const [supported, setSupported] = useState(false);
  const synth = useRef(null);
  const utterance = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
      setSupported(true);
    }
    
    // Cleanup
    return () => {
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  // Stop speaking when text changes (new question)
  useEffect(() => {
    if (synth.current) {
      synth.current.cancel();
      setStatus('idle');
    }
  }, [text]);

  const constructText = () => {
    let fullText = text;
    
    if (options) {
      fullText += ". . Options are: . ";
      // Handle options whether they are an array or object
      if (Array.isArray(options)) {
         options.forEach(opt => {
             fullText += `${opt.id || opt.key}: ${opt.text || opt.value}. `;
         });
      } else if (typeof options === 'object') {
        Object.entries(options).forEach(([key, value]) => {
            if (value) fullText += `Option ${key}: ${value}. `;
        });
      }
    }

    if (explanation) {
      fullText += ". . Explanation: " + explanation;
    }
    
    return fullText;
  };

  const handlePlay = () => {
    if (!synth.current) return;

    if (status === 'paused') {
      synth.current.resume();
      setStatus('playing');
      return;
    }

    if (status === 'playing') {
      synth.current.pause();
      setStatus('paused');
      return;
    }

    // Start new
    synth.current.cancel();
    const textToRead = constructText();
    const u = new SpeechSynthesisUtterance(textToRead);
    
    // Try to set a good voice
    const voices = synth.current.getVoices();
    // Prefer Google US English or similar natural voices if available
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || 
                           voices.find(v => v.lang === 'en-US') || 
                           voices.find(v => v.lang.startsWith('en'));
    
    if (preferredVoice) u.voice = preferredVoice;
    u.rate = 0.9; // Slightly slower for clarity
    u.pitch = 1;

    u.onend = () => setStatus('idle');
    u.onerror = (e) => {
        console.error("Speech error", e);
        setStatus('idle');
    };
    
    utterance.current = u;
    synth.current.speak(u);
    setStatus('playing');
  };

  const handleStop = () => {
    if (!synth.current) return;
    synth.current.cancel();
    setStatus('idle');
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-1 bg-base-200/50 rounded-full p-1 transition-all duration-300 border border-transparent hover:border-base-300">
      {status === 'idle' ? (
        <button 
            onClick={handlePlay} 
            className="btn btn-circle btn-ghost btn-sm text-primary tooltip tooltip-left"
            data-tip="Read Question"
        >
          <Volume2 size={20} />
        </button>
      ) : (
        <div className="flex items-center animate-in fade-in zoom-in duration-200">
           <button onClick={handlePlay} className="btn btn-circle btn-ghost btn-sm text-primary">
             {status === 'playing' ? <Pause size={20} /> : <Play size={20} />}
           </button>
           <button onClick={handleStop} className="btn btn-circle btn-ghost btn-sm text-error ml-1">
             <Square size={16} className="fill-current" />
           </button>
           
           {/* Visualizer placeholder */}
           {status === 'playing' && (
               <div className="flex gap-0.5 mx-1 h-3 items-end">
                   <div className="w-0.5 bg-primary/50 animate-[pulse_0.6s_ease-in-out_infinite] h-full"></div>
                   <div className="w-0.5 bg-primary/50 animate-[pulse_0.8s_ease-in-out_infinite] h-2/3"></div>
                   <div className="w-0.5 bg-primary/50 animate-[pulse_1.0s_ease-in-out_infinite] h-full"></div>
               </div>
           )}
        </div>
      )}
    </div>
  );
}
