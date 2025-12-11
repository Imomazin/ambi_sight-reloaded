'use client';

import { useState, useRef, useEffect } from 'react';

// AI Assistant Profiles
interface AIProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  personality: string;
  avatar: string;
  voiceStyle: string;
  accentColor: string;
  greeting: string;
}

const aiProfiles: AIProfile[] = [
  {
    id: 'aria',
    name: 'Aria',
    gender: 'female',
    personality: 'Witty, insightful, and refreshingly direct. Like having a brilliant strategist friend who tells it like it is.',
    avatar: '👩‍💼',
    voiceStyle: 'Confident and warm',
    accentColor: 'from-purple-500 to-pink-500',
    greeting: "Hey! I'm Aria. Ready to cut through the noise and find what actually matters for your strategy? Let's go.",
  },
  {
    id: 'max',
    name: 'Max',
    gender: 'male',
    personality: 'Sharp, analytical, with a dry sense of humor. The strategist who sees patterns others miss.',
    avatar: '👨‍💼',
    voiceStyle: 'Calm and analytical',
    accentColor: 'from-blue-500 to-cyan-500',
    greeting: "I'm Max. Think of me as your strategic co-pilot - I'll help you navigate the complexity and spot the opportunities. What's on your mind?",
  },
];

// Sample responses with Grok-like personality
const sampleResponses: Record<string, string[]> = {
  greeting: [
    "Alright, let's get into it. What strategic puzzle are we solving today?",
    "Good to see you. I've been analyzing some interesting patterns - but first, what's your priority?",
  ],
  strategy: [
    "Here's the thing about strategy that most people get wrong - it's not about having all the answers, it's about asking better questions. What's the real problem you're trying to solve?",
    "Let me be direct: 80% of strategies fail because they're too complex. Let's find the one thing that'll move the needle most.",
  ],
  analysis: [
    "I've crunched the numbers. The data suggests three paths forward - but only one makes sense given your constraints. Want me to walk you through it?",
    "Interesting... I see a pattern here that might not be obvious. Your biggest opportunity isn't where you think it is.",
  ],
  humor: [
    "You know what's funny about competitive analysis? Everyone's so busy watching each other, nobody's watching the customer. Classic.",
    "If I had a dollar for every 'synergy' I've analyzed, I'd have enough to actually create some real synergy.",
  ],
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onClose?: () => void;
  embedded?: boolean;
}

