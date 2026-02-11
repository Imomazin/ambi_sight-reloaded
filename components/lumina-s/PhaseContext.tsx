'use client';

import { useState } from 'react';
import { useStrategyEngine } from '../../state/useStrategyEngine';

const INDUSTRIES = [
  { code: 'TECH', label: 'Technology' },
  { code: 'FIN', label: 'Financial Services' },
  { code: 'HEALTH', label: 'Healthcare' },
  { code: 'MFG', label: 'Manufacturing' },
  { code: 'RETAIL', label: 'Retail & Consumer' },
  { code: 'ENERGY', label: 'Energy & Utilities' },
  { code: 'MEDIA', label: 'Media & Entertainment' },
  { code: 'PROP', label: 'Real Estate' },
  { code: 'EDU', label: 'Education' },
  { code: 'GOV', label: 'Government & Public Sector' },
  { code: 'TRAN', label: 'Transport & Logistics' },
  { code: 'AGRI', label: 'Agriculture' },
  { code: 'OTHER', label: 'Other' },
];

const REGIONS = [
  'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa',
  'Latin America', 'Global',
];

export default function PhaseContext() {
  const { enterprise, updateEnterprise, completeEnterprise } = useStrategyEngine();
  const [geoInput, setGeoInput] = useState('');

  if (!enterprise) return null;

  const isComplete = enterprise.organisation_name && enterprise.industry_code && enterprise.geographic_footprint.length > 0;

  const addRegion = (region: string) => {
    if (!enterprise.geographic_footprint.includes(region)) {
      updateEnterprise({ geographic_footprint: [...enterprise.geographic_footprint, region] });
    }
  };

  const removeRegion = (region: string) => {
    updateEnterprise({
      geographic_footprint: enterprise.geographic_footprint.filter(r => r !== region),
    });
  };

  return (
    <div className="phase-form">
      <p className="phase-description">
        Mandatory enterprise context capture. No strategic option generation until this phase is completed.
      </p>

      <div className="form-section">
        <label className="form-label">Organisation Name *</label>
        <input
          type="text"
          className="form-input"
          value={enterprise.organisation_name}
          onChange={e => updateEnterprise({ organisation_name: e.target.value })}
          placeholder="e.g., Acme Corporation"
        />
      </div>

      <div className="form-row">
        <div className="form-section">
          <label className="form-label">Organisation Type *</label>
          <div className="chip-group">
            {(['startup', 'sme', 'corporate', 'public_sector'] as const).map(type => (
              <button
                key={type}
                className={`chip ${enterprise.organisation_type === type ? 'active' : ''}`}
                onClick={() => updateEnterprise({ organisation_type: type })}
              >
                {type === 'sme' ? 'SME' : type === 'public_sector' ? 'Public Sector' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Industry Classification *</label>
        <div className="industry-grid">
          {INDUSTRIES.map(ind => (
            <button
              key={ind.code}
              className={`industry-chip ${enterprise.industry_code === ind.code ? 'active' : ''}`}
              onClick={() => updateEnterprise({ industry_code: ind.code, industry_label: ind.label })}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">Geographic Footprint *</label>
        <div className="chip-group">
          {REGIONS.map(region => (
            <button
              key={region}
              className={`chip ${enterprise.geographic_footprint.includes(region) ? 'active' : ''}`}
              onClick={() => enterprise.geographic_footprint.includes(region) ? removeRegion(region) : addRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-section">
          <label className="form-label">Market Maturity *</label>
          <div className="chip-group">
            {(['emerging', 'growth', 'mature', 'declining'] as const).map(type => (
              <button
                key={type}
                className={`chip ${enterprise.market_type === type ? 'active' : ''}`}
                onClick={() => updateEnterprise({ market_type: type })}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Time Horizon *</label>
          <div className="chip-group">
            {([
              { key: 'short' as const, label: 'Short (1-2 yrs)' },
              { key: 'medium' as const, label: 'Medium (3-5 yrs)' },
              { key: 'long' as const, label: 'Long (5+ yrs)' },
            ]).map(h => (
              <button
                key={h.key}
                className={`chip ${enterprise.horizon === h.key ? 'active' : ''}`}
                onClick={() => updateEnterprise({ horizon: h.key, horizon_years: h.label })}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Object Preview */}
      {enterprise.organisation_name && (
        <div className="object-preview">
          <h4>Enterprise Object Preview</h4>
          <div className="preview-grid">
            <div className="preview-item"><span className="key">Organisation</span><span className="val">{enterprise.organisation_name}</span></div>
            <div className="preview-item"><span className="key">Type</span><span className="val">{enterprise.organisation_type}</span></div>
            <div className="preview-item"><span className="key">Industry</span><span className="val">{enterprise.industry_label || '—'}</span></div>
            <div className="preview-item"><span className="key">Market</span><span className="val">{enterprise.market_type}</span></div>
            <div className="preview-item"><span className="key">Horizon</span><span className="val">{enterprise.horizon_years}</span></div>
            <div className="preview-item"><span className="key">Geography</span><span className="val">{enterprise.geographic_footprint.join(', ') || '—'}</span></div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button
          className="btn-complete"
          onClick={completeEnterprise}
          disabled={!isComplete}
        >
          Complete Phase 1 & Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .phase-form { max-width: 900px; }
        .phase-description {
          font-size: 14px; color: var(--text-muted); margin-bottom: 28px;
          padding: 12px 16px;
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 10px;
          border-left: 3px solid #F59E0B;
        }
        .form-section { margin-bottom: 24px; }
        .form-label {
          display: block; font-size: 13px; font-weight: 600;
          color: var(--text-secondary); margin-bottom: 8px;
        }
        .form-input {
          width: 100%; padding: 12px 16px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 10px; font-size: 15px; color: var(--text-primary);
          outline: none; transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #A855F7; }
        .form-input::placeholder { color: var(--text-muted); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .chip-group { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip {
          padding: 8px 16px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 8px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover { border-color: rgba(168, 85, 247, 0.3); }
        .chip.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: #A855F7;
          color: #C084FC;
        }
        .industry-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 8px;
        }
        .industry-chip {
          padding: 10px 14px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 10px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); cursor: pointer;
          transition: all 0.2s; text-align: left;
        }
        .industry-chip:hover { border-color: rgba(20, 184, 166, 0.3); }
        .industry-chip.active {
          background: rgba(20, 184, 166, 0.12);
          border-color: #14B8A6; color: #2DD4BF;
        }
        .object-preview {
          margin-top: 8px; padding: 20px;
          background: var(--bg-tertiary); border: 1px solid var(--border);
          border-radius: 12px;
        }
        .object-preview h4 {
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .preview-item {
          display: flex; justify-content: space-between; padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .key { font-size: 12px; color: var(--text-muted); }
        .val { font-size: 12px; color: var(--text-primary); font-weight: 500; }
        .form-actions { margin-top: 32px; display: flex; justify-content: flex-end; }
        .btn-complete {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #14B8A6, #2DD4BF);
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 600; color: white;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-complete:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3);
        }
        .btn-complete:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .preview-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
