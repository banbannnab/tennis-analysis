import ffmpeg from 'fluent-ffmpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

// 获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 关键帧提取配置
const KEYFRAME_INTERVAL = 1; // 每秒提取1帧
const OUTPUT_DIR = join(process.cwd(), 'public', 'frames');

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface ExtractedFrame {
  timestamp: number;
  path: string;
  url: string;
}

/**
 * 从视频中提取关键帧
 * @param videoPath 视频文件路径
 * @param intervals 提取间隔（秒），默认1秒
 * @returns 提取的关键帧信息数组
 */
export async function extractKeyframes(
  videoPath: string,
  intervals: number = KEYFRAME_INTERVAL
): Promise<ExtractedFrame[]> {
  return new Promise((resolve, reject) => {
    const frames: ExtractedFrame[] = [];
    const videoName = videoPath.split('/').pop()?.split('.')[0] || 'video';
    
    // 获取视频时长
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(new Error(`无法读取视频信息: ${err.message}`));
        return;
      }

      const duration = metadata.format.duration || 0;
      const timestamps: number[] = [];
      
      // 生成时间戳数组
      for (let t = 0; t < duration; t += intervals) {
        timestamps.push(Math.round(t * 10) / 10);
      }

      // 提取每个时间戳的帧
      let processed = 0;
      
      timestamps.forEach((timestamp) => {
        const outputFileName = `${videoName}_${timestamp}s.jpg`;
        const outputPath = join(OUTPUT_DIR, outputFileName);
        const outputUrl = `/frames/${outputFileName}`;

        ffmpeg(videoPath)
          .screenshots({
            timestamps: [timestamp],
            filename: outputFileName,
            folder: OUTPUT_DIR,
            size: '640x?', // 保持宽高比
          })
          .on('end', () => {
            frames.push({
              timestamp,
              path: outputPath,
              url: outputUrl,
            });
            
            processed++;
            
            // 所有帧都处理完成
            if (processed === timestamps.length) {
              // 按时间戳排序
              frames.sort((a, b) => a.timestamp - b.timestamp);
              resolve(frames);
            }
          })
          .on('error', (err) => {
            console.error(`提取帧失败 (${timestamp}s):`, err);
            processed++;
            
            // 即使有错误，也继续处理其他帧
            if (processed === timestamps.length) {
              frames.sort((a, b) => a.timestamp - b.timestamp);
              resolve(frames);
            }
          });
      });

      // 如果没有时间戳（视频太短）
      if (timestamps.length === 0) {
        resolve([]);
      }
    });
  });
}

/**
 * 从视频中选择最关键的动作帧（用于姿态分析）
 * @param frames 所有提取的帧
 * @param maxFrames 最大返回帧数
 * @returns 选择的关键帧
 */
export function selectKeyFrames(
  frames: ExtractedFrame[],
  maxFrames: number = 5
): ExtractedFrame[] {
  if (frames.length <= maxFrames) {
    return frames;
  }

  // 简单策略：均匀选择
  const selected: ExtractedFrame[] = [];
  const step = Math.floor(frames.length / maxFrames);
  
  for (let i = 0; i < maxFrames; i++) {
    selected.push(frames[i * step]);
  }

  return selected;
}

/**
 * 删除提取的帧文件（清理）
 * @param frames 要删除的帧数组
 */
export function cleanupFrames(frames: ExtractedFrame[]): void {
  const { unlinkSync } = require('fs');
  
  frames.forEach(frame => {
    try {
      unlinkSync(frame.path);
    } catch (err) {
      console.error(`删除帧失败: ${frame.path}`, err);
    }
  });
}
