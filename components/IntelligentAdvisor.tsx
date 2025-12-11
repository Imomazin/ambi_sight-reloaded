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
  specialty: string;
  avatar: string;
  primaryColor: string;
  secondaryColor: string;
  personality: string;
}

const advisorProfiles: AdvisorProfile[] = [
  {
    id: 'aria',
    name: 'Aria',
    role: 'Strategic Consultant',
    specialty: 'Corporate Strategy & Growth',
    avatar: '👩‍💼',
    primaryColor: '#A855F7',
    secondaryColor: '#EC4899',
    personality: 'analytical and insightful',
  },
  {
    id: 'max',
    name: 'Max',
    role: 'Business Analyst',
    specialty: 'Operations & Efficiency',
    avatar: '👨‍💼',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    personality: 'data-driven and precise',
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Innovation Director',
    specialty: 'Digital Transformation',
    avatar: '👩‍🔬',
    primaryColor: '#14B8A6',
    secondaryColor: '#22C55E',
    personality: 'creative and forward-thinking',
  },
];

// Comprehensive knowledge base for context-aware responses
const knowledgeBase = {
  frameworks: {
    swot: {
      name: 'SWOT Analysis',
      description: 'Strategic planning tool to identify Strengths, Weaknesses, Opportunities, and Threats',
      when: 'Use when you need a comprehensive overview of internal and external factors affecting your organization',
      steps: ['List internal Strengths', 'Identify internal Weaknesses', 'Explore external Opportunities', 'Assess external Threats'],
      tips: ['Be honest about weaknesses', 'Prioritize items by impact', 'Cross-reference quadrants for strategic insights'],
    },
    porter: {
      name: "Porter's Five Forces",
      description: 'Competitive analysis framework examining industry attractiveness',
      when: 'Use when evaluating market entry, competitive positioning, or industry dynamics',
      forces: ['Competitive Rivalry', 'Supplier Power', 'Buyer Power', 'Threat of Substitution', 'Threat of New Entry'],
      tips: ['Rate each force 1-5', 'Consider both current and future states', 'Identify actionable countermeasures'],
    },
    pestel: {
      name: 'PESTEL Analysis',
      description: 'Macro-environmental analysis framework',
      factors: ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'],
      when: 'Use for long-term strategic planning and understanding external environment',
    },
    canvas: {
      name: 'Business Model Canvas',
      description: 'Visual template for developing new or documenting existing business models',
      blocks: ['Key Partners', 'Key Activities', 'Key Resources', 'Value Propositions', 'Customer Relationships', 'Channels', 'Customer Segments', 'Cost Structure', 'Revenue Streams'],
    },
    okr: {
      name: 'OKRs (Objectives & Key Results)',
      description: 'Goal-setting framework for defining and tracking objectives and their outcomes',
      structure: 'One objective supported by 3-5 measurable key results',
      tips: ['Make objectives ambitious but achievable', 'Key results must be quantifiable', 'Review quarterly'],
    },
  },
  industries: {
    technology: {
      keyFactors: ['Innovation velocity', 'Talent acquisition', 'Platform scalability', 'IP protection'],
      trends: ['AI/ML integration', 'Cloud-native architecture', 'Edge computing', 'Zero-trust security'],
      metrics: ['ARR growth', 'Churn rate', 'NPS', 'CAC payback'],
    },
    healthcare: {
      keyFactors: ['Regulatory compliance', 'Patient outcomes', 'Payer relationships', 'Clinical efficacy'],
      trends: ['Telemedicine', 'Value-based care', 'Precision medicine', 'Healthcare AI'],
      metrics: ['Patient satisfaction', 'Readmission rates', 'Cost per patient', 'Clinical outcomes'],
    },
    finance: {
      keyFactors: ['Risk management', 'Regulatory capital', 'Customer trust', 'Digital transformation'],
      trends: ['Open banking', 'Embedded finance', 'DeFi', 'RegTech'],
      metrics: ['ROE', 'NIM', 'Cost-to-income ratio', 'NPL ratio'],
    },
    retail: {
      keyFactors: ['Omnichannel presence', 'Customer experience', 'Supply chain efficiency', 'Inventory management'],
      trends: ['Social commerce', 'Sustainability', 'Personalization', 'Same-day delivery'],
      metrics: ['Same-store sales', 'Conversion rate', 'Basket size', 'Customer lifetime value'],
    },
    manufacturing: {
      keyFactors: ['Operational efficiency', 'Quality control', 'Supply chain resilience', 'Workforce skills'],
      trends: ['Industry 4.0', 'Predictive maintenance', 'Sustainable manufacturing', 'Reshoring'],
      metrics: ['OEE', 'Defect rate', 'Inventory turns', 'Lead time'],
    },
  },
  growthStrategies: {
    marketPenetration: {
      description: 'Increase market share in existing markets with existing products',
      tactics: ['Competitive pricing', 'Increased promotion', 'Customer loyalty programs', 'Distribution expansion'],
      risk: 'Low',
    },
    marketDevelopment: {
      description: 'Enter new markets with existing products',
      tactics: ['Geographic expansion', 'New customer segments', 'New distribution channels', 'Strategic partnerships'],
      risk: 'Medium',
    },
    productDevelopment: {
      description: 'Develop new products for existing markets',
      tactics: ['R&D investment', 'Product line extensions', 'Feature additions', 'Adjacent innovation'],
      risk: 'Medium',
    },
    diversification: {
      description: 'New products for new markets',
      tactics: ['Acquisition', 'Joint ventures', 'Internal development', 'Corporate venturing'],
      risk: 'High',
    },
  },
};

