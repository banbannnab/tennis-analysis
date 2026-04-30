'use client';

import React, { useState, useCallback } from 'react';
import { ModelAnalysisResult } from '@/types';

interface VideoUploadProps {
  onAnalysisComplete: (results: ModelAnalysisResult[]) => void;
}

export default function VideoUpload({ onAnalysisComplete }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    // 验证文件类型
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setError('请上传 MP4、MOV 或 MKV 格式的视频文件');
      return;
    }

    // 验证文件大小（100MB）
    if (file.size > 100 * 1024 * 1024) {
      setError('视频文件大小不能超过 100MB');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '分析失败');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        onAnalysisComplete(result.data);
      } else {
        throw new Error(result.error || '分析失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium mb-2">
                {uploadProgress < 90 ? '正在上传视频...' : '正在分析视频...'}
              </p>
              {uploadProgress < 90 ? (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
                </>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-gray-500">AI分析中，请稍候...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <svg 
                className="w-10 h-10 text-blue-600"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">拖拽视频到此处，或点击上传</h3>
            <p className="text-sm text-gray-500 mb-6">支持 MP4、MOV、MKV 格式，最大 100MB</p>
            <input
              type="file"
              id="video-upload"
              className="hidden"
              accept="video/mp4,video/quicktime,video/x-matroska"
              onChange={handleFileInputChange}
            />
            <label
              htmlFor="video-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl 
                       hover:bg-blue-700 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              选择视频文件
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
