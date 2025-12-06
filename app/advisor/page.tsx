'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { advisorResponses, riskCategories } from '@/lib/demoData';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  confidence?: number;
  relatedMetrics?: string[];
}

const suggestedPrompts = [
  'Where are my top 3 risk clusters right now?',
  'Which initiatives carry disproportionate downside?',
  'Show me early warning signals in Portfolio Beta',
  'How can I improve strategic agility?',
];

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your AI Risk Advisor. I can help you understand risk clusters, identify early warning signals, and provide strategic recommendations based on your portfolio data. Try asking me a question or use one of the suggested prompts below.",
      confidence: 100,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const radarData = riskCategories.map((cat) => ({
    subject: cat.name.replace(' Risk', ''),
    score: cat.score,
    fullMark: 100,
  }));

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

    // Single keyword match as fallback
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

    // Simulate AI thinking
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
  };

  return (
    <AppShell>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Panel - Input */}
        <div className="w-1/3 flex flex-col">
          <div className="card flex-1 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4">Ask the Advisor</h2>

            {/* Input Area */}
            <div className="mb-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(input);
                  }
                }}
                placeholder="Type your question here..."
                className="w-full h-32 bg-navy-800 border border-navy-600 rounded-xl p-4 text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={() => handleSubmit(input)}
                disabled={!input.trim() || isTyping}
                className="w-full mt-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTyping ? 'Thinking...' : 'Send Question'}
              </button>
            </div>

            {/* Suggested Prompts */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Suggested Questions</h3>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSubmit(prompt)}
                    disabled={isTyping}
                    className="w-full text-left p-3 bg-navy-800 hover:bg-navy-700 border border-navy-600 rounded-xl text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel - Conversation */}
        <div className="flex-1 flex flex-col">
          <div className="card flex-1 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold text-white mb-4">Conversation</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-teal-500/20 border border-teal-500/30 text-gray-200'
                        : 'bg-navy-700 border border-navy-600 text-gray-300'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs font-medium text-teal-400">AI Advisor</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.relatedMetrics && (
                      <div className="mt-3 pt-3 border-t border-navy-600">
                        <span className="text-xs text-gray-500">Related metrics: </span>
                        {message.relatedMetrics.map((metric, i) => (
                          <span key={metric} className="text-xs text-teal-400">
                            {metric}
                            {i < message.relatedMetrics!.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-navy-700 border border-navy-600 rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <div
                        className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Info */}
        <div className="w-80 space-y-6">
          {/* Confidence Indicator */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Advisor Confidence</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#252535"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="#2DD4BF"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${
                      ((messages[messages.length - 1]?.confidence || 0) / 100) * 220
                    } 220`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                  {messages[messages.length - 1]?.confidence || 0}%
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Based on data coverage and pattern matching
              </div>
            </div>
          </div>

          {/* Risk Radar */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Risk Categories</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#252535" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#6B7280', fontSize: 10 }}
                  />
                  <Radar
                    name="Risk Score"
                    dataKey="score"
                    stroke="#E879F9"
                    fill="#E879F9"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Risk Summary</h3>
            <div className="space-y-3">
              {riskCategories.slice(0, 4).map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        cat.score >= 50
                          ? 'text-amber-400'
                          : cat.score >= 30
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {cat.score}
                    </span>
                    <span
                      className={`text-xs ${
                        cat.trend === 'improving'
                          ? 'text-green-400'
                          : cat.trend === 'worsening'
                          ? 'text-red-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {cat.trend === 'improving' ? '↓' : cat.trend === 'worsening' ? '↑' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