// Enhanced context-aware response generation
function generateResponse(
  query: string,
  context: {
    step: WorkflowStep;
    projectName?: string;
    orgProfile?: any;
    diagnostics?: any[];
    frameworks?: any[];
    decisions?: any;
  },
  advisor: AdvisorProfile
): { response: string; suggestions: string[] } {
  const queryLower = query.toLowerCase();
  const { step, projectName, orgProfile, diagnostics, frameworks, decisions } = context;
  const industry = orgProfile?.industry?.toLowerCase() || '';
  const industryData = knowledgeBase.industries[industry as keyof typeof knowledgeBase.industries];

  // Greeting and introduction
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey')) {
    return {
      response: `Hello! I'm ${advisor.name}, and I specialize in ${advisor.specialty}. I'm ${advisor.personality}, so expect thorough analysis and actionable recommendations.\n\n${projectName ? `I see you're working on "${projectName}". ` : ''}What strategic challenge can I help you with today?`,
      suggestions: ['What can you help me with?', 'Tell me about the workflow', 'Give me strategic advice'],
    };
  }

  // SWOT Analysis queries
  if (queryLower.includes('swot') || (queryLower.includes('strength') && queryLower.includes('weakness'))) {
    const swot = knowledgeBase.frameworks.swot;
    let response = `**${swot.name}** is a foundational strategic tool.\n\n`;

    if (orgProfile?.industry) {
      response += `For a ${orgProfile.size || ''} ${orgProfile.industry} company:\n\n`;
      response += `**Strengths to Explore:**\n`;
      response += `• Core competencies and unique capabilities\n`;
      response += `• Market position and brand recognition\n`;
      response += `• Team expertise and organizational culture\n\n`;

      response += `**Weaknesses to Address:**\n`;
      response += `• Resource or skill gaps\n`;
      response += `• Process inefficiencies\n`;
      response += `• Competitive disadvantages\n\n`;

      if (industryData) {
        response += `**${orgProfile.industry}-Specific Opportunities:**\n`;
        industryData.trends.slice(0, 3).forEach(trend => {
          response += `• ${trend}\n`;
        });
        response += `\n`;
      }

      response += `**Threats to Monitor:**\n`;
      response += `• Competitive pressure and market disruption\n`;
      response += `• Regulatory and economic changes\n`;
      response += `• Technology obsolescence\n`;
    } else {
      response += `${swot.description}.\n\n`;
      response += `**When to use:** ${swot.when}\n\n`;
      response += `**Steps:**\n`;
      swot.steps.forEach((s, i) => {
        response += `${i + 1}. ${s}\n`;
      });
      response += `\n**Pro Tips:**\n`;
      swot.tips.forEach(tip => {
        response += `• ${tip}\n`;
      });
    }

    return {
      response,
      suggestions: ['Help me identify strengths', 'What opportunities should I consider?', 'Analyze potential threats'],
    };
  }

  // Porter's Five Forces
  if (queryLower.includes('porter') || queryLower.includes('five forces') || queryLower.includes('competitive')) {
    const porter = knowledgeBase.frameworks.porter;
    let response = `**${porter.name}** helps you understand competitive dynamics.\n\n`;
    response += `${porter.description}.\n\n**The Five Forces:**\n`;
    porter.forces.forEach((force, i) => {
      response += `${i + 1}. **${force}**\n`;
    });
    response += `\n**How to use it:**\n`;
    porter.tips.forEach(tip => {
      response += `• ${tip}\n`;
    });

    if (orgProfile?.industry) {
      response += `\nFor ${orgProfile.industry}, pay special attention to ${industryData?.keyFactors[0] || 'competitive differentiation'} and ${industryData?.keyFactors[1] || 'market positioning'}.`;
    }

    return {
      response,
      suggestions: ['Analyze competitive rivalry', 'Assess supplier power', 'Evaluate barriers to entry'],
    };
  }

  // Business Model Canvas
  if (queryLower.includes('canvas') || queryLower.includes('business model')) {
    const canvas = knowledgeBase.frameworks.canvas;
    let response = `**${canvas.name}** visualizes how your business creates, delivers, and captures value.\n\n`;
    response += `**The 9 Building Blocks:**\n`;
    canvas.blocks.forEach((block, i) => {
      response += `${i + 1}. ${block}\n`;
    });
    response += `\n**Starting point:** Begin with Value Propositions - what unique value do you offer? Then work outward to customers and backwards to resources and activities.`;

    return {
      response,
      suggestions: ['Define our value proposition', 'Map customer segments', 'Identify key resources'],
    };
  }

  // OKRs
  if (queryLower.includes('okr') || queryLower.includes('objective') || queryLower.includes('key result')) {
    const okr = knowledgeBase.frameworks.okr;
    let response = `**${okr.name}** align your team around measurable goals.\n\n`;
    response += `${okr.description}\n\n`;
    response += `**Structure:** ${okr.structure}\n\n`;
    response += `**Example:**\n`;
    response += `• **Objective:** Become the market leader in ${orgProfile?.industry || 'our sector'}\n`;
    response += `• **KR1:** Increase market share from X% to Y%\n`;
    response += `• **KR2:** Achieve NPS score of 70+\n`;
    response += `• **KR3:** Launch 3 new product features\n\n`;
    response += `**Pro Tips:**\n`;
    okr.tips.forEach(tip => {
      response += `• ${tip}\n`;
    });

    return {
      response,
      suggestions: ['Help me write objectives', 'What makes a good key result?', 'How do we track OKRs?'],
    };
  }

  // Industry-specific guidance
  if (queryLower.includes('industry') || queryLower.includes('sector') || queryLower.includes('market')) {
    if (industryData) {
      let response = `**${orgProfile.industry} Industry Analysis**\n\n`;
      response += `**Key Success Factors:**\n`;
      industryData.keyFactors.forEach(factor => {
        response += `• ${factor}\n`;
      });
      response += `\n**Current Trends:**\n`;
      industryData.trends.forEach(trend => {
        response += `• ${trend}\n`;
      });
      response += `\n**Metrics to Track:**\n`;
      industryData.metrics.forEach(metric => {
        response += `• ${metric}\n`;
      });

      return {
        response,
        suggestions: ['How do we differentiate?', 'What trends should we leverage?', 'Who are our main competitors?'],
      };
    }
    return {
      response: `Industry analysis is crucial for strategic positioning. To provide specific insights, please tell me which industry you're in (Technology, Healthcare, Finance, Retail, Manufacturing, or other).`,
      suggestions: ['We\'re in Technology', 'We\'re in Healthcare', 'We\'re in Retail'],
    };
  }

  // Growth strategy
  if (queryLower.includes('growth') || queryLower.includes('scale') || queryLower.includes('expand')) {
    const strategies = knowledgeBase.growthStrategies;
    let response = `**Growth Strategy Framework (Ansoff Matrix)**\n\n`;

    Object.entries(strategies).forEach(([key, value]) => {
      response += `**${key.replace(/([A-Z])/g, ' $1').trim()}** (${value.risk} Risk)\n`;
      response += `${value.description}\n`;
      response += `Tactics: ${value.tactics.slice(0, 2).join(', ')}\n\n`;
    });

    const stage = orgProfile?.growthStage || 'growth';
    if (stage === 'early' || stage === 'startup') {
      response += `\n**Recommendation for Early Stage:** Focus on market penetration first. Prove product-market fit before expanding.`;
    } else if (stage === 'growth') {
      response += `\n**Recommendation for Growth Stage:** Balance market penetration with product development. Consider selective market development.`;
    } else {
      response += `\n**Recommendation for Mature Stage:** Explore diversification and adjacent markets while defending core business.`;
    }

    return {
      response,
      suggestions: ['Which strategy is right for us?', 'How do we execute market expansion?', 'What resources do we need?'],
    };
  }

  // Risk assessment
  if (queryLower.includes('risk') || queryLower.includes('threat') || queryLower.includes('challenge')) {
    let response = `**Strategic Risk Assessment**\n\n`;
    response += `Risks fall into four categories:\n\n`;
    response += `**1. Strategic Risks**\n`;
    response += `• Market shifts and disruption\n`;
    response += `• Competitive threats\n`;
    response += `• Failed strategic initiatives\n\n`;
    response += `**2. Operational Risks**\n`;
    response += `• Process failures\n`;
    response += `• Supply chain disruption\n`;
    response += `• Technology failures\n\n`;
    response += `**3. Financial Risks**\n`;
    response += `• Cash flow issues\n`;
    response += `• Funding gaps\n`;
    response += `• Currency/market exposure\n\n`;
    response += `**4. Compliance Risks**\n`;
    response += `• Regulatory changes\n`;
    response += `• Legal exposure\n`;
    response += `• Data/privacy issues\n`;

    if (orgProfile?.challenges?.length) {
      response += `\n**Based on your stated challenges**, I'd prioritize addressing: ${orgProfile.challenges.slice(0, 2).join(', ')}.`;
    }

    return {
      response,
      suggestions: ['Help prioritize our risks', 'Create a mitigation plan', 'What should we monitor?'],
    };
  }

  // Priority matrix / decision making
  if (queryLower.includes('priorit') || queryLower.includes('decide') || queryLower.includes('choose')) {
    let response = `**Priority Matrix (Impact vs Effort)**\n\n`;
    response += `This framework helps you make strategic decisions:\n\n`;
    response += `**High Impact, Low Effort = Quick Wins** ⭐\n`;
    response += `Do these first! Maximum value with minimum investment.\n\n`;
    response += `**High Impact, High Effort = Major Projects** 🎯\n`;
    response += `Worth the investment but plan carefully.\n\n`;
    response += `**Low Impact, Low Effort = Fill-Ins** ✓\n`;
    response += `Nice to have, do when resources allow.\n\n`;
    response += `**Low Impact, High Effort = Avoid** ❌\n`;
    response += `Don't waste resources here.\n\n`;
    response += `**Pro tip:** Score each initiative 1-10 on both axes, then plot them visually.`;

    return {
      response,
      suggestions: ['Help me score initiatives', 'What are typical quick wins?', 'How do we estimate effort?'],
    };
  }

  // Step-specific guidance
  if (queryLower.includes('next') || queryLower.includes('what should') || queryLower.includes('recommend') || queryLower.includes('help')) {
    const stepGuidance: Record<WorkflowStep, { focus: string; tasks: string[]; tips: string }> = {
      discover: {
        focus: 'Understanding your organization\'s context, challenges, and aspirations',
        tasks: [
          'Complete your organization profile thoroughly',
          'Document your top 3 strategic priorities',
          'Identify key stakeholders and their concerns',
          'Gather relevant data and market intelligence',
        ],
        tips: 'Be thorough here - good strategy starts with deep understanding.',
      },
      diagnose: {
        focus: 'Analyzing your current position and competitive environment',
        tasks: [
          'Complete a SWOT analysis',
          'Run Porter\'s Five Forces analysis',
          'Consider PESTEL for macro factors',
          'Benchmark against competitors',
        ],
        tips: 'Let data guide your analysis. Challenge assumptions.',
      },
      design: {
        focus: 'Building strategic frameworks and defining objectives',
        tasks: [
          'Create or update your Business Model Canvas',
          'Define 3-5 strategic OKRs',
          'Map initiative dependencies',
          'Develop strategic options',
        ],
        tips: 'Good design balances ambition with feasibility.',
      },
      decide: {
        focus: 'Making informed strategic choices and committing resources',
        tasks: [
          'Score initiatives on impact and effort',
          'Build a phased implementation roadmap',
          'Run scenario analysis on top options',
          'Secure stakeholder alignment',
        ],
        tips: 'Great strategies require tough choices. Focus beats diversification.',
      },
      deliver: {
        focus: 'Executing strategy and tracking progress',
        tasks: [
          'Break strategy into quarterly milestones',
          'Assign clear ownership for each initiative',
          'Set up tracking dashboards',
          'Establish regular review cadence',
        ],
        tips: 'Execution eats strategy for breakfast. Focus on accountability.',
      },
    };

    const guidance = stepGuidance[step];
    let response = `**${getStepLabel(step)} Phase Guidance**\n\n`;
    response += `**Focus:** ${guidance.focus}\n\n`;
    response += `**Key Tasks:**\n`;
    guidance.tasks.forEach((task, i) => {
      response += `${i + 1}. ${task}\n`;
    });
    response += `\n**Tip from ${advisor.name}:** ${guidance.tips}`;

    return {
      response,
      suggestions: [`Start ${getStepLabel(step)} tasks`, 'Which framework should I use?', 'Show me examples'],
    };
  }

  // Generic but helpful response
  const contextualResponses: Record<WorkflowStep, string> = {
    discover: `In the **Discovery** phase, we're building the foundation for your strategy. ${projectName ? `For "${projectName}", ` : ''}I recommend focusing on:\n\n1. **Your organization's identity** - What makes you unique?\n2. **Current challenges** - What's holding you back?\n3. **Strategic aspirations** - Where do you want to be in 3-5 years?\n\nWhat aspect would you like to explore?`,
    diagnose: `The **Diagnosis** phase is about understanding your position through rigorous analysis. ${diagnostics?.length ? `You've completed ${diagnostics.length} analysis tool(s) - good progress! ` : ''}Key frameworks include:\n\n• SWOT for internal/external factors\n• Porter's Five Forces for competitive dynamics\n• PESTEL for macro environment\n\nWhich analysis would be most valuable for you right now?`,
    design: `In **Design**, we translate insights into strategic frameworks. Focus areas:\n\n• **Business Model Canvas** - How you create and capture value\n• **OKRs** - Your objectives and how you'll measure success\n• **Strategic Options** - Alternative paths forward\n\nWhat would you like to design first?`,
    decide: `**Decision** time requires prioritization and commitment. Key activities:\n\n• **Priority Matrix** - Score initiatives on impact and effort\n• **Scenario Analysis** - Test strategies against different futures\n• **Resource Allocation** - Where to invest\n\nThe best strategies are focused - what decisions are you weighing?`,
    deliver: `**Delivery** is where strategy meets reality. Success factors:\n\n• Clear milestones and ownership\n• Regular progress reviews\n• Adaptive execution\n• Stakeholder communication\n\nWhat's your biggest execution challenge?`,
  };

  return {
    response: contextualResponses[step],
    suggestions: ['Tell me more about frameworks', 'What should I prioritize?', `Guide me through ${getStepLabel(step)}`],
  };
}

