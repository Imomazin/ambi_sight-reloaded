'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useAppState } from '@/state/useAppState';
import { PlanBadge, ProTag } from '@/components/LockedFeature';
import {
  generateAdvisorResponse,
  strategyPrompts,
  type AdvisorResponse,
  type StrategyPrompt,
} from '@/lib/advisorResponses';
import { roleDisplayNames } from '@/lib/users';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  response?: AdvisorResponse;
  timestamp: Date;
}

// Prompt Button Component
function PromptButton({
  prompt,
  onClick,
  disabled,
}: {
  prompt: StrategyPrompt;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-4 bg-navy-700/50 hover:bg-navy-600/50 border border-navy-600 hover:border-teal-500/30 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{prompt.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white group-hover:text-teal-400 transition-colors">
            {prompt.label}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{prompt.description}</div>
        </div>
        <svg
          className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors opacity-0 group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// Structured AI Response Component
function AIResponseCard({ response }: { response: AdvisorResponse }) {
  const { currentUser } = useAppState();
  const userPlan = currentUser?.plan || 'Free';

  return (
    <div className="space-y-4">
      {/* Diagnosis Section */}
      <div className="p-4 bg-navy-700/30 rounded-xl border border-navy-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Diagnosis</h4>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{response.diagnosis}</p>
      </div>

      {/* Suggested Tools Section */}
      <div className="p-4 bg-navy-700/30 rounded-xl border border-navy-600">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Suggested Tools</h4>
        </div>
        <div className="grid gap-2">
          {response.suggestedTools.map((tool) => (
            <div
              key={tool.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                tool.isProOnly && userPlan === 'Free'
                  ? 'bg-navy-800/50 opacity-75'
                  : 'bg-navy-800 hover:bg-navy-700/80'
              } transition-colors`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white font-medium">{tool.name}</span>
                  {tool.isProOnly && userPlan === 'Free' && <ProTag />}
                </div>
                <span className="text-xs text-gray-400">{tool.description}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                tool.complexity === 'Intro'
                  ? 'bg-green-500/20 text-green-400'
                  : tool.complexity === 'Intermediate'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {tool.complexity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions Section */}
      <div className="p-4 bg-navy-700/30 rounded-xl border border-navy-600">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-lime-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-lime-400 uppercase tracking-wider">Recommended Actions</h4>
        </div>
        <div className="space-y-2">
          {response.recommendedActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.link || '/workspace'}
              className="flex items-center gap-3 p-3 bg-navy-800 hover:bg-navy-700/80 rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center text-lime-400 group-hover:bg-lime-500/20 transition-colors">
                <span className="text-sm font-bold">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium group-hover:text-lime-400 transition-colors">
                  {action.title}
                </div>
                <div className="text-xs text-gray-400">{action.description}</div>
              </div>
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-lime-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Follow-up Questions */}
      <div className="p-4 bg-navy-700/30 rounded-xl border border-navy-600">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Follow-up Questions</h4>
        </div>
        <div className="space-y-2">
          {response.followUpQuestions.map((question, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-amber-400">•</span>
              <span>{question}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consulting Upsell */}
      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-teal-500/10 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">{response.consultingNote}</p>
            <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition-colors">
              Request Discovery Call
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdvisorPage() {
  const { currentUser } = useAppState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = generateAdvisorResponse(query, currentUser);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '',
      response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  return (
    <AppShell>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Left Panel - Guided Prompts */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="card flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">AI Strategy Advisor</h2>
              <p className="text-sm text-gray-400 mt-1">
                What are you trying to solve today?
              </p>
            </div>

            {/* User Context Badge */}
            {currentUser && (
              <div className="mb-4 p-3 bg-navy-700/50 rounded-xl border border-navy-600">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400">Advising as:</span>
                  <PlanBadge plan={currentUser.plan} size="sm" />
                </div>
                <div className="text-sm text-white font-medium">{currentUser.name}</div>
                <div className="text-xs text-gray-400">{roleDisplayNames[currentUser.role]} - {currentUser.company}</div>
              </div>
            )}

            {/* Pre-made Prompt Buttons */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Quick Actions
              </div>
              {strategyPrompts.map((prompt) => (
                <PromptButton
                  key={prompt.id}
                  prompt={prompt}
                  onClick={() => handleSubmit(prompt.prompt)}
                  disabled={isTyping}
                />
              ))}
            </div>

            {/* Custom Input */}
            <div className="mt-4 pt-4 border-t border-navy-600">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Or Ask Your Own Question
              </div>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(input);
                    }
                  }}
                  placeholder="Type your strategic question..."
                  className="w-full h-20 bg-navy-800 border border-navy-600 rounded-xl p-3 text-sm text-gray-200 placeholder-gray-500 resize-none focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={() => handleSubmit(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute bottom-3 right-3 p-2 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Conversation */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="card flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Advisor Response</h2>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear conversation
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 via-purple-500 to-magenta-400 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ready to Help</h3>
                  <p className="text-sm text-gray-400 max-w-sm">
                    Select a quick action from the left panel or ask your own strategic question.
                    I'll provide diagnosis, tool recommendations, and actionable next steps.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id}>
                    {message.type === 'user' ? (
                      <div className="flex justify-end mb-4">
                        <div className="max-w-[80%] p-4 bg-teal-500/20 border border-teal-500/30 rounded-2xl rounded-tr-sm">
                          <p className="text-sm text-gray-200">{message.content}</p>
                          <span className="text-[10px] text-gray-500 mt-2 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white">AI Strategy Advisor</span>
                            {message.response && (
                              <span className="ml-2 text-xs text-gray-400">
                                {message.response.confidence}% confidence
                              </span>
                            )}
                          </div>
                        </div>
                        {message.response && <AIResponseCard response={message.response} />}
                      </div>
                    )}
                  </div>
                ))
              )}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="p-3 bg-navy-700 rounded-2xl rounded-tl-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
