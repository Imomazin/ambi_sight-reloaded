'use client';

import { useState } from 'react';
import { useStrategyEngine } from '../../state/useStrategyEngine';

interface DetectedData {
  type: string;
  fields: string[];
  rows: number;
  status: 'mapped' | 'missing';
  clarification?: string;
}

export default function UploadFlow() {
  const { resetSession, updateEnterprise, completeEnterprise, setPhase } = useStrategyEngine();
  const [files, setFiles] = useState<File[]>([]);
  const [parsing, setParsing] = useState(false);
  const [detected, setDetected] = useState<DetectedData[]>([]);
  const [clarifications, setClarifications] = useState<string[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const simulateParse = () => {
    setParsing(true);
    setTimeout(() => {
      const results: DetectedData[] = [
        { type: 'Revenue Tables', fields: ['Year', 'Revenue', 'Growth %'], rows: 24, status: 'mapped' },
        { type: 'Cost Structure', fields: ['Category', 'Amount', 'Type'], rows: 18, status: 'mapped' },
        { type: 'Competitor Data', fields: ['Name', 'Market Share'], rows: 6, status: 'mapped' },
        { type: 'Capital Constraints', fields: [], rows: 0, status: 'missing', clarification: 'No capital constraint detected. Please specify maximum investable capital.' },
        { type: 'Market Share Data', fields: ['Segment', 'Share %'], rows: 8, status: 'mapped' },
      ];
      setDetected(results);
      setClarifications(
        results.filter(r => r.status === 'missing').map(r => r.clarification || '')
      );
      setParsing(false);
    }, 2000);
  };

  const handleProceed = () => {
    updateEnterprise({
      organisation_name: 'Imported Organisation',
      organisation_type: 'corporate',
      industry_code: 'TECH',
      industry_label: 'Technology',
      geographic_footprint: ['Global'],
      market_type: 'growth',
      horizon: 'medium',
      horizon_years: 'Medium (3-5 yrs)',
    });
    completeEnterprise();
    setPhase('objectives');
  };

  return (
    <div className="upload-flow">
      <div className="uf-header">
        <button className="uf-back" onClick={resetSession}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2>Upload Strategic Data</h2>
        <p>Parse market data, revenue forecasts, competitor data. Auto-map to Strategic Object Model.</p>
      </div>

      {/* Drop Zone */}
      <div className="drop-zone" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p>Drag & drop files here</p>
        <span>or</span>
        <label className="file-btn">
          Browse Files
          <input type="file" multiple accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileSelect} hidden />
        </label>
        <span className="formats">Supports: Excel, CSV, PDF</span>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="file-list">
          <h4>Uploaded Files ({files.length})</h4>
          {files.map((f, i) => (
            <div key={i} className="file-item">
              <span className="file-icon">
                {f.name.endsWith('.csv') ? 'CSV' : f.name.endsWith('.pdf') ? 'PDF' : 'XLS'}
              </span>
              <div className="file-info">
                <span className="file-name">{f.name}</span>
                <span className="file-size">{(f.size / 1024).toFixed(1)} KB</span>
              </div>
              <button className="file-remove" onClick={() => setFiles(files.filter((_, j) => j !== i))}>x</button>
            </div>
          ))}
          {detected.length === 0 && (
            <button className="btn-parse" onClick={simulateParse} disabled={parsing}>
              {parsing ? (
                <>
                  <div className="spinner" />
                  Parsing & Mapping...
                </>
              ) : (
                'Parse & Map to Strategic Model'
              )}
            </button>
          )}
        </div>
      )}

      {/* Detection Results */}
      {detected.length > 0 && (
        <div className="detected-section">
          <h4>Detected Data Objects</h4>
          <div className="det-grid">
            {detected.map((d, i) => (
              <div key={i} className={`det-card ${d.status}`}>
                <div className="det-header">
                  <span className={`det-status ${d.status}`}>
                    {d.status === 'mapped' ? 'Mapped' : 'Missing'}
                  </span>
                  <span className="det-type">{d.type}</span>
                </div>
                {d.status === 'mapped' ? (
                  <>
                    <div className="det-fields">
                      {d.fields.map((f, j) => <span key={j} className="det-field">{f}</span>)}
                    </div>
                    <span className="det-rows">{d.rows} rows detected</span>
                  </>
                ) : (
                  <div className="det-clarify">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
                    </svg>
                    <span>{d.clarification}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {clarifications.length > 0 && (
            <div className="clarify-section">
              <h4>AI Clarification Required</h4>
              {clarifications.map((c, i) => (
                <div key={i} className="clarify-item">
                  <span className="clarify-q">{c}</span>
                  <input type="text" className="clarify-input" placeholder="Enter value..." />
                </div>
              ))}
            </div>
          )}

          <button className="btn-proceed" onClick={handleProceed}>
            Proceed to Strategy Journey
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .upload-flow { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
        .uf-header { margin-bottom: 28px; }
        .uf-back {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0; background: none; border: none; color: var(--text-muted);
          font-size: 13px; cursor: pointer; margin-bottom: 16px;
        }
        .uf-back:hover { color: var(--text-primary); }
        .uf-header h2 { font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px; }
        .uf-header p { font-size: 14px; color: var(--text-muted); margin: 0; }
        .drop-zone {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 48px 24px; border: 2px dashed var(--border);
          border-radius: 16px; text-align: center;
          color: var(--text-muted); margin-bottom: 24px;
          transition: all 0.2s;
        }
        .drop-zone:hover { border-color: #A855F7; }
        .drop-zone p { font-size: 16px; font-weight: 500; color: var(--text-secondary); margin: 0; }
        .drop-zone span { font-size: 13px; }
        .file-btn {
          padding: 10px 24px; background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px;
          font-size: 14px; font-weight: 600; color: #C084FC; cursor: pointer;
        }
        .formats { font-size: 12px; color: var(--text-muted); }
        .file-list {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px; margin-bottom: 24px;
        }
        h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 14px; }
        .file-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; background: var(--bg-tertiary);
          border-radius: 10px; margin-bottom: 8px;
        }
        .file-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(20, 184, 166, 0.1); display: flex;
          align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #14B8A6;
        }
        .file-info { flex: 1; }
        .file-name { display: block; font-size: 13px; font-weight: 500; color: var(--text-primary); }
        .file-size { font-size: 11px; color: var(--text-muted); }
        .file-remove {
          width: 24px; height: 24px; background: rgba(239, 68, 68, 0.1);
          border: none; border-radius: 6px; color: #EF4444; cursor: pointer;
          font-size: 12px;
        }
        .btn-parse {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px; margin-top: 12px;
          background: linear-gradient(135deg, #A855F7, #7C3AED);
          border: none; border-radius: 12px; font-size: 15px;
          font-weight: 600; color: white; cursor: pointer;
        }
        .btn-parse:disabled { opacity: 0.7; }
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .detected-section {
          background: var(--bg-secondary); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px;
        }
        .det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .det-card {
          padding: 14px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 10px;
        }
        .det-card.missing { border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.04); }
        .det-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .det-status {
          padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
        }
        .det-status.mapped { background: rgba(34, 197, 94, 0.15); color: #22C55E; }
        .det-status.missing { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
        .det-type { font-size: 13px; font-weight: 600; color: var(--text-primary); }
        .det-fields { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px; }
        .det-field {
          padding: 2px 8px; background: rgba(20, 184, 166, 0.1);
          border-radius: 4px; font-size: 10px; color: #14B8A6;
        }
        .det-rows { font-size: 11px; color: var(--text-muted); }
        .det-clarify {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 12px; color: #F59E0B;
        }
        .clarify-section { margin-bottom: 20px; }
        .clarify-item { margin-bottom: 12px; }
        .clarify-q { display: block; font-size: 13px; color: var(--text-secondary); margin-bottom: 6px; }
        .clarify-input {
          width: 100%; padding: 10px 14px; background: var(--bg-tertiary);
          border: 1px solid var(--border); border-radius: 8px;
          font-size: 14px; color: var(--text-primary); outline: none;
        }
        .clarify-input:focus { border-color: #A855F7; }
        .btn-proceed {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #14B8A6, #0D9488);
          border: none; border-radius: 12px; font-size: 15px;
          font-weight: 600; color: white; cursor: pointer;
        }
        .btn-proceed:hover { box-shadow: 0 8px 24px rgba(20, 184, 166, 0.3); }
        @media (max-width: 640px) { .det-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