// Dynamic avatar component with animation
function DynamicAvatar({ advisor, isTyping }: { advisor: AdvisorProfile; isTyping: boolean }) {
  return (
    <div className="dynamic-avatar-container">
      <div
        className={`dynamic-avatar ${isTyping ? 'speaking' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${advisor.primaryColor}, ${advisor.secondaryColor})`,
        }}
      >
        <span className="avatar-emoji">{advisor.avatar}</span>
        <div className="avatar-glow" style={{ background: advisor.primaryColor }} />
        <div className="avatar-ring" style={{ borderColor: advisor.primaryColor }} />
        {isTyping && (
          <div className="speaking-waves">
            <span style={{ background: advisor.primaryColor }} />
            <span style={{ background: advisor.secondaryColor }} />
            <span style={{ background: advisor.primaryColor }} />
          </div>
        )}
      </div>
      <span className="online-indicator" />

      <style jsx>{`
        .dynamic-avatar-container {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .dynamic-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .dynamic-avatar.speaking {
          animation: pulse-avatar 1.5s ease-in-out infinite;
        }

        @keyframes pulse-avatar {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .avatar-emoji {
          font-size: 28px;
          z-index: 2;
          position: relative;
        }

        .avatar-glow {
          position: absolute;
          inset: -20%;
          opacity: 0.3;
          filter: blur(20px);
          border-radius: 50%;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .avatar-ring {
          position: absolute;
          inset: -4px;
          border: 2px solid;
          border-radius: 50%;
          opacity: 0;
          animation: ring-pulse 2s ease-in-out infinite;
        }

        .dynamic-avatar.speaking .avatar-ring {
          animation: ring-pulse-active 1s ease-in-out infinite;
        }

        @keyframes ring-pulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }

        @keyframes ring-pulse-active {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }

        .speaking-waves {
          position: absolute;
          bottom: 4px;
          display: flex;
          gap: 2px;
          z-index: 3;
        }

        .speaking-waves span {
          width: 3px;
          height: 8px;
          border-radius: 2px;
          animation: wave 0.8s ease-in-out infinite;
        }

        .speaking-waves span:nth-child(1) { animation-delay: 0s; }
        .speaking-waves span:nth-child(2) { animation-delay: 0.2s; }
        .speaking-waves span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #22C55E;
          border: 3px solid var(--bg-tertiary, #1a1a2e);
          border-radius: 50%;
          z-index: 3;
        }
      `}</style>
    </div>
  );
}

