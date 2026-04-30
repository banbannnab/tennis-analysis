// 视频上传相关类型
export interface VideoFile {
  file: File;
  previewUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
}

// 姿态关键点类型（MediaPipe Pose 输出）
export interface PoseKeypoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
  name: string;
}

// 关键帧类型
export interface KeyFrame {
  id: string;
  timestamp: number; // 时间戳（秒）
  imageUrl: string; // 关键帧图片 URL
  keypoints?: PoseKeypoint[]; // 姿态关键点
  actionType?: string; // 动作类型（正手、反手、发球等）
  analysis?: FrameAnalysis; // 分析结果
}

// 单帧分析结果
export interface FrameAnalysis {
  score: number; // 动作质量评分（0-100）
  issues: AnalysisIssue[]; // 发现的问题
  suggestions: string[]; // 改进建议
  comparisons?: ComparisonData[]; // 与标准动作的对比数据
}

// 问题分析
export interface AnalysisIssue {
  type: 'angle' | 'distance' | 'timing' | 'posture';
  description: string;
  severity: 'low' | 'medium' | 'high';
  keypointIndices?: number[]; // 相关的关键点索引
}

// 对比数据（用于可视化标注）
export interface ComparisonData {
  label: string;
  actualValue: number;
  idealValue: number;
  unit: string;
  difference: number;
  // 标注相关关键点索引
  keypointIndices?: number[]; // 用于绘制标注线的关键点
  measurementType?: 'angle' | 'distance' | 'position'; // 测量类型
  // 角度测量（3个关键点：起点-中点-终点）
  anglePoints?: [number, number, number]; // [point1, vertex, point2]
  // 距离测量（2个关键点）
  distancePoints?: [number, number]; // [point1, point2]
}

// 模型分析结果（统一格式）
export interface ModelAnalysisResult {
  modelName: string;
  modelVersion?: string;
  keyFrames: KeyFrame[];
  overallScore?: number;
  summary?: string;
}

// API 响应类型
export interface AnalyzeResponse {
  success: boolean;
  data?: ModelAnalysisResult[];
  error?: string;
}

// 小红书教程链接
export interface TutorialLink {
  title: string;
  url: string;
  platform: 'xiaohongshu' | 'bilibili' | 'youtube';
}