export default function AIAssistant({ onClose, embedded = false }: AIAssistantProps) {
  const [selectedProfile, setSelectedProfile] = useState<AIProfile>(aiProfiles[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const greeting: Message = {
      id: 'greeting',
      role: 'assistant',
      content: selectedProfile.greeting,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, [selectedProfile]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return sampleResponses.greeting[Math.floor(Math.random() * sampleResponses.greeting.length)];
    }

    if (lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('goal')) {
      return sampleResponses.strategy[Math.floor(Math.random() * sampleResponses.strategy.length)];
    }

    if (lowerMessage.includes('data') || lowerMessage.includes('analysis') || lowerMessage.includes('numbers')) {
      return sampleResponses.analysis[Math.floor(Math.random() * sampleResponses.analysis.length)];
    }

    // Default contextual responses
    const contextualResponses = [
      `That's a solid question. Here's my take: the key isn't just understanding *what* to do, but *why* it matters now. Let me break this down...`,
      `I've seen this pattern before. The companies that succeed here typically focus on one thing: ruthless prioritization. What's your biggest constraint right now?`,
      `Okay, real talk - most advice you'll get on this is generic. Here's what actually works based on the data I've analyzed...`,
      `You're thinking about this the right way. But let me challenge one assumption - what if the opposite were true?`,
      `This is exactly the kind of thing where gut instinct and data need to work together. What does your intuition say?`,
    ];

    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    const response = generateResponse(inputValue);

    // Simulate typing effect
    setIsTyping(false);
    setIsSpeaking(true);

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Simulate speaking duration based on message length
    setTimeout(() => setIsSpeaking(false), Math.min(response.length * 30, 5000));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const switchProfile = (profile: AIProfile) => {
    setSelectedProfile(profile);
    setShowProfileSelector(false);
    setMessages([]);
  };

  const containerClass = embedded
    ? 'h-full flex flex-col'
    : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm';

  const modalClass = embedded
    ? 'h-full flex flex-col'
    : 'w-full max-w-2xl h-[80vh] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col overflow-hidden';

  return (
    <div className={containerClass}>
      <div className={modalClass}>
        {/* Header with Avatar */}
        <div className="relative p-4 border-b border-[var(--border-color)] bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-card)]">
          <div className="flex items-center gap-4">
            {/* Animated Avatar */}
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedProfile.accentColor} flex items-center justify-center text-3xl transition-all duration-300 ${
                  isSpeaking ? 'scale-105 animate-pulse' : ''
                }`}
              >
                {selectedProfile.avatar}
              </div>

              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="absolute -bottom-1 -right-1 flex gap-0.5">
                  <span className="w-1.5 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              {/* Online status */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[var(--bg-card)]">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">{selectedProfile.name}</h2>
                <button
                  onClick={() => setShowProfileSelector(!showProfileSelector)}
                  className="p-1 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{selectedProfile.personality}</p>
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Profile Selector Dropdown */}
          {showProfileSelector && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-xl z-10 overflow-hidden">
              {aiProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => switchProfile(profile)}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-card-hover)] transition-colors ${
                    selectedProfile.id === profile.id ? 'bg-[var(--bg-secondary)]' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${profile.accentColor} flex items-center justify-center text-xl`}>
                    {profile.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-[var(--text-primary)]">{profile.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{profile.voiceStyle}</div>
                  </div>
                  {selectedProfile.id === profile.id && (
                    <svg className="w-5 h-5 text-teal-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Video-like Avatar Display */}
        <div className="relative h-48 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
          {/* Background animation */}
          <div className="absolute inset-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${selectedProfile.accentColor} opacity-10`} />
            {/* Animated circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[var(--border-color)] opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-[var(--border-color)] opacity-20 animate-ping" style={{ animationDuration: '4s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[var(--border-color)] opacity-10 animate-ping" style={{ animationDuration: '5s' }} />
          </div>

          {/* Main Avatar */}
          <div className="relative z-10">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedProfile.accentColor} flex items-center justify-center text-5xl shadow-2xl transition-all duration-500 ${
                isSpeaking ? 'scale-110' : isTyping ? 'scale-95 opacity-80' : ''
              }`}
              style={{
                boxShadow: isSpeaking
                  ? `0 0 60px ${selectedProfile.gender === 'female' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
                  : 'none',
              }}
            >
              {selectedProfile.avatar}
            </div>

            {/* Speaking animation rings */}
            {isSpeaking && (
              <>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedProfile.accentColor} animate-ping opacity-30`} />
                <div className={`absolute -inset-2 rounded-full border-2 ${selectedProfile.gender === 'female' ? 'border-purple-400' : 'border-blue-400'} animate-pulse`} />
              </>
            )}
          </div>

          {/* Status text */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            {isTyping ? (
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
                <span>{selectedProfile.name} is thinking</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            ) : isSpeaking ? (
              <div className="flex items-center justify-center gap-2 text-sm text-teal-400">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span>{selectedProfile.name} is speaking</span>
              </div>
            ) : (
              <div className="text-sm text-[var(--text-muted)]">
                Ask me anything about strategy
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-teal-500 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-teal-200' : 'text-[var(--text-muted)]'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {['Analyze my data', 'Strategic advice', 'Market trends', 'Risk assessment'].map((action) => (
            <button
              key={action}
              onClick={() => {
                setInputValue(action);
                inputRef.current?.focus();
              }}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)] rounded-full transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            {/* Voice Input Button */}
            <button
              onClick={() => setIsListening(!isListening)}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${selectedProfile.name}...`}
                className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`p-3 rounded-xl transition-all ${
                inputValue.trim() && !isTyping
                  ? 'bg-teal-500 text-white hover:bg-teal-400'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
