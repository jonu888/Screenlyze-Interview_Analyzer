import React, { useState, useRef } from 'react';
import ApiService from '../services/api';
import { Upload as UploadIcon } from 'lucide-react';

export default function FileUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const handleFileChange = (f) => {
    setFile(f);
    setError('');
    if (videoRef.current && f) {
      const url = URL.createObjectURL(f);
      videoRef.current.src = url;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !candidateName) {
      setError('📌 Please select a video file and enter candidate name.');
      return;
    }

    setLoading(true);
    setProgress(0);
    setError('');

    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 10;
      setProgress(fakeProgress);
      if (fakeProgress >= 90) clearInterval(interval);
    }, 200);

    try {
      const result = await ApiService.analyzeVideo(file, candidateName);
      setProgress(100);
      onSuccess(result);
    } catch (err) {
      let backendError = '❌ Upload failed. Please try again.';
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          backendError = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        } else if (typeof err.response.data === 'string') {
          backendError = err.response.data;
        }
      }
      setError(backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Upload Video</h2>

        {/* Video Preview */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            controls
            playsInline
            className="w-full"
          />
        </div>

        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
            accept="video/*"
          />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-600">Drag & drop a video file here, or click to select one</p>
          <p className="text-xs text-gray-500">(MP4, WebM, etc.)</p>
          {file && (
            <p className="mt-2 text-sm font-medium text-gray-800">
              Selected file: <span className="font-normal">{file.name}</span>
            </p>
          )}
        </div>

        {/* Candidate Name Input */}
        <div>
          <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">
            Candidate Name
          </label>
          <input
            type="text"
            id="candidateName"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter candidate name"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file || !candidateName}
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? `Uploading... ${progress}%` : 'Upload for Analysis'}
        </button>

        {/* Progress Bar */}
        {loading && progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
