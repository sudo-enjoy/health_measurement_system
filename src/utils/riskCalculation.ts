import { AssessmentData, RiskResult, FallRiskScores } from "../types/assessment";
import { exercises } from "./exerciseLibrary";

// Official Fall Risk Physical Test Scoring Functions
export function calculateTwoStepScore(value: number): number {
  if (value >= 1.66) return 90;
  if (value >= 1.47) return 70;
  if (value >= 1.39) return 60;
  if (value >= 1.25) return 40;
  return 20; // 1.24 or less
}

export function calculateSeatedSteppingScore(value: number): number {
  if (value >= 48) return 90;
  if (value >= 44) return 70;
  if (value >= 29) return 60;
  if (value >= 25) return 40;
  return 20; // 24 or less
}

export function calculateFunctionalReachScore(value: number): number {
  if (value >= 40) return 90;
  if (value >= 36) return 70;
  if (value >= 30) return 60;
  if (value >= 20) return 40;
  return 20; // 19 or less
}

export function calculateClosedEyeStandScore(value: number): number {
  if (value >= 90.1) return 90;
  if (value >= 55.1) return 70;
  if (value >= 17.1) return 60;
  if (value >= 7.1) return 40;
  return 20; // 7 or less
}

export function calculateOpenEyeStandScore(value: number): number {
  if (value >= 120.1) return 90;
  if (value >= 84.1) return 70;
  if (value >= 30.1) return 60;
  if (value >= 15.1) return 40;
  return 20; // 15 or less
}

// Official Lower Back Pain Test Scoring Functions
export function calculateStandingForwardBendScore(value: string): number {
  switch (value) {
    case "OK": return 90;
    case "点線まで": return 60;
    case "かたい": return 20;
    default: return 20;
  }
}

export function calculateHipFlexionScore(value: string): number {
  switch (value) {
    case "OK": return 90;
    case "点線まで": return 60;
    case "かたい": return 20;
    default: return 20;
  }
}

export function calculatePlankChallengeScore(value: number): number {
  if (value >= 90) return 90;
  if (value >= 60) return 80;
  if (value >= 45) return 60;
  if (value >= 30) return 40;
  return 20; // Less than 30 seconds
}

export function calculateWallPostureScore(headPosture: string, waistPosture: string): number {
  // Head posture combinations with waist posture
  if (headPosture === "頭は壁についており、視線はまっすぐだ" && waistPosture === "パーが入る（自然なカーブ）") return 90;
  if (headPosture === "頭は壁についており、視線はまっすぐだ" && waistPosture === "手は入らない（骨盤後傾）") return 80;
  if (headPosture === "頭は壁についており、視線はまっすぐだ" && waistPosture === "グーが入る（反り腰）") return 70;
  
  if (headPosture === "頭が前に出ている、猫背の姿勢" && waistPosture === "パーが入る（自然なカーブ）") return 50;
  if (headPosture === "頭が前に出ている、猫背の姿勢" && waistPosture === "手は入らない（骨盤後傾）") return 30;
  if (headPosture === "頭が前に出ている、猫背の姿勢" && waistPosture === "グーが入る（反り腰）") return 20;
  
  if (headPosture === "顎が上がっている" && waistPosture === "パーが入る（自然なカーブ）") return 60;
  if (headPosture === "顎が上がっている" && waistPosture === "手は入らない（骨盤後傾）") return 40;
  if (headPosture === "顎が上がっている" && waistPosture === "グーが入る（反り腰）") return 20;
  
  return 20; // Default fallback
}

// Official Risk Calculation Formulas
export function calculateFallRiskPercentage(scoreSum: number): number {
  // Formula: riskPercent = Math.round((1 - ((scoreSum - 100) / 350)) * 90 + 5)
  // Score range: 100-450 points (5 tests × 20-90 points each)
  const riskPercent = Math.round((1 - ((scoreSum - 100) / 350)) * 90 + 5);
  return Math.max(5, Math.min(95, riskPercent)); // Clamp between 5-95%
}

export function calculateBackPainRiskPercentage(scoreSum: number): number {
  // Formula: youtsuRisk = Math.round((1 - ((scoreSum - 100) / 260)) * 90 + 5)
  // Score range: 100-360 points (4 tests × 20-90 points each)
  const youtsuRisk = Math.round((1 - ((scoreSum - 100) / 260)) * 90 + 5);
  return Math.max(5, Math.min(95, youtsuRisk)); // Clamp between 5-95%
}

