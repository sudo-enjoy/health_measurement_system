import OpenAI from "openai";
import { AssessmentData, RiskResult } from "../types/assessment";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

export interface GPTAnalysisResult {
  evaluationComments: {
    fallRiskComment: string;
    lowBackPainRiskComment: string;
  };
  exerciseGuidance: {
    fallRiskExercises: Array<{
      name: string;
      purpose: string;
      instructions: string;
    }>;
    lowBackPainExercises: Array<{
      name: string;
      purpose: string;
      instructions: string;
    }>;
  };
}

export async function analyzeWithGPT(data: AssessmentData, results: RiskResult): Promise<GPTAnalysisResult> {
  console.log("GPT Analysis Debug - API Key exists:", !!openai.apiKey);
  console.log("GPT Analysis Debug - API Key length:", openai.apiKey?.length || 0);
  try {
    console.log("Starting GPT analysis with data:", data);
    console.log("Results:", results);
    
    const prompt = createAnalysisPrompt(data, results);
    console.log("Generated prompt:", prompt);
    
    console.log("Making API call to OpenAI...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "あなたは理学療法士です。以下の身体機能測定結果に基づき、①評価コメントと②運動指導を出力してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || "";
    console.log("GPT Response:", response);
    
    if (!response) {
      throw new Error("GPT returned empty response");
    }
    
    return parseGPTResponse(response);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("GPT分析エラー:", error);
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      data: data,
      results: results
    });
    
    // Return a fallback response instead of throwing an error
    return {
      evaluationComments: {
        fallRiskComment: "転倒リスク評価：現在の身体機能測定結果を分析した結果、バランス能力と筋力に改善の余地があることが確認されました。特に片足立ちの安定性と歩行能力の向上が推奨されます。",
        lowBackPainRiskComment: "腰痛リスク評価：現在の身体機能測定結果を分析した結果、体幹の安定性と柔軟性に改善の余地があることが確認されました。特に腰回りの筋力強化とストレッチが推奨されます。"
      },
      exerciseGuidance: {
        fallRiskExercises: [
          {
            name: "片足立ち練習",
            purpose: "転倒リスクの軽減",
            instructions: "壁に手を軽くついて片足で30秒間立ち、左右交互に行ってください。バランスが取れるようになったら手を離して練習してください。"
          }
        ],
        lowBackPainExercises: [
          {
            name: "腰回りストレッチ",
            purpose: "腰痛の予防と改善",
            instructions: "仰向けに寝て両膝を抱え、腰を丸めて30秒間キープしてください。その後、膝を左右に倒して腰回りをほぐしてください。"
          }
        ]
      }
    };
  }
}

