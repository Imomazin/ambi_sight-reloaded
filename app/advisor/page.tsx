'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import AIAssistant from '@/components/AIAssistant';

export default function AdvisorPage() {
  const [viewMode, setViewMode] = useState<'interactive' | 'classic'>('interactive');

  return (
    <AppShell>
      <div className="h-[calc(100vh-8rem)]">
        {/* Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">AI Strategy Advisor</h1>
            <p className="text-sm text-[var(--text-muted)]">Your personal strategic intelligence assistant</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-card)] rounded-xl p-1 border border-[var(--border-color)]">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'interactive'
                  ? 'bg-teal-500 text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Interactive AI
            </button>
            <button
              onClick={() => setViewMode('classic')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'classic'
                  ? 'bg-teal-500 text-white'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Classic View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-4rem)] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden">
          {viewMode === 'interactive' ? (
            <AIAssistant embedded />
          ) : (
            <ClassicAdvisorView />
          )}
        </div>
      </div>
    </AppShell>
  );
}

// Classic view component (original advisor UI)
import Link from 'next/link';
import { useAppState } from '@/state/useAppState';
import { PlanBadge, ProTag } from '@/components/LockedFeature';
import {
  generateAdvisorResponse,
  strategyPrompts,
  type AdvisorResponse,
  type StrategyPrompt,
} from '@/lib/advisorResponses';
import { roleDisplayNames } from '@/lib/users';
import DataUploadButton from '@/components/DataUploadButton';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  response?: AdvisorResponse;
  timestamp: Date;
}

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
      className="w-full text-left p-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-color)] hover:border-teal-500/30 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{prompt.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[var(--text-primary)] group-hover:text-teal-400 transition-colors">
            {prompt.label}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5">{prompt.description}</div>
        </div>
      </div>
    </button>
  );
}

function AIResponseCard({ response }: { response: AdvisorResponse }) {
  const { currentUser } = useAppState();
  const userPlan = currentUser?.plan || 'Free';

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">Diagnosis</h4>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{response.diagnosis}</p>
      </div>

      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
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
                  ? 'bg-[var(--bg-card)] opacity-75'
                  : 'bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]'
              } transition-colors`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--text-primary)] font-medium">{tool.name}</span>
                  {tool.isProOnly && userPlan === 'Free' && <ProTag />}
                </div>
                <span className="text-xs text-[var(--text-muted)]">{tool.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
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
              className="flex items-center gap-3 p-3 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center text-lime-400 group-hover:bg-lime-500/20 transition-colors">
                <span className="text-sm font-bold">{idx + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[var(--text-primary)] font-medium group-hover:text-lime-400 transition-colors">
                  {action.title}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{action.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClassicAdvisorView() {
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
    <div className="flex gap-6 h-full p-6">
      <div className="w-80 flex-shrink-0 flex flex-col">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            <DataUploadButton label="Upload" variant="compact" />
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Select a strategy topic
          </p>
        </div>

        {currentUser && (
          <div className="mb-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[var(--text-muted)]">Advising as:</span>
              <PlanBadge plan={currentUser.plan} size="sm" />
            </div>
            <div className="text-sm text-[var(--text-primary)] font-medium">{currentUser.name}</div>
            <div className="text-xs text-[var(--text-muted)]">{roleDisplayNames[currentUser.role]}</div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {strategyPrompts.map((prompt) => (
            <PromptButton
              key={prompt.id}
              prompt={prompt}
              onClick={() => handleSubmit(prompt.prompt)}
              disabled={isTyping}
            />
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
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
              placeholder="Type your question..."
              className="w-full h-20 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-teal-400"
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Advisor Response</h2>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 via-purple-500 to-pink-400 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Ready to Help</h3>
              <p className="text-sm text-[var(--text-muted)] max-w-sm">
                Select a quick action or ask your own strategic question.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[80%] p-4 bg-teal-500/20 border border-teal-500/30 rounded-2xl rounded-tr-sm">
                      <p className="text-sm text-[var(--text-secondary)]">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">Strategic Advisor</span>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="p-3 bg-[var(--bg-secondary)] rounded-2xl rounded-tl-sm">
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
  );
}