// Official Risk Classification
export function classifyRisk(riskPercentage: number): { level: "low" | "medium" | "high", comment: string } {
  if (riskPercentage <= 49) {
    return {
      level: "low",
      comment: "コンディションは良好、リスクはほとんどない。"
    };
  } else if (riskPercentage <= 79) {
    return {
      level: "medium",
      comment: "注意が必要な状態、改善が求められる。"
    };
  } else {
    return {
      level: "high",
      comment: "転倒の恐れ大、専門職の介入や対策が急務"
    };
  }
}

export function classifyBackPainRisk(riskPercentage: number): { level: "low" | "medium" | "high", comment: string } {
  if (riskPercentage <= 49) {
    return {
      level: "low",
      comment: "コンディションは良好。リスクはほとんどない。"
    };
  } else if (riskPercentage <= 79) {
    return {
      level: "medium",
      comment: "注意が必要な状態。改善が求められる。"
    };
  } else {
    return {
      level: "high",
      comment: "柔軟性や姿勢のリスクが高い。早急な対策が必要。"
    };
  }
}

// Calculate Fall Risk Scores for Radar Chart
export function calculateFallRiskScores(data: AssessmentData): FallRiskScores {
  const physical = data.fallRisk?.physical;
  const questionnaire = data.fallRisk?.questionnaire;
  
  if (!physical || !questionnaire) {
    throw new Error("Fall risk data is incomplete");
  }

  // Calculate physical test scores
  const twoStepScore = calculateTwoStepScore(physical.twoStepTest);
  const seatedSteppingScore = calculateSeatedSteppingScore(physical.seatedSteppingTest);
  const functionalReachScore = calculateFunctionalReachScore(physical.functionalReach);
  const closedEyeStandScore = calculateClosedEyeStandScore(physical.closedEyeStand);
  const openEyeStandScore = calculateOpenEyeStandScore(physical.openEyeStand);

  // Convert scores to 1-5 scale for radar chart
  const scoreToRating = (score: number): number => {
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 60) return 3;
    if (score >= 40) return 2;
    return 1;
  };

  // Calculate questionnaire scores (sum of grouped questions, converted to 1-5 scale)
  const calculateQuestionnaireScore = (questions: number[]): number => {
    const sum = questions.reduce((acc, val) => acc + val, 0);
    const maxPossible = questions.length * 5;
    const percentage = (sum / maxPossible) * 100;
    
    if (percentage >= 80) return 5;
    if (percentage >= 60) return 4;
    if (percentage >= 40) return 3;
    if (percentage >= 20) return 2;
    return 1;
  };

  return {
    physical: {
      walkingAbility: scoreToRating((twoStepScore + seatedSteppingScore) / 2),
      agility: scoreToRating((seatedSteppingScore + functionalReachScore) / 2),
      dynamicBalance: scoreToRating((functionalReachScore + twoStepScore) / 2),
      staticBalanceClosed: scoreToRating(closedEyeStandScore),
      staticBalanceOpen: scoreToRating(openEyeStandScore),
    },
    selfAssessment: {
      walkingAbility: calculateQuestionnaireScore([questionnaire.crowdWalking, questionnaire.physicalConfidence]),
      agility: calculateQuestionnaireScore([questionnaire.quickReaction, questionnaire.stepRecovery]),
      dynamicBalance: calculateQuestionnaireScore([questionnaire.sockWearing, questionnaire.heelToToe]),
      staticBalanceClosed: calculateQuestionnaireScore([questionnaire.closedEyeConfidence]),
      staticBalanceOpen: calculateQuestionnaireScore([questionnaire.trainStanding, questionnaire.openEyeConfidence]),
    }
  };
}

