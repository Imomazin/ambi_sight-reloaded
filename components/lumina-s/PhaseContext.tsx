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
    <div className="pf">
      <p className="pf-note">
        Mandatory enterprise context capture. No strategic option generation until this phase is completed.
      </p>

      <div className="pf-group">
        <label className="pf-label">Organisation Name *</label>
        <input
          type="text" className="pf-input"
          value={enterprise.organisation_name}
          onChange={e => updateEnterprise({ organisation_name: e.target.value })}
          placeholder="e.g., Acme Corporation"
        />
      </div>

      <div className="pf-row">
        <div className="pf-group">
          <label className="pf-label">Organisation Type *</label>
          <div className="pf-chips">
            {(['startup', 'sme', 'corporate', 'public_sector'] as const).map(type => (
              <button key={type}
                className={`pf-chip ${enterprise.organisation_type === type ? 'on' : ''}`}
                onClick={() => updateEnterprise({ organisation_type: type })}>
                {type === 'sme' ? 'SME' : type === 'public_sector' ? 'Public Sector' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pf-group">
        <label className="pf-label">Industry Classification *</label>
        <div className="pf-ind-grid">
          {INDUSTRIES.map(ind => (
            <button key={ind.code}
              className={`pf-ind ${enterprise.industry_code === ind.code ? 'on' : ''}`}
              onClick={() => updateEnterprise({ industry_code: ind.code, industry_label: ind.label })}>
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pf-group">
        <label className="pf-label">Geographic Footprint *</label>
        <div className="pf-chips">
          {REGIONS.map(region => (
            <button key={region}
              className={`pf-chip ${enterprise.geographic_footprint.includes(region) ? 'on' : ''}`}
              onClick={() => enterprise.geographic_footprint.includes(region) ? removeRegion(region) : addRegion(region)}>
              {region}
            </button>
          ))}
        </div>
      </div>

      <div className="pf-row">
        <div className="pf-group">
          <label className="pf-label">Market Maturity *</label>
          <div className="pf-chips">
            {(['emerging', 'growth', 'mature', 'declining'] as const).map(type => (
              <button key={type}
                className={`pf-chip ${enterprise.market_type === type ? 'on' : ''}`}
                onClick={() => updateEnterprise({ market_type: type })}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="pf-group">
          <label className="pf-label">Time Horizon *</label>
          <div className="pf-chips">
            {([
              { key: 'short' as const, label: 'Short (1-2 yrs)' },
              { key: 'medium' as const, label: 'Medium (3-5 yrs)' },
              { key: 'long' as const, label: 'Long (5+ yrs)' },
            ]).map(h => (
              <button key={h.key}
                className={`pf-chip ${enterprise.horizon === h.key ? 'on' : ''}`}
                onClick={() => updateEnterprise({ horizon: h.key, horizon_years: h.label })}>
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {enterprise.organisation_name && (
        <div className="pf-preview">
          <h4>Enterprise Object Preview</h4>
          <div className="pv-grid">
            <div className="pv-item"><span className="pv-k">Organisation</span><span className="pv-v">{enterprise.organisation_name}</span></div>
            <div className="pv-item"><span className="pv-k">Type</span><span className="pv-v">{enterprise.organisation_type}</span></div>
            <div className="pv-item"><span className="pv-k">Industry</span><span className="pv-v">{enterprise.industry_label || '—'}</span></div>
            <div className="pv-item"><span className="pv-k">Market</span><span className="pv-v">{enterprise.market_type}</span></div>
            <div className="pv-item"><span className="pv-k">Horizon</span><span className="pv-v">{enterprise.horizon_years}</span></div>
            <div className="pv-item"><span className="pv-k">Geography</span><span className="pv-v">{enterprise.geographic_footprint.join(', ') || '—'}</span></div>
          </div>
        </div>
      )}

      <div className="pf-actions">
        <button className="pf-submit" onClick={completeEnterprise} disabled={!isComplete}>
          Complete Phase 1 & Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      <style jsx>{`
        .pf { max-width: 900px; }
        .pf-note {
          font-size: 13px; color: rgba(245, 158, 11, 0.8); margin-bottom: 28px;
          padding: 12px 16px;
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.12);
          border-radius: 12px; border-left: 3px solid rgba(245, 158, 11, 0.5);
          line-height: 1.5;
        }
        .pf-group { margin-bottom: 24px; }
        .pf-label {
          display: block; font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.5); margin-bottom: 10px;
        }
        .pf-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; font-size: 15px; color: #fff;
          outline: none; transition: border-color 0.2s;
          font-family: inherit;
        }
        .pf-input:focus { border-color: rgba(168, 85, 247, 0.4); }
        .pf-input::placeholder { color: rgba(255,255,255,0.2); }
        .pf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .pf-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .pf-chip {
          padding: 8px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.2s; font-family: inherit;
        }
        .pf-chip:hover { border-color: rgba(168, 85, 247, 0.25); color: rgba(255,255,255,0.7); }
        .pf-chip.on {
          background: rgba(168, 85, 247, 0.12);
          border-color: rgba(168, 85, 247, 0.3);
          color: #C084FC;
        }
        .pf-ind-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;
        }
        .pf-ind {
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.5); cursor: pointer;
          transition: all 0.2s; text-align: left; font-family: inherit;
        }
        .pf-ind:hover { border-color: rgba(124, 58, 237, 0.25); }
        .pf-ind.on {
          background: rgba(124, 58, 237, 0.1);
          border-color: rgba(124, 58, 237, 0.3);
          color: #C084FC;
        }
        .pf-preview {
          margin-top: 8px; padding: 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
        }
        .pf-preview h4 {
          font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.25);
          margin: 0 0 14px; text-transform: uppercase; letter-spacing: 1px;
        }
        .pv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .pv-item {
          display: flex; justify-content: space-between; padding: 7px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .pv-k { font-size: 12px; color: rgba(255,255,255,0.3); }
        .pv-v { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 500; }
        .pf-actions { margin-top: 32px; display: flex; justify-content: flex-end; }
        .pf-submit {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 28px;
          background: linear-gradient(135deg, #A855F7, #7C3AED);
          border: none; border-radius: 12px; font-size: 15px; font-weight: 600;
          color: white; cursor: pointer; transition: all 0.25s; font-family: inherit;
        }
        .pf-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3);
        }
        .pf-submit:disabled { opacity: 0.35; cursor: not-allowed; }
        @media (max-width: 768px) {
          .pf-row { grid-template-columns: 1fr; }
          .pv-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
