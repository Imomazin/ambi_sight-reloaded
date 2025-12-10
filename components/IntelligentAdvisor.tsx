'use client';

import { useState, useRef, useEffect } from 'react';
import { useProjectState, WorkflowStep, getStepLabel } from '@/state/useProjectState';
import { useAppState } from '@/state/useAppState';

interface Message {
  id: string;
  role: 'user' | 'advisor';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AdvisorProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  primaryColor: string;
  secondaryColor: string;
}

const advisorProfiles: AdvisorProfile[] = [
  {
    id: 'aria',
    name: 'Aria',
    role: 'Strategic Consultant',
    avatar: '👩‍💼',
    primaryColor: '#A855F7',
    secondaryColor: '#EC4899',
  },
  {
    id: 'max',
    name: 'Max',
    role: 'Business Analyst',
    avatar: '👨‍💼',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
  },
];

// Context-aware response generation
function generateResponse(
  query: string,
  context: {
    step: WorkflowStep;
    projectName?: string;
    orgProfile?: any;
    diagnostics?: any[];
  }
): { response: string; suggestions: string[] } {
  const queryLower = query.toLowerCase();
  const { step, projectName, orgProfile, diagnostics } = context;

  // SWOT-related queries
  if (queryLower.includes('swot') || queryLower.includes('strength') || queryLower.includes('weakness')) {
    if (orgProfile?.industry) {
      return {
        response: `For a ${orgProfile.size} ${orgProfile.industry} company like ${projectName || 'yours'}, here's my SWOT guidance:\n\n**Strengths** to explore: Core competencies, market position, team expertise, proprietary assets.\n\n**Weaknesses** to address: Resource gaps, skill shortages, process inefficiencies, competitive disadvantages.\n\n**Opportunities**: Market trends in ${orgProfile.industry}, emerging technologies, partnership possibilities, underserved segments.\n\n**Threats**: Competitive pressure, regulatory changes, economic factors, technology disruption.\n\nWould you like me to help you dig deeper into any of these areas?`,
        suggestions: ['Analyze our strengths', 'Identify market opportunities', 'What threats should we watch?'],
      };
    }
    return {
      response: `SWOT Analysis is a powerful framework for strategic assessment. It helps you map:\n\n• **Strengths**: What you do well internally\n• **Weaknesses**: Areas needing improvement\n• **Opportunities**: External factors you can leverage\n• **Threats**: External risks to prepare for\n\nI recommend starting with strengths - what does your organization do better than competitors?`,
      suggestions: ['Start SWOT analysis', 'Give me examples', 'What questions should I ask?'],
    };
  }

  // Industry-specific guidance
  if (queryLower.includes('industry') || queryLower.includes('sector') || queryLower.includes('market')) {
    if (orgProfile?.industry) {
      const industryInsights: Record<string, string> = {
        'Technology': 'In tech, speed to market and innovation cycles are critical. Focus on R&D velocity, talent acquisition, and platform scalability.',
        'Healthcare': 'Healthcare requires balancing innovation with compliance. Consider regulatory pathways, patient outcomes, and payer relationships.',
        'Finance': 'Financial services face digital disruption and regulatory pressure. Prioritize security, customer trust, and operational efficiency.',
        'Retail': 'Retail success depends on omnichannel presence and customer experience. Focus on supply chain, personalization, and digital transformation.',
        'Manufacturing': 'Manufacturing excellence comes from operational efficiency and supply chain resilience. Consider automation, quality, and sustainability.',
      };
      const insight = industryInsights[orgProfile.industry] || `The ${orgProfile.industry} sector has unique dynamics. Let's explore the key success factors specific to your market position.`;
      return {
        response: insight,
        suggestions: ['What are key success factors?', 'Who are main competitors?', 'What trends should we watch?'],
      };
    }
    return {
      response: `Industry analysis is crucial for strategic positioning. Tell me about your industry, and I'll provide specific insights on market dynamics, competitive forces, and growth opportunities.`,
      suggestions: ['We\'re in technology', 'We\'re in healthcare', 'We\'re in retail'],
    };
  }

  // Growth and scaling
  if (queryLower.includes('growth') || queryLower.includes('scale') || queryLower.includes('expand')) {
    return {
      response: `Growth strategy depends on your current stage and resources. Key approaches include:\n\n1. **Market Penetration**: Grow share in existing markets\n2. **Market Development**: Enter new geographies or segments\n3. **Product Development**: Create new offerings for current customers\n4. **Diversification**: New products for new markets (highest risk)\n\nBased on ${orgProfile?.growthStage || 'your'} stage, I'd recommend focusing on ${orgProfile?.growthStage === 'early' ? 'market penetration and product-market fit' : 'sustainable scaling and operational excellence'}.`,
      suggestions: ['How do we prioritize?', 'What resources do we need?', 'Show me growth frameworks'],
    };
  }

  // Risk-related queries
  if (queryLower.includes('risk') || queryLower.includes('threat') || queryLower.includes('challenge')) {
    return {
      response: `Risk assessment is essential for strategic planning. Let me help you categorize risks:\n\n**Strategic Risks**: Market shifts, competitive disruption\n**Operational Risks**: Process failures, supply chain issues\n**Financial Risks**: Cash flow, funding, currency\n**Compliance Risks**: Regulatory changes, legal exposure\n\n${orgProfile?.challenges?.length ? `Based on your stated challenges (${orgProfile.challenges.slice(0, 2).join(', ')}), I'd prioritize addressing those first.` : 'What challenges concern you most?'}`,
      suggestions: ['Assess our top risks', 'Create mitigation plan', 'What should we monitor?'],
    };
  }

  // Next steps and recommendations
  if (queryLower.includes('next') || queryLower.includes('recommend') || queryLower.includes('suggest') || queryLower.includes('should')) {
    const stepRecommendations: Record<WorkflowStep, string> = {
      discover: `Great start on discovery! Based on what you've shared, I recommend:\n\n1. Complete your organization profile fully\n2. Document your top 3 strategic priorities\n3. Identify key stakeholders for the strategy process\n\nOnce ready, we'll move to **Diagnose** where we'll run analytical frameworks.`,
      diagnose: `You're in the diagnostic phase. I recommend:\n\n1. Complete a SWOT analysis first - it's foundational\n2. Then run Porter's Five Forces for competitive context\n3. Consider PESTEL for macro-environmental factors\n\nEach tool builds on the previous insights.`,
      design: `In the Design phase, let's build your strategic framework:\n\n1. Create your Business Model Canvas\n2. Define 3-5 strategic OKRs\n3. Map out initiative dependencies\n\nThis will give you a clear blueprint for execution.`,
      decide: `Time to make strategic choices:\n\n1. Use the Priority Matrix to rank initiatives\n2. Build a phased roadmap\n3. Run scenario analysis on top choices\n\nLet's ensure your decisions are data-driven.`,
      deliver: `Execution time! Focus on:\n\n1. Break strategy into quarterly milestones\n2. Assign clear ownership for each initiative\n3. Set up tracking dashboards\n\nI'll help you stay on course with regular check-ins.`,
    };
    return {
      response: stepRecommendations[step],
      suggestions: [`Start ${getStepLabel(step)} tasks`, 'Show me examples', 'What tools should I use?'],
    };
  }

  // Help and guidance
  if (queryLower.includes('help') || queryLower.includes('how') || queryLower.includes('what')) {
    return {
      response: `I'm here to guide you through strategic planning. In the **${getStepLabel(step)}** phase, we focus on ${step === 'discover' ? 'understanding your organization' : step === 'diagnose' ? 'analyzing your current position' : step === 'design' ? 'building strategic frameworks' : step === 'decide' ? 'making informed choices' : 'executing and tracking'}.\n\nYou can ask me about:\n• Strategic frameworks (SWOT, Porter's, PESTEL)\n• Industry-specific insights\n• Growth strategies\n• Risk assessment\n• Next steps and recommendations\n\nWhat would you like to explore?`,
      suggestions: ['Tell me about SWOT', 'What should I do first?', 'Analyze my industry'],
    };
  }

  // Default contextual response
  const defaultResponses: Record<WorkflowStep, string> = {
    discover: `Great question! In the Discovery phase, we're building a foundation for your strategy. ${projectName ? `For ${projectName}, ` : ''}I recommend starting with your organization's core challenges and goals. What keeps your leadership up at night?`,
    diagnose: `In Diagnosis, we use analytical frameworks to understand your position. ${diagnostics?.length ? `You've completed ${diagnostics.length} diagnostic(s) - great progress! ` : ''}Let's dig into the data. Would you like to start with a SWOT analysis or competitive assessment?`,
    design: `The Design phase is where strategy takes shape. We'll build frameworks that translate insights into action. What aspect of your strategy would you like to design first - business model, objectives, or competitive positioning?`,
    decide: `Decision time! We need to prioritize and commit. The best strategies are specific and actionable. What's the most critical decision your organization needs to make?`,
    deliver: `Execution separates good strategies from great outcomes. Let's make sure you have clear milestones, ownership, and tracking. What's your biggest execution challenge?`,
  };

  return {
    response: defaultResponses[step],
    suggestions: ['Give me specific advice', 'What tools should I use?', 'Show me examples'],
  };
}

