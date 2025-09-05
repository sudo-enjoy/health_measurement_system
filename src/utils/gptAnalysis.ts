import OpenAI from "openai";
import { AssessmentData, RiskResult } from "../types/assessment";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export interface GPTAnalysisResult {
  riskAssessment: {
    fallRisk: "low" | "medium" | "high";
    lowBackPainRisk: "low" | "medium" | "high";
    overallRisk: "low" | "medium" | "high";
  };
  detailedAnalysis: {
    strengths: string[];
    concerns: string[];
    keyFindings: string[];
  };
  personalizedRecommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  exercisePlan: {
    daily: string[];
    weekly: string[];
    precautions: string[];
  };
  lifestyleModifications: {
    workplace: string[];
    daily: string[];
    preventive: string[];
  };
  followUpSchedule: {
    nextAssessment: string;
    milestones: string[];
    warningSigns: string[];
  };
}

export async function analyzeWithGPT(data: AssessmentData, basicResults: RiskResult): Promise<GPTAnalysisResult> {
  try {
    const prompt = createAnalysisPrompt(data, basicResults);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional occupational health specialist and physical therapist with expertise in fall risk assessment and low back pain prevention. Provide detailed, evidence-based analysis in Japanese."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response from GPT-4o");
    }

    return parseGPTResponse(response);
  } catch (error) {
    console.error("GPT Analysis Error:", error);
    throw new Error("AI分析中にエラーが発生しました。しばらくしてから再試行してください。");
  }
}

function createAnalysisPrompt(data: AssessmentData, basicResults: RiskResult): string {
  const userInfo = data.userInfo;
  const fallRisk = data.fallRisk;
  const lowBackPain = data.lowBackPain;

  return `以下の健康リスク評価データを分析し、包括的な健康管理プランを作成してください。

【基本情報】
- 性別: ${userInfo.gender === "male" ? "男性" : "女性"}
- 年齢層: ${userInfo.ageGroup}
- 身長: ${userInfo.height}m

【転倒リスク評価】
${fallRisk ? `質問票結果:
- 過去1年間の転倒歴: ${fallRisk.questionnaire.fallHistory ? "あり" : "なし"}
- バランス喪失経験: ${fallRisk.questionnaire.balanceLoss ? "あり" : "なし"}
- 転倒への不安: ${fallRisk.questionnaire.fearOfFalling ? "あり" : "なし"}
- 歩行時の会話困難: ${fallRisk.questionnaire.difficultyWalkingTalking ? "あり" : "なし"}
- 疲労時のつまずき: ${fallRisk.questionnaire.stumblingWhenTired ? "あり" : "なし"}
- 危険な職場環境: ${fallRisk.questionnaire.dangerousWorkplace ? "あり" : "なし"}

身体機能テスト:
- 片脚立位: ${fallRisk.physical.oneLegStanding}秒
- 2ステップテスト: ${fallRisk.physical.twoStepTest}cm
- ファンクショナルリーチ: ${fallRisk.physical.fingerToFloor}cm
- 閉眼片足立ち: ${fallRisk.physical.closeEyeStand}秒
- 開眼片足立ち: ${fallRisk.physical.openEyeStand}秒
- ディープスクワット: ${fallRisk.physical.deepSquat}
- 4方向ステップ: ${fallRisk.physical.fourDirectionStep}

基本リスク評価: ${basicResults.fallRisk || "未評価"}` : "転倒リスク評価は実施されていません。"}

【腰痛リスク評価】
${lowBackPain ? `身体機能テスト:
- 前屈動作: ${lowBackPain.physical.forwardBending}
- スクワット深度: ${lowBackPain.physical.squatDepth}
- プランクチャレンジ: ${lowBackPain.physical.plankChallenge}秒
- 壁姿勢（頭部）: ${lowBackPain.physical.wallPostureHead}
- 壁姿勢（腰椎）: ${lowBackPain.physical.wallPostureLumbar}

生物心理社会的要因:
- 生物学的要因: ${Object.values(lowBackPain.biopsychosocial.biological).filter(v => v).length}/10項目が良好
- 心理的要因: ${Object.values(lowBackPain.biopsychosocial.psychological).filter(v => v).length}/5項目が良好
- 社会的要因: ${Object.values(lowBackPain.biopsychosocial.social).filter(v => v).length}/5項目が良好

基本リスク評価: ${basicResults.lowBackPainRisk || "未評価"}` : "腰痛リスク評価は実施されていません。"}

以下の形式でJSONレスポンスを提供してください：

{
  "riskAssessment": {
    "fallRisk": "low|medium|high",
    "lowBackPainRisk": "low|medium|high", 
    "overallRisk": "low|medium|high"
  },
  "detailedAnalysis": {
    "strengths": ["強み1", "強み2", "強み3"],
    "concerns": ["懸念点1", "懸念点2", "懸念点3"],
    "keyFindings": ["重要な発見1", "重要な発見2", "重要な発見3"]
  },
  "personalizedRecommendations": {
    "immediate": ["即座に実行すべき推奨事項1", "即座に実行すべき推奨事項2"],
    "shortTerm": ["短期間で実行すべき推奨事項1", "短期間で実行すべき推奨事項2"],
    "longTerm": ["長期間で実行すべき推奨事項1", "長期間で実行すべき推奨事項2"]
  },
  "exercisePlan": {
    "daily": ["毎日のエクササイズ1", "毎日のエクササイズ2"],
    "weekly": ["週次のエクササイズ1", "週次のエクササイズ2"],
    "precautions": ["注意事項1", "注意事項2"]
  },
  "lifestyleModifications": {
    "workplace": ["職場での改善点1", "職場での改善点2"],
    "daily": ["日常生活での改善点1", "日常生活での改善点2"],
    "preventive": ["予防策1", "予防策2"]
  },
  "followUpSchedule": {
    "nextAssessment": "次回評価までの期間",
    "milestones": ["マイルストーン1", "マイルストーン2"],
    "warningSigns": ["注意すべき症状1", "注意すべき症状2"]
  }
}`;
}

function parseGPTResponse(response: string): GPTAnalysisResult {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    const requiredFields = [
      "riskAssessment", "detailedAnalysis", "personalizedRecommendations",
      "exercisePlan", "lifestyleModifications", "followUpSchedule"
    ];
    
    for (const field of requiredFields) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return parsed as GPTAnalysisResult;
  } catch (error) {
    console.error("Failed to parse GPT response:", error);
    throw new Error("AI分析結果の解析に失敗しました。");
  }
}
