'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'swot' | 'porter' | 'pestel' | 'bcg' | 'scenario' | 'custom';
  icon: string;
  industry?: string;
  popular?: boolean;
}

const templates: Template[] = [
  // SWOT Templates
  {
    id: 'swot-tech-startup',
    name: 'Tech Startup SWOT',
    description: 'Comprehensive SWOT analysis template for technology startups and scale-ups',
    category: 'swot',
    icon: '💻',
    industry: 'Technology',
    popular: true
  },
  {
    id: 'swot-retail',
    name: 'Retail Business SWOT',
    description: 'SWOT framework tailored for retail and e-commerce businesses',
    category: 'swot',
    icon: '🛒',
    industry: 'Retail'
  },
  {
    id: 'swot-healthcare',
    name: 'Healthcare SWOT',
    description: 'Healthcare industry-specific SWOT analysis with regulatory considerations',
    category: 'swot',
    icon: '🏥',
    industry: 'Healthcare'
  },

  // Porter's Five Forces Templates
  {
    id: 'porter-saas',
    name: 'SaaS Industry Analysis',
    description: "Porter's Five Forces for Software-as-a-Service businesses",
    category: 'porter',
    icon: '☁️',
    industry: 'SaaS',
    popular: true
  },
  {
    id: 'porter-manufacturing',
    name: 'Manufacturing Analysis',
    description: 'Competitive analysis for manufacturing and industrial sectors',
    category: 'porter',
    icon: '🏭',
    industry: 'Manufacturing'
  },

  // PESTEL Templates
  {
    id: 'pestel-fintech',
    name: 'Fintech PESTEL',
    description: 'Macro-environmental analysis for fintech and financial services',
    category: 'pestel',
    icon: '💳',
    industry: 'Finance',
    popular: true
  },
  {
    id: 'pestel-energy',
    name: 'Energy Sector PESTEL',
    description: 'Environmental and political factors analysis for energy companies',
    category: 'pestel',
    icon: '⚡',
    industry: 'Energy'
  },

  // BCG Matrix Templates
  {
    id: 'bcg-portfolio',
    name: 'Product Portfolio BCG',
    description: 'BCG Matrix for analyzing product portfolio and resource allocation',
    category: 'bcg',
    icon: '📊',
    popular: true
  },

  // Scenario Planning
  {
    id: 'scenario-disruption',
    name: 'Market Disruption',
    description: 'Scenario planning for potential market disruptions',
    category: 'scenario',
    icon: '🌪️'
  },
  {
    id: 'scenario-expansion',
    name: 'Geographic Expansion',
    description: 'Scenario analysis for entering new markets',
    category: 'scenario',
    icon: '🌍'
  }
];

const categories = [
  { id: 'all', label: 'All Templates', icon: '📋' },
  { id: 'swot', label: 'SWOT', icon: '📊' },
  { id: 'porter', label: "Porter's", icon: '⚔️' },
  { id: 'pestel', label: 'PESTEL', icon: '🌍' },
  { id: 'bcg', label: 'BCG Matrix', icon: '📈' },
  { id: 'scenario', label: 'Scenarios', icon: '🎯' }
];

export default function TemplateGallery() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.industry?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const popularTemplates = templates.filter(t => t.popular);

  const handleSelectTemplate = (template: Template) => {
    // Navigate to tools page with template pre-selected
    router.push(`/tools?template=${template.id}`);
  };

  return (
    <div className="template-gallery">
      <div className="gallery-header">
        <h2>Strategy Templates</h2>
        <p>Start with a proven framework tailored to your industry</p>
      </div>

      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="tab-icon">{category.icon}</span>
            <span className="tab-label">{category.label}</span>
          </button>
        ))}
      </div>

      {selectedCategory === 'all' && !searchQuery && (
        <div className="popular-section">
          <h3>Popular Templates</h3>
          <div className="popular-grid">
            {popularTemplates.map(template => (
              <div
                key={template.id}
                className="template-card popular"
                onClick={() => handleSelectTemplate(template)}
              >
                <span className="template-icon">{template.icon}</span>
                <div className="template-info">
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                </div>
                <span className="popular-badge">Popular</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="templates-grid">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="template-card"
            onClick={() => handleSelectTemplate(template)}
          >
            <span className="template-icon">{template.icon}</span>
            <div className="template-info">
              <h4>{template.name}</h4>
              <p>{template.description}</p>
              {template.industry && (
                <span className="industry-tag">{template.industry}</span>
              )}
            </div>
            <button className="use-btn">Use Template</button>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>No templates found matching your criteria</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .template-gallery {
          padding: 24px;
        }

        .gallery-header {
          margin-bottom: 24px;
        }

        .gallery-header h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .gallery-header p {
          margin: 0;
          color: var(--text-muted);
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .search-bar svg {
          color: var(--text-muted);
        }

        .search-bar input {
          flex: 1;
          background: none;
          border: none;
          font-size: 15px;
          color: var(--text-primary);
          outline: none;
        }

        .search-bar input::placeholder {
          color: var(--text-muted);
        }

        .category-tabs {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .category-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-tab:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .category-tab.active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        .tab-icon {
          font-size: 14px;
        }

        .popular-section {
          margin-bottom: 32px;
        }

        .popular-section h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .template-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .template-card:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .template-card.popular {
          background: linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary));
          border-color: rgba(168, 85, 247, 0.3);
        }

        .template-icon {
          font-size: 32px;
        }

        .template-info h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .template-info p {
          margin: 0;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .industry-tag {
          display: inline-block;
          margin-top: 8px;
          padding: 4px 10px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          font-size: 11px;
          color: var(--text-secondary);
        }

        .popular-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #A855F7, #EC4899);
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          color: white;
        }

        .use-btn {
          margin-top: auto;
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .use-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 48px 20px;
        }

        .no-results-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }

        .no-results p {
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .category-tabs {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
          }

          .category-tab {
            flex-shrink: 0;
          }

          .tab-label {
            display: none;
          }

          .popular-grid,
          .templates-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
