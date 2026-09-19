'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  isProcessing?: boolean;
}

export default function VoiceRecorder({ onInterimTranscript, onFinalTranscript, isProcessing = false }: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isRunningRef = useRef(false);
  const isStartingRef = useRef(false);
  const hasRetriedRef = useRef(false);
  const onFinalTranscriptRef = useRef(onFinalTranscript);
  const onInterimTranscriptRef = useRef(onInterimTranscript);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
    onInterimTranscriptRef.current = onInterimTranscript;
  }, [onFinalTranscript, onInterimTranscript]);

  useEffect(() => {
    if (isProcessing && (isRunningRef.current || isListening)) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      isRunningRef.current = false;
      isStartingRef.current = false;
      setIsListening(false);
    }
  }, [isProcessing, isListening]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isRunningRef.current = true;
        isStartingRef.current = false;
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
          isRunningRef.current = false;
          isStartingRef.current = false;
          setIsListening(false);
          hasRetriedRef.current = false;
          if (onFinalTranscriptRef.current) {
            onFinalTranscriptRef.current(finalTranscript);
          }
        } else if (interimTranscript) {
          if (onInterimTranscriptRef.current) {
            onInterimTranscriptRef.current(interimTranscript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        isRunningRef.current = false;
        isStartingRef.current = false;
        setIsListening(false);

        if (event.error !== 'aborted') {
          console.error('Speech recognition error', event.error);
        }

        if (event.error === 'aborted') {
          // Expected when stopped manually
        } else if (event.error === 'network') {
          if (!hasRetriedRef.current) {
            hasRetriedRef.current = true;
            try {
              isStartingRef.current = true;
              recognition.start();
            } catch(e) {
              isStartingRef.current = false;
              setError("Speech recognition unavailable. Please type your answer.");
            }
          } else {
            setError("Speech recognition unavailable. Please type your answer.");
          }
        } else if (event.error === 'not-allowed') {
          setError('Please allow microphone access.');
        } else if (event.error === 'audio-capture') {
          setError('No microphone detected.');
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Try again.');
        } else {
          setError('An unexpected error occurred.');
        }
      };

      recognition.onend = () => {
        isRunningRef.current = false;
        isStartingRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setError('Voice recording not supported in this browser. Please use text mode.');
    }

    return () => {
      isRunningRef.current = false;
      isStartingRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onstart = null;
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleRecording = () => {
    if (isProcessing) return;

    if (isRunningRef.current || isStartingRef.current || isListening) {
      isStartingRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        // ignore
      }
      isRunningRef.current = false;
      setIsListening(false);
    } else {
      if (isRunningRef.current || isStartingRef.current) return;
      setError(null);
      hasRetriedRef.current = false;
      isStartingRef.current = true;
      try {
        recognitionRef.current?.start();
      } catch (e: any) {
        isStartingRef.current = false;
        isRunningRef.current = false;
        setIsListening(false);
        if (e?.name !== 'InvalidStateError') {
          console.error("Failed to start recording:", e);
          setError("Could not start recording.");
        }
      }
    }
  };

  if (error) {
    return (
      <div className="text-sm text-red-500 mb-2">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleRecording}
        disabled={isProcessing}
        className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-colors ${
          isListening 
            ? 'bg-red-500 text-white hover:bg-red-600' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : isListening ? (
          <Square className="h-6 w-6 fill-current" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>
      
      {isListening && (
        <div className="mt-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-medium text-red-500">Listening...</span>
        </div>
      )}
    </div>
  );
}