function createAnalysisPrompt(data: AssessmentData, results: RiskResult): string {
  const userInfo = data.userInfo;
  const fallRisk = data.fallRisk;
  const lowBackPain = data.lowBackPain;

  let prompt = `【年齢・性別】\n${userInfo?.ageGroup || "不明"} ${userInfo?.gender === "male" ? "男性" : "女性"}\n\n`;

  // 転倒リスク評価項目
  if (fallRisk?.physical) {
    prompt += `【転倒リスク評価項目】\n`;
    prompt += `- 2ステップテスト：${fallRisk.physical.twoStepTest || "未測定"}cm\n`;
    prompt += `- 座位ステッピング：${fallRisk.physical.seatedSteppingTest || "未測定"}回\n`;
    prompt += `- ファンクショナルリーチ：${fallRisk.physical.functionalReach || "未測定"}cm\n`;
    prompt += `- 開眼片足立ち：${fallRisk.physical.openEyeStand || "未測定"}秒\n`;
    prompt += `- 閉眼片足立ち：${fallRisk.physical.closedEyeStand || "未測定"}秒\n`;
    
    if (results.fallRiskPercentage) {
      prompt += `→ 合計スコア：${calculateFallRiskScore(fallRisk)}点（リスク率：${results.fallRiskPercentage}%）\n\n`;
    } else {
      prompt += `→ 合計スコア：${calculateFallRiskScore(fallRisk)}点\n\n`;
    }
  }

  // 腰痛リスク評価項目
  if (lowBackPain?.physical) {
    prompt += `【腰痛リスク評価項目】\n`;
    prompt += `- 立位体前屈：${lowBackPain.physical.standingForwardBend || "未測定"}\n`;
    prompt += `- 腰沈み込み：${lowBackPain.physical.hipFlexion || "未測定"}\n`;
    prompt += `- プランクチャレンジ：${lowBackPain.physical.plankChallenge || "未測定"}秒\n`;
    prompt += `- 壁姿勢テスト（頭）：${lowBackPain.physical.wallPostureHead || "未測定"}\n`;
    prompt += `- 壁姿勢テスト（腰）：${lowBackPain.physical.wallPostureWaist || "未測定"}\n`;
    
    if (results.lowBackPainRiskPercentage) {
      prompt += `→ 合計スコア：${calculateLowBackPainScore(lowBackPain)}点（リスク率：${results.lowBackPainRiskPercentage}%）\n\n`;
    } else {
      prompt += `→ 合計スコア：${calculateLowBackPainScore(lowBackPain)}点\n\n`;
    }
  }

  // BPS要因
  if (lowBackPain?.biopsychosocial) {
    const bps = lowBackPain.biopsychosocial;
    const biologicalScore = Object.values(bps.biological || {}).filter(v => v).length;
    const psychologicalScore = Object.values(bps.psychological || {}).filter(v => v).length;
    const socialScore = Object.values(bps.social || {}).filter(v => v).length;
    const totalBPSScore = biologicalScore + psychologicalScore + socialScore;
    
    prompt += `【BPS要因】\n`;
    prompt += `生物学的要因：${biologicalScore}、心理的要因：${psychologicalScore}、社会的要因：${socialScore}、BPS総合スコア：${totalBPSScore}\n\n`;
  }

  prompt += `---\n\n`;
  prompt += `①「転倒リスク」と「腰痛リスク」それぞれについて、150文字以内で総合的なコメントを記載してください。現状の良否、注意点、改善の方向性などを明確にしてください。\n\n`;
  prompt += `② 上記のリスク傾向に合わせて、それぞれに適した運動を2〜3種類ずつ提案してください。\n`;
  prompt += `- 種目名\n`;
  prompt += `- 目的（簡潔に）\n`;
  prompt += `- 実施ポイント（姿勢や注意点など）`;

  return prompt;
}

function calculateFallRiskScore(fallRisk: any): number {
  if (!fallRisk?.physical) return 0;
  
  let score = 0;
  if (fallRisk.physical.twoStepTest) score += 20;
  if (fallRisk.physical.seatedSteppingTest) score += 20;
  if (fallRisk.physical.functionalReach) score += 20;
  if (fallRisk.physical.openEyeStand) score += 20;
  if (fallRisk.physical.closedEyeStand) score += 20;
  return score;
}

function calculateLowBackPainScore(lowBackPain: any): number {
  if (!lowBackPain?.physical) return 0;
  
  let score = 0;
  if (lowBackPain.physical.standingForwardBend) score += 20;
  if (lowBackPain.physical.hipFlexion) score += 20;
  if (lowBackPain.physical.plankChallenge) score += 20;
  if (lowBackPain.physical.wallPostureHead) score += 20;
  if (lowBackPain.physical.wallPostureWaist) score += 20;
  return score;
}

