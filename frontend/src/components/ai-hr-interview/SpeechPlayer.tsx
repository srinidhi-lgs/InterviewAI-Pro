'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, PlayCircle } from 'lucide-react';

interface SpeechPlayerProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function SpeechPlayer({ text, autoPlay = true, onStart, onEnd }: SpeechPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  
  const lastSpokenText = useRef<string | null>(null);
  const isMounted = useRef(true);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesChangedHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (voicesChangedHandlerRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandlerRef.current);
        voicesChangedHandlerRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (activeUtteranceRef.current) {
          activeUtteranceRef.current.onstart = null;
          activeUtteranceRef.current.onend = null;
          activeUtteranceRef.current.onerror = null;
          activeUtteranceRef.current = null;
        }
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, []);

  const getPreferredVoice = (voices: SpeechSynthesisVoice[]) => {
    const preferences = ["Google US English", "Microsoft David", "Microsoft Aria"];
    
    for (const pref of preferences) {
      const voice = voices.find(v => v.name.includes(pref) || v.name === pref);
      if (voice) return voice;
    }
    
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) return enVoice;
    
    return voices.length > 0 ? voices[0] : null;
  };

  const speak = useCallback((textToSpeak: string, isReplay = false) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (isMuted || !textToSpeak || !textToSpeak.trim()) return;
    
    if (!isReplay && lastSpokenText.current === textToSpeak) return;
    
    const doSpeak = (voices: SpeechSynthesisVoice[]) => {
      if (!isMounted.current) return;
      
      if (activeUtteranceRef.current) {
        activeUtteranceRef.current.onstart = null;
        activeUtteranceRef.current.onend = null;
        activeUtteranceRef.current.onerror = null;
        activeUtteranceRef.current = null;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
      activeUtteranceRef.current = utterance;
      const voice = getPreferredVoice(voices);
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        if (!isMounted.current) return;
        setIsPlaying(true);
        setNeedsInteraction(false);
        lastSpokenText.current = textToSpeak;
        if (onStart) onStart();
      };
      
      utterance.onend = () => {
        if (!isMounted.current) return;
        activeUtteranceRef.current = null;
        setIsPlaying(false);
        if (onEnd) onEnd();
      };
      
      utterance.onerror = (e) => {
        if (!isMounted.current) return;
        activeUtteranceRef.current = null;
        
        // Canceled or interrupted errors occur naturally on navigation, question change, or mute
        if (e.error === 'canceled' || e.error === 'interrupted') {
          setIsPlaying(false);
          return;
        }

        console.error("SpeechSynthesis error:", {
          errorType: e.error || 'unknown',
          utteranceText: textToSpeak,
          selectedVoiceName: voice?.name || 'default'
        });
        
        setIsPlaying(false);
        
        if (e.error === 'not-allowed') {
          setNeedsInteraction(true);
        }
        
        // Ensure interview flow does not hang on speech error
        if (onEnd) onEnd();
      };
      
      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Failed to execute speak:", e);
        setIsPlaying(false);
        if (onEnd) onEnd();
      }
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak(voices);
    } else {
      if (voicesChangedHandlerRef.current) {
        window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandlerRef.current);
        voicesChangedHandlerRef.current = null;
      }
      const handleVoicesChanged = () => {
        if (voicesChangedHandlerRef.current) {
          window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandlerRef.current);
          voicesChangedHandlerRef.current = null;
        }
        doSpeak(window.speechSynthesis.getVoices());
      };
      voicesChangedHandlerRef.current = handleVoicesChanged;
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }
  }, [isMuted, onStart, onEnd]);

  useEffect(() => {
    if (autoPlay && text) {
      speak(text, false);
    }
  }, [text, autoPlay, speak]);

  useEffect(() => {
    if (!needsInteraction) return;

    const handleInteraction = () => {
      setNeedsInteraction(false);
      speak(text, true);
    };

    window.addEventListener('click', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
    };
  }, [needsInteraction, text, speak]);

  const toggleMute = () => {
    const willBeMuted = !isMuted;
    setIsMuted(willBeMuted);
    
    if (willBeMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (activeUtteranceRef.current) {
        activeUtteranceRef.current.onstart = null;
        activeUtteranceRef.current.onend = null;
        activeUtteranceRef.current.onerror = null;
        activeUtteranceRef.current = null;
      }
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      setIsPlaying(false);
    }
  };

  const replay = () => {
    speak(text, true);
  };

  return (
    <div className="flex items-center gap-2">
      {needsInteraction && (
        <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse mr-2">
          Click anywhere to enable AI voice.
        </span>
      )}
      
      <button 
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
        title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      
      <button 
        onClick={replay}
        disabled={isPlaying || isMuted || !text}
        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 disabled:opacity-50"
        title="Play Again"
      >
        <PlayCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