// Main Risk Calculation Function
export function calculateRisk(data: AssessmentData): RiskResult {
  const results: RiskResult = {
    recommendations: [],
    exercises: []
  };

  // Calculate Fall Risk
  if (data.fallRisk) {
    const physical = data.fallRisk.physical;
    const questionnaire = data.fallRisk.questionnaire;
    
    // Calculate physical test scores
    const twoStepScore = calculateTwoStepScore(physical.twoStepTest);
    const seatedSteppingScore = calculateSeatedSteppingScore(physical.seatedSteppingTest);
    const functionalReachScore = calculateFunctionalReachScore(physical.functionalReach);
    const closedEyeStandScore = calculateClosedEyeStandScore(physical.closedEyeStand);
    const openEyeStandScore = calculateOpenEyeStandScore(physical.openEyeStand);
    
    // Calculate total fall risk score
    const fallRiskScoreSum = twoStepScore + seatedSteppingScore + functionalReachScore + closedEyeStandScore + openEyeStandScore;
    const fallRiskPercentage = calculateFallRiskPercentage(fallRiskScoreSum);
    const fallRiskClassification = classifyRisk(fallRiskPercentage);
    
    results.fallRisk = fallRiskClassification.level;
    results.fallRiskPercentage = fallRiskPercentage;
    results.fallRiskComment = fallRiskClassification.comment;
    results.fallRiskScores = calculateFallRiskScores(data);
    
    // Add fall risk recommendations
    results.recommendations.push(`転倒リスク: ${fallRiskPercentage}% - ${fallRiskClassification.comment}`);
  }

  // Calculate Lower Back Pain Risk
  if (data.lowBackPain) {
    const physical = data.lowBackPain.physical;
    
    // Calculate physical test scores
    const standingForwardBendScore = calculateStandingForwardBendScore(physical.standingForwardBend);
    const hipFlexionScore = calculateHipFlexionScore(physical.hipFlexion);
    const plankChallengeScore = calculatePlankChallengeScore(physical.plankChallenge);
    const wallPostureScore = calculateWallPostureScore(physical.wallPostureHead, physical.wallPostureWaist);
    
    // Calculate total back pain risk score
    const backPainScoreSum = standingForwardBendScore + hipFlexionScore + plankChallengeScore + wallPostureScore;
    const backPainRiskPercentage = calculateBackPainRiskPercentage(backPainScoreSum);
    const backPainRiskClassification = classifyBackPainRisk(backPainRiskPercentage);
    
    results.lowBackPainRisk = backPainRiskClassification.level;
    results.lowBackPainRiskPercentage = backPainRiskPercentage;
    results.lowBackPainRiskComment = backPainRiskClassification.comment;
    
    // Add back pain risk recommendations
    results.recommendations.push(`腰痛リスク: ${backPainRiskPercentage}% - ${backPainRiskClassification.comment}`);
  }

  // Generate exercises based on risk levels
  results.exercises = generateExercises(results.fallRisk, results.lowBackPainRisk);

  return results;
}

// Generate exercises based on risk levels
function generateExercises(fallRisk?: "low" | "medium" | "high", lowBackPainRisk?: "low" | "medium" | "high") {
  const selectedExercises = [];
  
  // Determine exercise count based on risk levels
  let exerciseCount = 3; // Default for low risk
  if (fallRisk === "high" || lowBackPainRisk === "high") {
    exerciseCount = 8; // High risk gets more exercises
  } else if (fallRisk === "medium" || lowBackPainRisk === "medium") {
    exerciseCount = 5; // Medium risk gets moderate exercises
  }
  
  // Select exercises based on risk types
  if (fallRisk === "high") {
    // High fall risk - focus on balance and strength
    selectedExercises.push(
      exercises.balance.basicSingleLegStand,
      exercises.balance.closedEyeSingleLegStand,
      exercises.balance.dynamicSingleLegStand,
      exercises.core.sidePlank,
      exercises.core.birdDog,
      exercises.flexibility.hamstringStretch,
      exercises.flexibility.hipStretch,
      exercises.balance.tandemStand
    );
  } else if (lowBackPainRisk === "high") {
    // High back pain risk - focus on core and flexibility
    selectedExercises.push(
      exercises.core.basicPlank,
      exercises.core.sidePlank,
      exercises.core.birdDog,
      exercises.core.trunkRotation,
      exercises.flexibility.hamstringStretch,
      exercises.flexibility.hipStretch,
      exercises.balance.basicSingleLegStand,
      exercises.strength.wallSquat
    );
  } else {
    // General exercises for low/medium risk
    selectedExercises.push(
      exercises.balance.basicSingleLegStand,
      exercises.strength.basicSquat,
      exercises.core.basicPlank,
      exercises.flexibility.hamstringStretch
    );
  }
  
  return selectedExercises.slice(0, exerciseCount);
}
