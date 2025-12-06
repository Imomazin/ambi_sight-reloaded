'use client';

import { useState, useRef, useEffect } from 'react';
import { advisorResponses } from '@/lib/demoData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  confidence?: number;
  relatedMetrics?: string[];
}

interface AdvisorChatProps {
  onMetricsUpdate?: (metrics: string[]) => void;
}

const suggestedPrompts = [
  'Where are my top 3 risk clusters right now?',
  'Which initiatives carry disproportionate downside?',
  'Show me early warning signals in Portfolio Beta',
  'How can I improve strategic agility?',
];

export default function AdvisorChat({ onMetricsUpdate }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Risk Advisor. I can help you understand risk clusters, identify early warning signals, and provide strategic recommendations based on your portfolio data. Try asking me a question or use one of the suggested prompts below.",
      confidence: 100,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const findResponse = (query: string): typeof advisorResponses[0] | null => {
    const lowerQuery = query.toLowerCase();

    for (const response of advisorResponses) {
      const matchCount = response.keywords.filter((kw) =>
        lowerQuery.includes(kw.toLowerCase())
      ).length;
      if (matchCount >= 2) {
        return response;
      }
    }

    for (const response of advisorResponses) {
      if (response.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))) {
        return response;
      }
    }

    return null;
  };

  const handleSubmit = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const matchedResponse = findResponse(query);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: matchedResponse
        ? matchedResponse.response
        : "I understand you're asking about strategic intelligence. While I don't have a specific pre-built response for that query, I can analyze your portfolio data. Try asking about risk clusters, initiative health, early warning signals, or strategic agility improvements.",
      confidence: matchedResponse?.confidence || 65,
      relatedMetrics: matchedResponse?.relatedMetrics,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);

    if (matchedResponse?.relatedMetrics) {
      onMetricsUpdate?.(matchedResponse.relatedMetrics);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-teal-500/20 border border-teal-500/30 text-gray-200'
                  : 'bg-navy-600 border border-navy-500 text-gray-300'
              }`}
            >
              {message.type === 'ai' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-teal-400">AI Advisor</span>
                  {message.confidence && (
                    <span className="text-xs text-gray-500 ml-auto">{message.confidence}% confidence</span>
                  )}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.relatedMetrics && (
                <div className="mt-3 pt-3 border-t border-navy-500">
                  <span className="text-xs text-gray-500">Related metrics: </span>
                  {message.relatedMetrics.map((metric, i) => (
                    <span key={metric} className="text-xs text-teal-400">
                      {metric}{i < message.relatedMetrics!.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-navy-600 border border-navy-500 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="p-4 border-t border-navy-600">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSubmit(prompt)}
              disabled={isTyping}
              className="px-3 py-1.5 text-xs bg-navy-600 border border-navy-500 rounded-full text-gray-300 hover:text-white hover:border-teal-500/50 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(input);
              }
            }}
            placeholder="Ask me anything about your strategic risks..."
            className="flex-1 px-4 py-3 bg-navy-800 border border-navy-600 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-400"
          />
          <button
            onClick={() => handleSubmit(input)}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
