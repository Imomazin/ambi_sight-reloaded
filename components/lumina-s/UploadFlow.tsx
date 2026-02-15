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
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
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

  const fileIcon = (name: string) => {
    if (name.endsWith('.csv')) return 'CSV';
    if (name.endsWith('.pdf')) return 'PDF';
    return 'XLS';
  };

  const fileColor = (name: string) => {
    if (name.endsWith('.csv')) return '#22C55E';
    if (name.endsWith('.pdf')) return '#EF4444';
    return '#3B82F6';
  };

  return (
    <div className="uf-root">
      <div className="uf-header">
        <button className="uf-back" onClick={resetSession}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Landing
        </button>
        <h2>Upload Strategic Data</h2>
        <p>Parse market data, revenue forecasts, and competitor intelligence into the Strategic Object Model.</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${dragOver ? 'active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="dz-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
          </svg>
        </div>
        <p className="dz-title">Drag & drop files here</p>
        <span className="dz-or">or</span>
        <label className="dz-browse">
          Browse Files
          <input type="file" multiple accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileSelect} hidden/>
        </label>
        <div className="dz-formats">
          <span className="fmt">XLSX</span>
          <span className="fmt">CSV</span>
          <span className="fmt">PDF</span>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="file-section">
          <div className="file-header">
            <h4>Uploaded Files</h4>
            <span className="file-count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-row">
                <div className="file-badge" style={{ color: fileColor(f.name), borderColor: fileColor(f.name) }}>
                  {fileIcon(f.name)}
                </div>
                <div className="file-info">
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">{(f.size / 1024).toFixed(1)} KB</span>
                </div>
                <button className="file-rm" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
          {detected.length === 0 && (
            <button className="btn-parse" onClick={simulateParse} disabled={parsing}>
              {parsing ? (
                <><div className="spinner"/>Parsing & Mapping...</>
              ) : (
                <>Parse & Map to Strategic Model<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          )}
        </div>
      )}

      {/* Detection Results */}
      {detected.length > 0 && (
        <div className="det-section">
          <div className="det-header">
            <h4>Detected Data Objects</h4>
            <span className="det-count">{detected.filter(d => d.status === 'mapped').length}/{detected.length} mapped</span>
          </div>
          <div className="det-grid">
            {detected.map((d, i) => (
              <div key={i} className={`det-card ${d.status}`}>
                <div className="det-top">
                  <span className={`det-badge ${d.status}`}>
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
                  <div className="det-warn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                    </svg>
                    <span>{d.clarification}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {clarifications.length > 0 && (
            <div className="clarify-box">
              <h4>AI Clarification Required</h4>
              {clarifications.map((c, i) => (
                <div key={i} className="clarify-item">
                  <span className="clarify-q">{c}</span>
                  <input type="text" className="clarify-input" placeholder="Enter value..."/>
                </div>
              ))}
            </div>
          )}

          <button className="btn-proceed" onClick={handleProceed}>
            Proceed to Strategy Journey
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      <style jsx>{`
        .uf-root { max-width: 800px; margin: 0 auto; padding: 32px 24px; }

        /* ── Header ── */
        .uf-header { margin-bottom: 32px; }
        .uf-back {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 0; background: none; border: none;
          color: rgba(255,255,255,0.35); font-size: 13px; font-weight: 500;
          cursor: pointer; margin-bottom: 20px; transition: color 0.2s;
          font-family: inherit;
        }
        .uf-back:hover { color: #fff; }
        .uf-header h2 {
          font-size: 24px; font-weight: 700; color: #fff;
          margin: 0 0 8px; letter-spacing: -0.5px;
        }
        .uf-header p { font-size: 14px; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.6; }

        /* ── Drop Zone ── */
        .drop-zone {
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          padding: 52px 24px;
          border: 2px dashed rgba(255,255,255,0.08);
          border-radius: 20px; text-align: center;
          background: rgba(255,255,255,0.02);
          margin-bottom: 20px; transition: all 0.25s;
        }
        .drop-zone.active, .drop-zone:hover {
          border-color: rgba(168, 85, 247, 0.4);
          background: rgba(168, 85, 247, 0.03);
        }
        .dz-icon { color: rgba(255,255,255,0.2); }
        .drop-zone.active .dz-icon { color: #A855F7; }
        .dz-title { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.6); margin: 0; }
        .dz-or { font-size: 12px; color: rgba(255,255,255,0.2); }
        .dz-browse {
          padding: 10px 24px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 10px; font-size: 14px; font-weight: 600;
          color: #C084FC; cursor: pointer; transition: all 0.2s;
        }
        .dz-browse:hover { background: rgba(168, 85, 247, 0.18); }
        .dz-formats { display: flex; gap: 8px; margin-top: 4px; }
        .fmt {
          padding: 3px 10px; border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3);
        }

        /* ── File Section ── */
        .file-section {
          background: linear-gradient(135deg, rgba(26,26,37,0.7), rgba(20,20,30,0.85));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 22px; margin-bottom: 20px;
        }
        .file-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .file-header h4 { font-size: 14px; font-weight: 600; color: #fff; margin: 0; }
        .file-count { font-size: 12px; color: rgba(255,255,255,0.35); }
        .file-list { display: flex; flex-direction: column; gap: 8px; }
        .file-row {
          display: flex; align-items: center; gap: 14px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 12px; transition: all 0.2s;
        }
        .file-row:hover { border-color: rgba(255,255,255,0.08); }
        .file-badge {
          width: 40px; height: 40px; border-radius: 10px;
          border: 1px solid; display: flex;
          align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.02);
        }
        .file-info { flex: 1; }
        .file-name { display: block; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }
        .file-size { font-size: 11px; color: rgba(255,255,255,0.3); }
        .file-rm {
          width: 28px; height: 28px; background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.12); border-radius: 8px;
          color: #EF4444; cursor: pointer; display: flex;
          align-items: center; justify-content: center; transition: all 0.2s;
        }
        .file-rm:hover { background: rgba(239,68,68,0.12); }
        .btn-parse {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px; margin-top: 14px;
          background: linear-gradient(135deg, #A855F7, #7C3AED);
          border: none; border-radius: 12px; font-size: 15px;
          font-weight: 600; color: white; cursor: pointer;
          transition: all 0.25s; font-family: inherit;
        }
        .btn-parse:hover { box-shadow: 0 8px 32px rgba(168, 85, 247, 0.3); transform: translateY(-1px); }
        .btn-parse:disabled { opacity: 0.6; transform: none; box-shadow: none; }
        .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Detection ── */
        .det-section {
          background: linear-gradient(135deg, rgba(26,26,37,0.7), rgba(20,20,30,0.85));
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 22px;
        }
        .det-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .det-header h4 { font-size: 14px; font-weight: 600; color: #fff; margin: 0; }
        .det-count { font-size: 12px; font-weight: 600; color: #22C55E; }
        .det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .det-card {
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; transition: all 0.2s;
        }
        .det-card:hover { border-color: rgba(255,255,255,0.1); }
        .det-card.missing { border-color: rgba(245, 158, 11, 0.2); background: rgba(245, 158, 11, 0.03); }
        .det-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .det-badge {
          padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .det-badge.mapped { background: rgba(34, 197, 94, 0.1); color: #22C55E; }
        .det-badge.missing { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
        .det-type { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.8); }
        .det-fields { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
        .det-field {
          padding: 3px 8px; background: rgba(124, 58, 237, 0.08);
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 5px; font-size: 10px; color: #A855F7; font-weight: 500;
        }
        .det-rows { font-size: 11px; color: rgba(255,255,255,0.3); }
        .det-warn {
          display: flex; align-items: flex-start; gap: 8px;
          font-size: 12px; color: #F59E0B; line-height: 1.5;
        }
        .clarify-box { margin-bottom: 20px; }
        .clarify-box h4 { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.6); margin: 0 0 12px; }
        .clarify-item { margin-bottom: 12px; }
        .clarify-q { display: block; font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 6px; }
        .clarify-input {
          width: 100%; padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; font-size: 14px; color: #fff;
          outline: none; transition: border-color 0.2s; font-family: inherit;
        }
        .clarify-input:focus { border-color: rgba(168, 85, 247, 0.4); }
        .clarify-input::placeholder { color: rgba(255,255,255,0.2); }
        .btn-proceed {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #A855F7, #7C3AED);
          border: none; border-radius: 12px; font-size: 15px;
          font-weight: 600; color: white; cursor: pointer;
          transition: all 0.25s; font-family: inherit;
        }
        .btn-proceed:hover { box-shadow: 0 8px 32px rgba(124, 58, 237, 0.3); transform: translateY(-1px); }

        @media (max-width: 640px) { .det-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