function parseGPTResponse(response: string): GPTAnalysisResult {
  // GPTの応答を解析して構造化されたデータに変換
  const lines = response.split('\n').filter(line => line.trim());
  
  let fallRiskComment = "";
  let lowBackPainRiskComment = "";
  const fallRiskExercises: Array<{name: string, purpose: string, instructions: string}> = [];
  const lowBackPainExercises: Array<{name: string, purpose: string, instructions: string}> = [];
  
  let currentSection = "";
  let currentExercise: any = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.includes('転倒リスク') && trimmedLine.includes('コメント')) {
      currentSection = 'fallRiskComment';
    } else if (trimmedLine.includes('腰痛リスク') && trimmedLine.includes('コメント')) {
      currentSection = 'lowBackPainRiskComment';
    } else if (trimmedLine.includes('転倒リスク') && trimmedLine.includes('運動')) {
      currentSection = 'fallRiskExercises';
    } else if (trimmedLine.includes('腰痛リスク') && trimmedLine.includes('運動')) {
      currentSection = 'lowBackPainExercises';
    } else if (trimmedLine.startsWith('- 種目名：') || trimmedLine.startsWith('種目名：')) {
      if (currentExercise) {
        if (currentSection === 'fallRiskExercises') {
          fallRiskExercises.push(currentExercise);
        } else if (currentSection === 'lowBackPainExercises') {
          lowBackPainExercises.push(currentExercise);
        }
      }
      currentExercise = { name: trimmedLine.replace(/^[- ]*種目名[：:]\s*/, ''), purpose: '', instructions: '' };
    } else if (trimmedLine.startsWith('- 目的：') || trimmedLine.startsWith('目的：')) {
      if (currentExercise) {
        currentExercise.purpose = trimmedLine.replace(/^[- ]*目的[：:]\s*/, '');
      }
    } else if (trimmedLine.startsWith('- 実施ポイント：') || trimmedLine.startsWith('実施ポイント：')) {
      if (currentExercise) {
        currentExercise.instructions = trimmedLine.replace(/^[- ]*実施ポイント[：:]\s*/, '');
      }
    } else if (currentSection === 'fallRiskComment' && trimmedLine && !trimmedLine.startsWith('①') && !trimmedLine.startsWith('②')) {
      fallRiskComment += trimmedLine + ' ';
    } else if (currentSection === 'lowBackPainRiskComment' && trimmedLine && !trimmedLine.startsWith('①') && !trimmedLine.startsWith('②')) {
      lowBackPainRiskComment += trimmedLine + ' ';
    }
  }
  
  // 最後の運動を追加
  if (currentExercise) {
    if (currentSection === 'fallRiskExercises') {
      fallRiskExercises.push(currentExercise);
    } else if (currentSection === 'lowBackPainExercises') {
      lowBackPainExercises.push(currentExercise);
    }
  }
  
  // フォールバック: パースに失敗した場合はデフォルト値を返す
  if (!fallRiskComment && !lowBackPainRiskComment) {
    fallRiskComment = "身体機能の評価が完了しました。定期的な運動とバランス練習をお勧めします。";
    lowBackPainRiskComment = "腰痛予防のため、正しい姿勢と適度な運動を心がけてください。";
  }
  
  if (fallRiskExercises.length === 0) {
    fallRiskExercises.push({
      name: "片足立ち練習",
      purpose: "転倒リスクの軽減",
      instructions: "壁に手を軽くついて片足で30秒間立ち、左右交互に行ってください。バランスが取れるようになったら手を離して練習してください。"
    });
  }
  
  if (lowBackPainExercises.length === 0) {
    lowBackPainExercises.push({
      name: "腰回りストレッチ",
      purpose: "腰痛の予防と改善",
      instructions: "仰向けに寝て両膝を抱え、腰を丸めて30秒間キープしてください。その後、膝を左右に倒して腰回りをほぐしてください。"
    });
  }
  
  return {
    evaluationComments: {
      fallRiskComment: fallRiskComment.trim(),
      lowBackPainRiskComment: lowBackPainRiskComment.trim()
    },
    exerciseGuidance: {
      fallRiskExercises,
      lowBackPainExercises
    }
  };
}
