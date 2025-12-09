'use client';

import { useState, useRef } from 'react';

interface DataUploadButtonProps {
  onUpload?: (files: FileList) => void;
  variant?: 'compact' | 'full';
  className?: string;
  acceptedTypes?: string;
  label?: string;
}

export default function DataUploadButton({
  onUpload,
  variant = 'compact',
  className = '',
  acceptedTypes = '.csv,.xlsx,.xls,.json,.pdf,.doc,.docx,.txt',
  label = 'Upload Data',
}: DataUploadButtonProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
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
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    onUpload?.(files);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (variant === 'compact') {
    return (
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
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            isDragging
              ? 'bg-teal-500/30 border-teal-400 text-teal-300'
              : 'bg-navy-700/50 border-navy-600 text-gray-400 hover:text-teal-400 hover:border-teal-500/50 hover:bg-navy-700'
          } border`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>{label}</span>
        </button>

        {showSuccess && (
          <div className="absolute top-full left-0 mt-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-400 whitespace-nowrap z-50">
            File uploaded successfully
          </div>
        )}
      </div>
    );
  }

  return (
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
            : 'border-navy-600 hover:border-teal-500/50 hover:bg-navy-700/30'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isDragging ? 'bg-teal-500/20' : 'bg-navy-700'
          }`}>
            <svg className={`w-6 h-6 ${isDragging ? 'text-teal-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium text-white mb-1">
              {isDragging ? 'Drop files here' : 'Upload your data'}
            </p>
            <p className="text-xs text-gray-400">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              CSV, Excel, JSON, PDF, Word, TXT
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-800/90 rounded-xl">
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Uploaded successfully</span>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-3 space-y-1">
          {uploadedFiles.slice(-3).map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
              <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
