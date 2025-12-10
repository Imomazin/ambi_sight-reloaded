'use client';

import { useState, useRef } from 'react';
import DataProcessingModal, { type AnalysisResult } from './DataProcessingModal';

interface DataUploadButtonProps {
  onUpload?: (files: FileList) => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
  variant?: 'compact' | 'full';
  className?: string;
  acceptedTypes?: string;
  label?: string;
  enableProcessing?: boolean;
}

export default function DataUploadButton({
  onUpload,
  onAnalysisComplete,
  variant = 'compact',
  className = '',
  acceptedTypes = '.csv,.xlsx,.xls,.json,.pdf,.doc,.docx,.txt',
  label = 'Upload Data',
  enableProcessing = true,
}: DataUploadButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileNames = Array.from(files).map(f => f.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
    onUpload?.(files);

    if (enableProcessing && files.length > 0) {
      // Start processing the first file
      setCurrentFileName(files[0].name);
      setIsProcessing(true);
    } else {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleProcessingComplete = (result: AnalysisResult) => {
    setAnalysisResults(prev => [...prev, result]);
    onAnalysisComplete?.(result);
  };

  const handleModalClose = () => {
    setIsProcessing(false);
    setCurrentFileName('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (variant === 'compact') {
    return (
      <>
        <div className={`relative ${className}`}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
              isDragging
                ? 'bg-teal-500/30 border-teal-400 text-teal-300 shadow-lg shadow-teal-500/20'
                : 'bg-teal-600/20 border-teal-500/40 text-teal-400 hover:bg-teal-500/30 hover:border-teal-400 hover:text-teal-300 hover:shadow-lg hover:shadow-teal-500/10'
            } border`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{label}</span>
          </button>

          {showSuccess && (
            <div className="absolute top-full left-0 mt-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-400 whitespace-nowrap z-50">
              Analysis complete!
            </div>
          )}

          {analysisResults.length > 0 && !showSuccess && (
            <div className="absolute top-full left-0 mt-2 px-3 py-1.5 bg-teal-500/20 border border-teal-500/30 rounded-lg text-xs text-teal-400 whitespace-nowrap z-50">
              {analysisResults.length} file{analysisResults.length > 1 ? 's' : ''} analyzed
            </div>
          )}
        </div>

        <DataProcessingModal
          isOpen={isProcessing}
          onClose={handleModalClose}
          fileName={currentFileName}
          onComplete={handleProcessingComplete}
        />
      </>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            isDragging
              ? 'border-teal-400 bg-teal-500/10'
              : 'border-[var(--border-color)] hover:border-teal-500/50 hover:bg-[var(--bg-card-hover)]'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDragging ? 'bg-teal-500/20' : 'bg-[var(--bg-secondary)]'
            }`}>
              <svg className={`w-6 h-6 ${isDragging ? 'text-teal-400' : 'text-[var(--text-muted)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {isDragging ? 'Drop files here' : 'Upload your data for AI analysis'}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                CSV, Excel, JSON, PDF, Word, TXT
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-teal-400 mt-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI-powered analysis included</span>
            </div>
          </div>

          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/90 rounded-xl">
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Analysis complete!</span>
              </div>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-1">
            {uploadedFiles.slice(-3).map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="truncate">{file}</span>
                <span className="text-green-400">✓ Analyzed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <DataProcessingModal
        isOpen={isProcessing}
        onClose={handleModalClose}
        fileName={currentFileName}
        onComplete={handleProcessingComplete}
      />
    </>
  );
}
