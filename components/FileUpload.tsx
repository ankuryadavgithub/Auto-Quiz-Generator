
import React, { useState, useCallback } from 'react';
import { UploadIcon, FileIcon } from './icons/Icons';

interface FileUploadProps {
  onGenerateQuiz: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onGenerateQuiz }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/plain' || file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Unsupported file type. Please upload a PDF or a plain text file.');
      }
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onGenerateQuiz(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <form onSubmit={handleSubmit}>
        <div
          onDragEnter={handleDragEvents}
          onDragOver={handleDragEvents}
          onDragLeave={handleDragEvents}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out
            ${isDragging ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/50' : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <UploadIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
            <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">PDF or TXT files</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.txt"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </div>

        {selectedFile && (
          <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{selectedFile.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={!selectedFile}
            className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Generate Quiz
          </button>
        </div>
      </form>
    </div>
  );
};
