'use client';

import { useState } from 'react';

interface TutorialLink {
  title: string;
  url: string;
  platform: 'xiaohongshu' | 'bilibili' | 'youtube';
  description: string;
}

interface TrainingTutorialsProps {
  suggestions: string[];
}

// 模拟教程数据库（实际项目中应该从 API 获取）
const TUTORIAL_DATABASE: Record<string, TutorialLink[]> = {
  '肘部': [
    {
      title: '网球正手肘部动作详解',
      url: 'https://www.xiaohongshu.com/explore/tennis-forehand-elbow',
      platform: 'xiaohongshu',
      description: '详细讲解正手击球时肘部的正确位置和角度',
    },
  ],
  '重心': [
    {
      title: '网球站位与重心控制',
      url: 'https://www.xiaohongshu.com/explore/tennis-stance-balance',
      platform: 'xiaohongshu',
      description: '如何保持正确的站位和重心分配',
    },
  ],
  '挥拍': [
    {
      title: '网球挥拍轨迹训练',
      url: 'https://www.xiaohongshu.com/explore/tennis-swing-path',
      platform: 'xiaohongshu',
      description: '正确的挥拍轨迹练习方法',
    },
  ],
  '随挥': [
    {
      title: '网球随挥动作完整教学',
      url: 'https://www.bilibili.com/video/tennis-follow-through',
      platform: 'bilibili',
      description: '随挥动作的要点和常见错误',
    },
  ],
};

export default function TrainingTutorials({ suggestions }: TrainingTutorialsProps) {
  const [expanded, setExpanded] = useState(false);

  // 根据建议内容匹配相关教程
  const matchedTutorials: TutorialLink[] = [];
  
  suggestions.forEach(suggestion => {
    Object.keys(TUTORIAL_DATABASE).forEach(keyword => {
      if (suggestion.includes(keyword)) {
        const tutorials = TUTORIAL_DATABASE[keyword];
        tutorials.forEach(tutorial => {
          if (!matchedTutorials.find(t => t.url === tutorial.url)) {
            matchedTutorials.push(tutorial);
          }
        });
      }
    });
  });

  // 如果没有匹配到教程，显示默认教程
  if (matchedTutorials.length === 0) {
    matchedTutorials.push({
      title: '网球基础动作合集',
      url: 'https://www.xiaohongshu.com/explore/tennis-basics',
      platform: 'xiaohongshu',
      description: '全面的网球基础动作教学',
    });
  }

  const handleTutorialClick = (url: string) => {
    // 在小程序环境中，可能需要特殊处理链接跳转
    window.open(url, '_blank');
  };

  return (
    <div className="pt-4 border-t border-gray-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-sm text-blue-600 hover:text-blue-700"
      >
        <span>View Training Tutorials ({matchedTutorials.length})</span>
        <span>{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {matchedTutorials.map((tutorial, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="text-sm font-medium text-gray-800">
                    {tutorial.title}
                  </h6>
                  <p className="text-xs text-gray-500 mt-1">
                    {tutorial.description}
                  </p>
                  <span className="inline-block mt-2 text-xs text-gray-400">
                    {tutorial.platform === 'xiaohongshu' ? '小红书' :
                     tutorial.platform === 'bilibili' ? '哔哩哔哩' : 'YouTube'}
                  </span>
                </div>
                <button
                  onClick={() => handleTutorialClick(tutorial.url)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  查看教程
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