export default function IntelligentAdvisor() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAdvisor, setActiveAdvisor] = useState(advisorProfiles[0]);
  const [showAdvisorSelector, setShowAdvisorSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getActiveProject } = useProjectState();
  const { incrementAiQueries } = useAppState();
  const project = getActiveProject();

  useEffect(() => {
    if (messages.length === 0) {
      const greeting = project
        ? `Hello! I'm ${activeAdvisor.name}, your ${activeAdvisor.role}. I specialize in ${activeAdvisor.specialty}.\n\nI see you're working on "${project.name}" in the **${getStepLabel(project.currentStep)}** phase. I'm ${activeAdvisor.personality}, so expect thorough analysis and actionable advice.\n\nHow can I help you today?`
        : `Hello! I'm ${activeAdvisor.name}, your ${activeAdvisor.role} specializing in ${activeAdvisor.specialty}.\n\nI'm here to guide you through strategic planning with ${activeAdvisor.personality} insights.\n\nWhat strategic challenge can I help you with?`;

      setMessages([
        {
          id: 'greeting',
          role: 'advisor',
          content: greeting,
          timestamp: new Date(),
          suggestions: project
            ? [`Help me with ${getStepLabel(project.currentStep)}`, 'What frameworks should I use?', 'Give me strategic advice']
            : ['Start a strategy project', 'Tell me about frameworks', 'What can you help with?'],
        },
      ]);
    }
  }, [project?.id, activeAdvisor.id]);

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

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    const { response, suggestions } = generateResponse(
      messageText,
      {
        step: project?.currentStep || 'discover',
        projectName: project?.name,
        orgProfile: project?.discover,
        diagnostics: project?.diagnose,
        frameworks: project?.design,
        decisions: project?.decide,
      },
      activeAdvisor
    );

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

  const switchAdvisor = (advisor: AdvisorProfile) => {
    setActiveAdvisor(advisor);
    setShowAdvisorSelector(false);
    setMessages([]);
  };

  return (
    <div className="intelligent-advisor">
      {/* Advisor Header */}
      <div className="advisor-header">
        <div className="advisor-profile" onClick={() => setShowAdvisorSelector(!showAdvisorSelector)}>
          <DynamicAvatar advisor={activeAdvisor} isTyping={isTyping} />
          <div className="profile-info">
            <span className="name">{activeAdvisor.name}</span>
            <span className="role">{activeAdvisor.role}</span>
            <span className="specialty">{activeAdvisor.specialty}</span>
          </div>
          <button className="switch-btn" title="Switch advisor">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 1l4 4-4 4M7 23l-4-4 4-4M3 19h18M21 5H3" />
            </svg>
          </button>
        </div>

        {/* Advisor Selector Dropdown */}
        {showAdvisorSelector && (
          <div className="advisor-selector">
            {advisorProfiles.map((advisor) => (
              <button
                key={advisor.id}
                className={`advisor-option ${advisor.id === activeAdvisor.id ? 'active' : ''}`}
                onClick={() => switchAdvisor(advisor)}
              >
                <div
                  className="option-avatar"
                  style={{ background: `linear-gradient(135deg, ${advisor.primaryColor}, ${advisor.secondaryColor})` }}
                >
                  {advisor.avatar}
                </div>
                <div className="option-info">
                  <span className="option-name">{advisor.name}</span>
                  <span className="option-role">{advisor.specialty}</span>
                </div>
              </button>
            ))}
          </div>
        )}
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
              className="message-avatar typing"
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
          placeholder={`Ask ${activeAdvisor.name} about strategy...`}
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
          position: relative;
        }

        .advisor-profile {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }

        .profile-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .name {
          font-weight: 600;
          font-size: 15px;
          color: var(--text-primary);
        }

        .role {
          font-size: 12px;
          color: var(--text-muted);
        }

        .specialty {
          font-size: 11px;
          color: ${activeAdvisor.primaryColor};
          font-weight: 500;
        }

        .switch-btn {
          padding: 10px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .switch-btn:hover {
          border-color: ${activeAdvisor.primaryColor};
          color: ${activeAdvisor.primaryColor};
        }

        .advisor-selector {
          position: absolute;
          top: 100%;
          left: 16px;
          right: 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          z-index: 100;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .advisor-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
          text-align: left;
        }

        .advisor-option:hover {
          background: var(--bg-tertiary);
        }

        .advisor-option.active {
          background: rgba(168, 85, 247, 0.1);
        }

        .option-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 14px;
        }

        .option-role {
          font-size: 12px;
          color: var(--text-muted);
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
          transition: transform 0.2s ease;
        }

        .message-avatar.typing {
          animation: pulse-small 1s ease-in-out infinite;
        }

        @keyframes pulse-small {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .message-content {
          max-width: 85%;
        }

        .message-text {
          padding: 14px 18px;
          border-radius: 18px;
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
          gap: 5px;
          padding: 16px 20px;
          background: var(--bg-tertiary);
          border-radius: 18px;
          border-bottom-left-radius: 4px;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: ${activeAdvisor.primaryColor};
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
          padding: 14px 18px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .input-container input:focus {
          border-color: ${activeAdvisor.primaryColor};
        }

        .input-container input::placeholder {
          color: var(--text-muted);
        }

        .send-btn {
          padding: 14px 18px;
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
