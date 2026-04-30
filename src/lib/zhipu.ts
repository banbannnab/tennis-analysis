// 智谱 AI API 调用函数
// 文档：https://open.bigmodel.cn/dev/api/interface-center

interface ZhipuMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ZhipuResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    role: string;
    content: string;
  }>;
}

export async function callZhipuAPI(prompt: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    throw new Error('智谱 API 密钥未配置');
  }

  // 智谱 AI API 端点
  const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  // 构建请求体
  const messages: ZhipuMessage[] = [
    {
      role: 'system',
      content: '你是专业网球教练，擅长分析网球动作并提供改进建议。你的回答应该专业、具体、可操作。'
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  const requestBody = {
    model: 'glm-4', // 使用 GLM-4 模型
    messages: messages,
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 1000,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`智谱 API 调用失败: ${response.status} ${errorData.message || ''}`);
    }

    const data: ZhipuResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('智谱 API 返回空结果');
    }

    return data.choices[0].content;
  } catch (error) {
    console.error('智谱 API 调用错误:', error);
    throw error;
  }
}

// 生成网球动作分析建议
export async function generateTennisSuggestions(analysisData: {
  actionType: string;
  score: number;
  issues: Array<{ type: string; description: string; severity: string }>;
  comparisons: Array<{ label: string; actualValue: number; idealValue: number; unit: string }>;
}): Promise<string[]> {
  // 构建提示词 - 更详细的专业训练建议
  const prompt = `
作为专业网球教练，请分析以下网球动作数据，并给出详细、专业的改进建议和训练方案。

## 动作数据
- 动作类型：${getActionTypeChinese(analysisData.actionType)}
- 动作评分：${analysisData.score}/100
- 发现问题：
${analysisData.issues.map(issue => `  - ${issue.description}（严重程度：${getSeverityChinese(issue.severity)}）`).join('\n')}

## 量化对比
${analysisData.comparisons.map(comp => `  - ${comp.label}：实际值 ${comp.actualValue}${comp.unit}，理想值 ${comp.idealValue}${comp.unit}，差距 ${comp.actualValue > comp.idealValue ? '+' : ''}${comp.actualValue - comp.idealValue}${comp.unit}`).join('\n')}

## 要求
请针对每个问题，提供详细的改进建议和训练方案，格式如下：

1. **问题定位**：简要说明问题所在
2. **改进方法**：具体的训练动作和练习方法
3. **训练计划**：
   - 动作名称：xxx
   - 训练量：x组，每组x次
   - 训练频率：每周x次
   - 注意事项：xxx
4. **常见错误**：练习时容易犯的错误及纠正方法
5. **进阶建议**：掌握后如何增加难度

## 示例输出
**问题：肘部角度过大（120°，标准90°）**

改进方法：肘部贴合训练

训练计划：
- 动作：墙壁肘部贴合练习
- 训练量：3组，每组15次，每次保持5秒
- 训练频率：每周3-4次
- 注意事项：保持肩部放松，不要耸肩

常见错误：
- 错误1：肘部过度外翻 → 纠正：贴墙练习，感受正确角度
- 错误2：手腕弯曲 → 纠正：保持手腕与前臂一条直线

进阶建议：
- 阶段1：静态贴墙练习（1周）
- 阶段2：动态空挥练习（1周）
- 阶段3：结合击球练习（持续）

## 输出要求
1. 针对每个主要问题，提供一套完整训练方案
2. 语言专业但易懂，适合业余爱好者
3. 使用中文回答
4. 每条建议详细具体，可操作性强
5. 返回3-5条详细建议
  `.trim();

  try {
    const suggestionText = await callZhipuAPI(prompt);
    
    // 将返回的文本分割成多条建议
    const suggestions = suggestionText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 5); // 最多返回 5 条建议

    return suggestions.length > 0 ? suggestions : [
      '继续保持当前动作',
      '注意动作连贯性',
      '加强核心力量训练'
    ];
  } catch (error) {
    console.error('生成建议失败，使用默认建议:', error);
    // 返回默认建议
    return [
      '调整姿势，保持平衡',
      '注意击球时机',
      '加强专项力量训练'
    ];
  }
}

// 辅助函数：获取动作类型中文名称
function getActionTypeChinese(actionType: string): string {
  const typeMap: Record<string, string> = {
    'forehand': '正手击球',
    'backhand': '反手击球',
    'serve': '发球',
    'volley': '截击',
    'smash': '扣杀',
    'follow_through': '随挥动作',
  };
  return typeMap[actionType] || actionType;
}

// 辅助函数：获取严重程度中文
function getSeverityChinese(severity: string): string {
  const severityMap: Record<string, string> = {
    'high': '高',
    'medium': '中',
    'low': '低',
  };
  return severityMap[severity] || severity;
}
