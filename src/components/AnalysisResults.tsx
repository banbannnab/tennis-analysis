'use client';

import { useState } from 'react';
import { ModelAnalysisResult, KeyFrame } from '@/types';
import PoseVisualization from './PoseVisualization';
import TrainingTutorials from './TrainingTutorials';

interface AnalysisResultsProps {
  results: ModelAnalysisResult[];
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState<KeyFrame | null>(null);

  const selectedModel = results[selectedModelIndex];

  // 获取动作类型的中文名称
  const getActionTypeChinese = (actionType: string) => {
    const typeMap: Record<string, string> = {
      'forehand': '正手击球',
      'backhand': '反手击球',
      'serve': '发球',
      'volley': '截击',
      'smash': '扣杀',
      'follow_through': '随挥动作',
    };
    return typeMap[actionType] || actionType;
  };

  // 获取问题类型的中文描述
  const getIssueTypeChinese = (type: string) => {
    const typeMap: Record<string, string> = {
      'angle': '角度问题',
      'distance': '距离问题',
      'timing': '时机问题',
      'posture': '姿态问题',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-10">
      {/* Model Selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-4">选择分析模型</h3>
        <div className="flex flex-wrap gap-3">
          {results.map((result, index) => (
            <button
              key={result.modelName}
              onClick={() => {
                setSelectedModelIndex(index);
                setSelectedFrame(null);
              }}
              className={`
                px-5 py-3 rounded-xl text-sm font-medium transition-all
                ${selectedModelIndex === index
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span>{result.modelName}</span>
              {result.overallScore && (
                <span className={`ml-2 text-xs ${selectedModelIndex === index ? 'text-blue-200' : 'text-gray-400'}`}>
                  评分: {result.overallScore}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Model Summary */}
      {selectedModel.summary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">分析摘要</h4>
              <p className="text-sm text-blue-800 leading-relaxed">{selectedModel.summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Frames Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">关键动作帧</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedModel.keyFrames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setSelectedFrame(frame)}
              className={`
                group relative overflow-hidden rounded-xl transition-all duration-300
                ${selectedFrame?.id === frame.id
                  ? 'ring-2 ring-blue-600 shadow-lg shadow-blue-100'
                  : 'hover:shadow-md border border-gray-200 hover:border-blue-300'
                }
              `}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                <img 
                  src={frame.imageUrl} 
                  alt={`${getActionTypeChinese(frame.actionType || '')} - ${frame.timestamp}秒`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 如果图片加载失败，显示占位符
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-medium">
                    {frame.timestamp}秒
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium">
                  {getActionTypeChinese(frame.actionType || '')}
                </p>
                <p className="text-white/70 text-xs mt-0.5">
                  {frame.timestamp}秒
                </p>
              </div>
              {selectedFrame?.id === frame.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Frame Analysis */}
      {selectedFrame && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              {getActionTypeChinese(selectedFrame.actionType || '')}分析
            </h4>
            <p className="text-sm text-gray-500 mt-1">时间节点: {selectedFrame.timestamp}秒</p>
          </div>
            <span className={`
              px-4 py-2 rounded-lg text-sm font-medium
              ${selectedFrame.analysis && selectedFrame.analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                selectedFrame.analysis && selectedFrame.analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }
            `}>
              评分: {selectedFrame.analysis?.score || '--'}/100
            </span>
          </div>

          {/* Pose Visualization */}
          {selectedFrame.keypoints && (
            <div>
              <h5 className="text-base font-medium text-gray-900 mb-4">姿态可视化</h5>
              <div className="bg-gray-50 rounded-xl p-4">
                <PoseVisualization frame={selectedFrame} imageUrl={selectedFrame.imageUrl} />
              </div>
            </div>
          )}

          {/* Score */}
          {selectedFrame.analysis && (
            <>
              {/* Issues */}
              {selectedFrame.analysis.issues.length > 0 && (
                <div>
                  <h5 className="text-base font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>发现的问题</span>
                  </h5>
                  <div className="space-y-3">
                    {selectedFrame.analysis.issues.map((issue, index) => (
                      <div 
                        key={index} 
                        className={`
                          p-4 rounded-xl border-l-4
                          ${issue.severity === 'high' ? 'bg-red-50 border-red-500' : 
                            issue.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded mb-2 
                              bg-white text-gray-600">
                              {getIssueTypeChinese(issue.type)}
                            </span>
                            <p className="text-sm text-gray-800">{issue.description}</p>
                          </div>
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded
                            ${issue.severity === 'high' ? 'bg-red-100 text-red-800' : 
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }
                          `}>
                            {issue.severity === 'high' ? '严重' : 
                             issue.severity === 'medium' ? '中等' : '轻微'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {selectedFrame.analysis.suggestions.length > 0 && (
                <div>
                  <h5 className="text-base font-medium text-gray-900 mb-4 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>改进建议</span>
                  </h5>
                  <div className="space-y-2">
                    {selectedFrame.analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-800 pt-0.5">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Training Tutorials */}
              {selectedFrame.analysis && selectedFrame.analysis.suggestions.length > 0 && (
                <TrainingTutorials suggestions={selectedFrame.analysis.suggestions} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
