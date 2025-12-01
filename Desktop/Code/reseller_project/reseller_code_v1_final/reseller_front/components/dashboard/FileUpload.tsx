
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  title: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
  bgColor: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ title, file, onFileChange, acceptedTypes, bgColor }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1">
      <label htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`} className="cursor-pointer">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors duration-300
            ${bgColor} 
            ${isDragging ? 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900' : 'border-gray-300 dark:border-gray-600'}`}
        >
          <div className="text-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h4l3 3h6a4 4 0 014 4v8a4 4 0 01-4 4H7z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            {file ? (
              <>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">{file.name}</p>
                <button 
                  onClick={(e) => { e.preventDefault(); onFileChange(null); }} 
                  className="mt-1 text-xs text-red-500 hover:underline"
                >
                  제거
                </button>
              </>
            ) : (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">파일을 Drag & Drop 하거나 클릭하여 업로드</p>
            )}
          </div>
        </div>
      </label>
      <input
        id={`file-upload-${title.replace(/\s+/g, '-')}`}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
