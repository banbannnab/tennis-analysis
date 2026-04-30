'use client';

import { useEffect, useRef, useState } from 'react';
import { KeyFrame, PoseKeypoint, ComparisonData } from '@/types';

interface PoseVisualizationProps {
  frame: KeyFrame;
  imageUrl: string;
}

// MediaPipe Pose 关键点连接定义
const POSE_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 7], // 右胳膊
  [0, 4], [4, 5], [5, 6], [6, 8], // 左胳膊
  [9, 10], // 左右手
  [11, 12], // 肩膀
  [11, 13], [13, 15], // 左腿
  [12, 14], [14, 16], // 右腿
  [11, 23], [12, 24], // 躯干
  [23, 24], // 臀部
  [23, 25], [25, 27], [27, 29], [29, 31], // 左腿细节
  [24, 26], [26, 28], [28, 30], [30, 32], // 右腿细节
];

export default function PoseVisualization({ frame, imageUrl }: PoseVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 加载图片
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!frame.keypoints || !imageLoaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    canvas.width = imageRef.current.width || 640;
    canvas.height = imageRef.current.height || 360;

    // 绘制背景图片
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

    const keypoints = frame.keypoints;

    // 绘制关键点连接线
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;
    
    POSE_CONNECTIONS.forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      
      if (kp1 && kp2 && (kp1.visibility ?? 0) > 0.5 && (kp2.visibility ?? 0) > 0.5) {
        ctx.beginPath();
        ctx.moveTo(kp1.x * canvas.width, kp1.y * canvas.height);
        ctx.lineTo(kp2.x * canvas.width, kp2.y * canvas.height);
        ctx.stroke();
      }
    });

    // 绘制关键点
    keypoints.forEach(kp => {
      if ((kp.visibility ?? 0) < 0.5) return;

      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(kp.x * canvas.width, kp.y * canvas.height, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // 绘制问题分析标注
    if (frame.analysis?.issues) {
      frame.analysis.issues.forEach(issue => {
        if (issue.keypointIndices) {
          issue.keypointIndices.forEach(idx => {
            const kp = keypoints[idx];
            if (kp && (kp.visibility ?? 0) > 0.5) {
              // 绘制红色圆圈标记问题点
              ctx.strokeStyle = '#FF0000';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(kp.x * canvas.width, kp.y * canvas.height, 10, 0, 2 * Math.PI);
              ctx.stroke();

              // 绘制问题描述
              ctx.fillStyle = '#FF0000';
              ctx.font = 'bold 12px Arial';
              ctx.fillText(
                issue.description,
                kp.x * canvas.width + 15,
                kp.y * canvas.height
              );
            }
          });
        }
      });
    }

    // 绘制对比数据标注（角度、距离等）
    if (frame.analysis?.comparisons) {
      frame.analysis.comparisons.forEach((comp: ComparisonData, index) => {
        // 绘制测量标注
        if (comp.anglePoints && comp.anglePoints.length === 3) {
          drawAngleAnnotation(ctx, keypoints, comp, canvas.width, canvas.height);
        } else if (comp.distancePoints && comp.distancePoints.length === 2) {
          drawDistanceAnnotation(ctx, keypoints, comp, canvas.width, canvas.height);
        }

        // 绘制对比数据文本
        const yPos = 30 + index * 25;
        const diffColor = comp.difference > 0 ? '#FF0000' : '#00FF00';
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, yPos - 15, 400, 20);
        
        ctx.fillStyle = diffColor;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(
          `${comp.label}: 实际 ${comp.actualValue}${comp.unit} | 标准 ${comp.idealValue}${comp.unit} | 差距 ${comp.difference > 0 ? '+' : ''}${comp.difference}${comp.unit}`,
          10,
          yPos
        );
      });
    }

  }, [frame, imageLoaded]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-gray-200"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* 图例 */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-3 rounded text-xs space-y-1 shadow">
        <div className="flex items-center space-x-1">
          <div className="w-4 h-0.5 bg-green-500" />
          <span>骨骼连接</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>关键点</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-4 rounded-full border-2 border-red-500" />
          <span>问题区域</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-0.5 bg-blue-500" />
          <span>角度标注</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-4 h-0.5 bg-yellow-500" />
          <span>距离标注</span>
        </div>
      </div>

      {/* 测量数据说明 */}
      {frame.analysis?.comparisons && frame.analysis.comparisons.length > 0 && (
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-3 rounded text-xs shadow max-w-xs">
          <p className="font-bold mb-1">测量数据说明：</p>
          <ul className="space-y-1">
            {frame.analysis.comparisons.map((comp: ComparisonData, idx: number) => (
              <li key={idx} className="text-gray-700">
                <span className="font-medium">{comp.label}:</span>
                <br />
                实际值: {comp.actualValue}{comp.unit}
                <br />
                标准值: {comp.idealValue}{comp.unit}
                <br />
                <span className={comp.difference > 0 ? 'text-red-500' : 'text-green-500'}>
                  差距: {comp.difference > 0 ? '+' : ''}{comp.difference}{comp.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 绘制角度标注
function drawAngleAnnotation(
  ctx: CanvasRenderingContext2D,
  keypoints: PoseKeypoint[],
  comp: ComparisonData,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!comp.anglePoints || comp.anglePoints.length !== 3) return;

  const [p1Idx, vertexIdx, p2Idx] = comp.anglePoints;
  const p1 = keypoints[p1Idx];
  const vertex = keypoints[vertexIdx];
  const p2 = keypoints[p2Idx];

  if (!p1 || !vertex || !p2) return;
  if ((p1.visibility ?? 0) < 0.5 || (vertex.visibility ?? 0) < 0.5 || (p2.visibility ?? 0) < 0.5) return;

  const x1 = p1.x * canvasWidth;
  const y1 = p1.y * canvasHeight;
  const xv = vertex.x * canvasWidth;
  const yv = vertex.y * canvasHeight;
  const x2 = p2.x * canvasWidth;
  const y2 = p2.y * canvasHeight;

  // 绘制角度弧线
  const angle1 = Math.atan2(y1 - yv, x1 - xv);
  const angle2 = Math.atan2(y2 - yv, x2 - xv);
  const radius = 30;

  ctx.strokeStyle = '#0088FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(xv, yv, radius, angle1, angle2, false);
  ctx.stroke();

  // 绘制角度文本
  const midAngle = (angle1 + angle2) / 2;
  const textX = xv + (radius + 15) * Math.cos(midAngle);
  const textY = yv + (radius + 15) * Math.sin(midAngle);

  ctx.fillStyle = '#0088FF';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`${comp.actualValue}°`, textX, textY);

  // 绘制标准角度
  ctx.fillStyle = '#00AA00';
  ctx.fillText(`(标准 ${comp.idealValue}°)`, textX, textY + 15);
}

// 绘制距离标注
function drawDistanceAnnotation(
  ctx: CanvasRenderingContext2D,
  keypoints: PoseKeypoint[],
  comp: ComparisonData,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!comp.distancePoints || comp.distancePoints.length !== 2) return;

  const [p1Idx, p2Idx] = comp.distancePoints;
  const p1 = keypoints[p1Idx];
  const p2 = keypoints[p2Idx];

  if (!p1 || !p2) return;
  if ((p1.visibility ?? 0) < 0.5 || (p2.visibility ?? 0) < 0.5) return;

  const x1 = p1.x * canvasWidth;
  const y1 = p1.y * canvasHeight;
  const x2 = p2.x * canvasWidth;
  const y2 = p2.y * canvasHeight;

  // 绘制距离线
  ctx.strokeStyle = '#FFAA00';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 绘制距离文本
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  ctx.fillStyle = '#FFAA00';
  ctx.font = 'bold 14px Arial';
  ctx.fillText(`${comp.actualValue}${comp.unit}`, midX + 10, midY);

  // 绘制标准距离
  ctx.fillStyle = '#00AA00';
  ctx.fillText(`(标准 ${comp.idealValue}${comp.unit})`, midX + 10, midY + 15);
}
