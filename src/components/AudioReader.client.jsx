'use client';
import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioReader({ text }) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <button onClick={speak} className="btn btn-circle btn-ghost btn-sm" aria-label="Read question">
      {speaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
}
