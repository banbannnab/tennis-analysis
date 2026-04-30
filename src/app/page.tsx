'use client';

import { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { ModelAnalysisResult } from '@/types';

export default function Home() {
  const [analysisResults, setAnalysisResults] = useState<ModelAnalysisResult[] | null>(null);

  const handleAnalysisComplete = (results: ModelAnalysisResult[]) => {
    setAnalysisResults(results);
  };

  const handleReset = () => {
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">网球动作分析</h1>
              <p className="text-sm text-gray-500 mt-1">AI 驱动的网球技术分析与指导工具</p>
            </div>
            {analysisResults && (
              <button
                onClick={handleReset}
                className="px-5 py-2.5 text-sm font-medium text-blue-600 hover:text-blue-700 
                         border border-blue-200 rounded-lg hover:bg-blue-50 transition-all"
              >
                上传新视频
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {!analysisResults ? (
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">上传你的网球动作视频</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                AI 将自动分析你的击球动作，识别关键技术点，<br />
                并提供专业的改进建议和训练方案
              </p>
            </div>

            {/* Upload Area */}
            <VideoUpload onAnalysisComplete={handleAnalysisComplete} />

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-16">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">AI 智能分析</h3>
                <p className="text-sm text-gray-600">多模型对比分析，确保结果准确可靠</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 4h16v16H4V4z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">关键帧提取</h3>
                <p className="text-sm text-gray-600">自动识别关键技术动作，精准标注问题</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">专业指导</h3>
                <p className="text-sm text-gray-600">提供针对性训练方案，链接专业教程</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <AnalysisResults results={analysisResults} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-gray-400">
            网球动作分析工具 · AI 驱动的专业技术分析
          </p>
        </div>
      </footer>
    </div>
  );
}
