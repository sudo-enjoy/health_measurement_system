import { AssessmentData, RiskResult, Exercise } from '../types/assessment';

export function calculateRisk(data: AssessmentData): RiskResult {
  const results: RiskResult = {
    recommendations: [],
    exercises: [],
  };

  // Calculate Fall Risk
  if (data.fallRisk) {
    results.fallRisk = calculateFallRisk(data);
  }

  // Calculate Low Back Pain Risk
  if (data.lowBackPain) {
    results.lowBackPainRisk = calculateLowBackPainRisk(data);
  }

  // Generate recommendations and exercises
  results.recommendations = generateRecommendations(results);
  results.exercises = generateExercises(results);

  return results;
}

function calculateFallRisk(data: AssessmentData): 'low' | 'medium' | 'high' {
  let score = 0;
  const { questionnaire, physical } = data.fallRisk!;

  // Questionnaire scoring
  if (questionnaire.fallHistory) score += 2;
  if (questionnaire.balanceLoss) score += 2;
  if (questionnaire.fearOfFalling) score += 1;
  if (questionnaire.difficultyWalkingTalking) score += 1;
  if (questionnaire.stumblingWhenTired) score += 1;
  if (questionnaire.dangerousWorkplace) score += 1;

  // Physical tests scoring
  if (physical.oneLegStanding < 15) score += 2;
  else if (physical.oneLegStanding < 30) score += 1;

  const stepValue = physical.twoStepTest / (data.userInfo!.height * 100);
  if (stepValue < 1.3) score += 2;
  else if (stepValue < 1.5) score += 1;

  if (physical.fingerToFloor > 10) score += 1;
  if (physical.deepSquat === 'impossible') score += 2;
  else if (physical.deepSquat === 'heels-lifted') score += 1;

  if (physical.fourDirectionStep === '≥15s') score += 2;
  else if (physical.fourDirectionStep === '10-15s') score += 1;

  if (score >= 8) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

function calculateLowBackPainRisk(data: AssessmentData): 'low' | 'medium' | 'high' {
  let score = 0;
  const { physical, biopsychosocial } = data.lowBackPain!;

  // Physical tests scoring
  if (physical.forwardBending === 'none') score += 2;
  else if (physical.forwardBending === 'partial') score += 1;

  if (physical.squatDepth === 'none') score += 2;
  else if (physical.squatDepth === 'partial') score += 1;

  if (physical.plankChallenge < 30) score += 2;
  else if (physical.plankChallenge < 45) score += 1;

  if (physical.wallPostureHead === 'forward') score += 1;
  if (physical.wallPostureLumbar === 'excessive' || physical.wallPostureLumbar === 'flat') score += 1;

  // Biopsychosocial factors scoring
  const biologicalRisks = Object.values(biopsychosocial.biological).filter(v => !v).length;
  const psychologicalRisks = Object.values(biopsychosocial.psychological).filter(v => !v).length;
  const socialRisks = Object.values(biopsychosocial.social).filter(v => !v).length;

  score += Math.floor(biologicalRisks / 2);
  score += Math.floor(psychologicalRisks / 2);
  score += Math.floor(socialRisks / 2);

  if (score >= 8) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

function generateRecommendations(results: RiskResult): string[] {
  const recommendations: string[] = [];

  if (results.fallRisk === 'high') {
    recommendations.push('転倒リスクが高いため、バランス訓練と筋力強化を重点的に行ってください。');
    recommendations.push('職場環境の安全性を見直し、危険箇所の改善を検討してください。');
  } else if (results.fallRisk === 'medium') {
    recommendations.push('転倒リスクがやや高めです。定期的な運動でバランス能力を向上させましょう。');
  } else if (results.fallRisk === 'low') {
    recommendations.push('転倒リスクは低いですが、現在の運動習慣を継続してください。');
  }

  if (results.lowBackPainRisk === 'high') {
    recommendations.push('腰痛リスクが高いため、体幹強化と柔軟性向上に取り組んでください。');
    recommendations.push('作業姿勢の改善と定期的な休憩を心がけてください。');
  } else if (results.lowBackPainRisk === 'medium') {
    recommendations.push('腰痛リスクがやや高めです。予防的な運動を継続しましょう。');
  } else if (results.lowBackPainRisk === 'low') {
    recommendations.push('腰痛リスクは低いですが、良い姿勢と運動習慣を維持してください。');
  }

  return recommendations;
}

function generateExercises(results: RiskResult): Exercise[] {
  const exercises: Exercise[] = [];

  if (results.fallRisk && results.fallRisk !== 'low') {
    exercises.push({
      name: '片脚立位訓練',
      description: 'バランス能力を向上させる基本的な運動です',
      instructions: [
        '壁や手すりの近くで安全を確保してください',
        '片足で30秒間立ち続けることを目標にします',
        '左右の足で交互に実施してください',
        '毎日2-3セット実施しましょう'
      ],
      illustration: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg'
    });
  }

  if (results.lowBackPainRisk && results.lowBackPainRisk !== 'low') {
    exercises.push({
      name: 'プランク',
      description: '体幹の安定性を向上させる効果的な運動です',
      instructions: [
        'うつ伏せになり、肘とつま先で体を支えます',
        '頭からかかとまで一直線を保ちます',
        '30秒から1分間キープしましょう',
        '毎日2-3セット実施してください'
      ],
      illustration: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg'
    });
  }

  exercises.push({
    name: 'スクワット',
    description: '下肢筋力とバランスを同時に鍛える全身運動です',
    instructions: [
      '足を肩幅に開いて立ちます',
      'ゆっくりと腰を落とし、太ももが床と平行になるまで下げます',
      '膝がつま先より前に出ないよう注意します',
      '10-15回を2-3セット実施しましょう'
    ],
    illustration: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg'
  });

  return exercises;
}