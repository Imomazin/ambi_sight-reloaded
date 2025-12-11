'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function VoiceInput({
  onTranscript,
  onListeningChange,
  disabled = false,
  className = ''
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (event.results[0].isFinal) {
        onTranscript(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
      stopVolumeAnalysis();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      onListeningChange?.(false);
      stopVolumeAnalysis();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopVolumeAnalysis();
    };
  }, [onTranscript, onListeningChange]);

  const startVolumeAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      source.connect(analyzerRef.current);

      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);

      const updateVolume = () => {
        if (analyzerRef.current) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setVolume(average / 128); // Normalize to 0-1
        }
        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error('Failed to access microphone:', error);
    }
  }, []);

  const stopVolumeAnalysis = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setVolume(0);
  }, []);

  const toggleListening = async () => {
    if (disabled || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onListeningChange?.(false);
    } else {
      try {
        await startVolumeAnalysis();
        recognitionRef.current.start();
        setIsListening(true);
        onListeningChange?.(true);
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <button
        className={`voice-input-btn unsupported ${className}`}
        disabled
        title="Voice input not supported in this browser"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        <style jsx>{`
          .voice-input-btn.unsupported {
            opacity: 0.5;
            cursor: not-allowed;
            padding: 10px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 50%;
            color: var(--text-muted);
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      className={`voice-input-btn ${isListening ? 'listening' : ''} ${className}`}
      onClick={toggleListening}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      <div className="mic-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </div>

      {isListening && (
        <div className="pulse-rings">
          <div className="ring ring-1" style={{ transform: `scale(${1 + volume * 0.5})` }} />
          <div className="ring ring-2" style={{ transform: `scale(${1 + volume * 0.3})` }} />
          <div className="ring ring-3" style={{ transform: `scale(${1 + volume * 0.2})` }} />
        </div>
      )}

      <style jsx>{`
        .voice-input-btn {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 2px solid var(--border);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voice-input-btn:hover:not(:disabled) {
          border-color: var(--accent);
          background: var(--bg-tertiary);
        }

        .voice-input-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .voice-input-btn.listening {
          background: linear-gradient(135deg, #ef4444, #f97316);
          border-color: transparent;
          animation: glow-pulse 1.5s ease-in-out infinite;
        }

        .voice-input-btn.listening .mic-icon {
          color: white;
        }

        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.2);
          }
        }

        .mic-icon {
          position: relative;
          z-index: 2;
          transition: color 0.2s ease;
        }

        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ring {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.3);
          top: -24px;
          left: -24px;
          transition: transform 0.1s ease;
        }

        .ring-1 {
          animation: pulse-ring 1.5s ease-in-out infinite;
        }

        .ring-2 {
          animation: pulse-ring 1.5s ease-in-out 0.3s infinite;
        }

        .ring-3 {
          animation: pulse-ring 1.5s ease-in-out 0.6s infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