export default function IntelligentAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState(advisorProfiles[0]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getActiveProject } = useProjectState();
  const { incrementAiQueries } = useAppState();
  const project = getActiveProject();

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      const greeting = project
        ? `Hello! I'm ${activeAdvisor.name}, your strategic advisor. I see you're working on "${project.name}" in the ${getStepLabel(project.currentStep)} phase. How can I help you today?`
        : `Hello! I'm ${activeAdvisor.name}, your strategic advisor. I'm here to guide you through the strategy process. What would you like to work on?`;

      setMessages([
        {
          id: 'greeting',
          role: 'advisor',
          content: greeting,
          timestamp: new Date(),
          suggestions: project
            ? [`Help me with ${getStepLabel(project.currentStep)}`, 'What should I do next?', 'Explain the process']
            : ['Start a new project', 'How does this work?', 'What can you help with?'],
        },
      ]);
    }
  }, [project?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));

    // Generate contextual response
    const { response, suggestions } = generateResponse(messageText, {
      step: project?.currentStep || 'discover',
      projectName: project?.name,
      orgProfile: project?.discover,
      diagnostics: project?.diagnose,
    });

    const advisorMessage: Message = {
      id: `msg-${Date.now()}-advisor`,
      role: 'advisor',
      content: response,
      timestamp: new Date(),
      suggestions,
    };

    setMessages((prev) => [...prev, advisorMessage]);
    setIsTyping(false);
    incrementAiQueries();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const switchAdvisor = () => {
    const currentIndex = advisorProfiles.findIndex((p) => p.id === activeAdvisor.id);
    const nextIndex = (currentIndex + 1) % advisorProfiles.length;
    setActiveAdvisor(advisorProfiles[nextIndex]);
  };

  return (
    <div className="intelligent-advisor">
      {/* Advisor Header */}
      <div className="advisor-header">
        <div className="advisor-profile" onClick={switchAdvisor}>
          <div
            className="avatar"
            style={{
              background: `linear-gradient(135deg, ${activeAdvisor.primaryColor}, ${activeAdvisor.secondaryColor})`,
            }}
          >
            <span>{activeAdvisor.avatar}</span>
            <span className="online-indicator" />
          </div>
          <div className="profile-info">
            <span className="name">{activeAdvisor.name}</span>
            <span className="role">{activeAdvisor.role}</span>
          </div>
          <button className="switch-btn" title="Switch advisor">
            ↔
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.role === 'advisor' && (
              <div
                className="message-avatar"
                style={{
                  background: `linear-gradient(135deg, ${activeAdvisor.primaryColor}, ${activeAdvisor.secondaryColor})`,
                }}
              >
                {activeAdvisor.avatar}
              </div>
            )}
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="suggestions">
                  {message.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="suggestion-btn"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message advisor">
            <div
              className="message-avatar"
              style={{
                background: `linear-gradient(135deg, ${activeAdvisor.primaryColor}, ${activeAdvisor.secondaryColor})`,
              }}
            >
              {activeAdvisor.avatar}
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about strategy..."
        />
        <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

      <style jsx>{`
        .intelligent-advisor {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .advisor-header {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-tertiary);
        }

        .advisor-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #22C55E;
          border: 2px solid var(--bg-tertiary);
          border-radius: 50%;
        }

        .profile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .role {
          font-size: 12px;
          color: var(--text-muted);
        }

        .switch-btn {
          padding: 8px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
        }

        .switch-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 80%;
        }

        .message-text {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.advisor .message-text {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .message.user .message-text {
          background: linear-gradient(135deg, ${activeAdvisor.primaryColor}, ${activeAdvisor.secondaryColor});
          color: white;
          border-bottom-right-radius: 4px;
        }

        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .suggestion-btn {
          padding: 8px 14px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-btn:hover {
          border-color: ${activeAdvisor.primaryColor};
          color: ${activeAdvisor.primaryColor};
          background: rgba(168, 85, 247, 0.1);
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 16px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .input-container {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-top: 1px solid var(--border);
          background: var(--bg-tertiary);
        }

        .input-container input {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }

        .input-container input:focus {
          border-color: ${activeAdvisor.primaryColor};
        }

        .input-container input::placeholder {
          color: var(--text-muted);
        }

        .send-btn {
          padding: 12px 16px;
          background: linear-gradient(135deg, ${activeAdvisor.primaryColor}, ${activeAdvisor.secondaryColor});
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
