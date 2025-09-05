import jsPDF from "jspdf";
import { AssessmentData, RiskResult } from "../types/assessment";
import { GPTAnalysisResult } from "./gptAnalysis";

export async function generatePDF(data: AssessmentData, results: RiskResult, gptAnalysis?: GPTAnalysisResult | null): Promise<void> {
  const pdf = new jsPDF("p", "mm", "a4");
  
  // Title
  pdf.setFontSize(20);
  pdf.text("健康リスク評価レポート", 105, 20, { align: "center" });
  
  // Subtitle with AI analysis indicator
  if (gptAnalysis) {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 100, 200);
    pdf.text("AI詳細分析付き", 105, 30, { align: "center" });
    pdf.setTextColor(0, 0, 0);
  }
  
  // User Information
  pdf.setFontSize(14);
  pdf.text("基本情報", 20, 45);
  pdf.setFontSize(12);
  pdf.text(`性別: ${data.userInfo!.gender === "male" ? "男性" : "女性"}`, 20, 55);
  pdf.text(`年齢層: ${data.userInfo!.ageGroup}`, 20, 65);
  pdf.text(`身長: ${data.userInfo!.height}m`, 20, 75);
  
  let yPos = 90;
  
  // Risk Assessment Summary
  pdf.setFontSize(14);
  pdf.text("リスク評価サマリー", 20, yPos);
  yPos += 10;
  pdf.setFontSize(12);
  
  if (gptAnalysis) {
    // AI Enhanced Risk Assessment
    const fallRiskText = gptAnalysis.riskAssessment.fallRisk === "high" ? "高リスク" : 
                        gptAnalysis.riskAssessment.fallRisk === "medium" ? "中リスク" : "低リスク";
    const backPainText = gptAnalysis.riskAssessment.lowBackPainRisk === "high" ? "高リスク" : 
                        gptAnalysis.riskAssessment.lowBackPainRisk === "medium" ? "中リスク" : "低リスク";
    const overallText = gptAnalysis.riskAssessment.overallRisk === "high" ? "高リスク" : 
                       gptAnalysis.riskAssessment.overallRisk === "medium" ? "中リスク" : "低リスク";
    
    pdf.text(`転倒リスク（AI分析）: ${fallRiskText}`, 20, yPos);
    yPos += 8;
    pdf.text(`腰痛リスク（AI分析）: ${backPainText}`, 20, yPos);
    yPos += 8;
    pdf.text(`総合リスク: ${overallText}`, 20, yPos);
    yPos += 15;
  } else {
    // Basic Risk Assessment
    if (results.fallRisk) {
      const fallRiskText = results.fallRisk === "high" ? "高リスク" : 
                          results.fallRisk === "medium" ? "中リスク" : "低リスク";
      pdf.text(`転倒リスク: ${fallRiskText}`, 20, yPos);
      yPos += 8;
    }
    
    if (results.lowBackPainRisk) {
      const backPainText = results.lowBackPainRisk === "high" ? "高リスク" : 
                          results.lowBackPainRisk === "medium" ? "中リスク" : "低リスク";
      pdf.text(`腰痛リスク: ${backPainText}`, 20, yPos);
      yPos += 8;
    }
    yPos += 7;
  }
  
  // Detailed Analysis (GPT only)
  if (gptAnalysis) {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    pdf.setFontSize(14);
    pdf.text("詳細分析", 20, yPos);
    yPos += 10;
    pdf.setFontSize(10);
    
    // Strengths
    pdf.setFontSize(12);
    pdf.text("強み", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.detailedAnalysis.strengths.forEach((strength) => {
      const lines = pdf.splitTextToSize(`• ${strength}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    // Concerns
    pdf.setFontSize(12);
    pdf.text("懸念点", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.detailedAnalysis.concerns.forEach((concern) => {
      const lines = pdf.splitTextToSize(`• ${concern}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    // Key Findings
    pdf.setFontSize(12);
    pdf.text("重要な発見", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.detailedAnalysis.keyFindings.forEach((finding) => {
      const lines = pdf.splitTextToSize(`• ${finding}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 10;
  }
  
  // Recommendations
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }
  
  pdf.setFontSize(14);
  pdf.text("推奨事項", 20, yPos);
  yPos += 10;
  pdf.setFontSize(10);
  
  if (gptAnalysis) {
    // AI Personalized Recommendations
    pdf.setFontSize(12);
    pdf.text("即座に実行すべき事項", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.personalizedRecommendations.immediate.forEach((rec) => {
      const lines = pdf.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("短期間で実行すべき事項", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.personalizedRecommendations.shortTerm.forEach((rec) => {
      const lines = pdf.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("長期間で実行すべき事項", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.personalizedRecommendations.longTerm.forEach((rec) => {
      const lines = pdf.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
  } else {
    // Basic Recommendations
    results.recommendations.forEach((rec) => {
      const lines = pdf.splitTextToSize(`• ${rec}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 20, yPos);
        yPos += 5;
      });
      yPos += 3;
    });
  }
  
  // Exercise Plan
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }
  
  yPos += 10;
  pdf.setFontSize(14);
  pdf.text("エクササイズプラン", 20, yPos);
  yPos += 10;
  
  if (gptAnalysis) {
    // AI Exercise Plan
    pdf.setFontSize(12);
    pdf.text("毎日のエクササイズ", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.exercisePlan.daily.forEach((exercise) => {
      const lines = pdf.splitTextToSize(`• ${exercise}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("週次のエクササイズ", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.exercisePlan.weekly.forEach((exercise) => {
      const lines = pdf.splitTextToSize(`• ${exercise}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    if (gptAnalysis.exercisePlan.precautions.length > 0) {
      pdf.setFontSize(12);
      pdf.text("注意事項", 20, yPos);
      yPos += 8;
      pdf.setFontSize(10);
      gptAnalysis.exercisePlan.precautions.forEach((precaution) => {
        const lines = pdf.splitTextToSize(`• ${precaution}`, 170);
        lines.forEach((line: string) => {
          pdf.text(line, 25, yPos);
          yPos += 5;
        });
      });
    }
  } else {
    // Basic Exercises
    results.exercises.forEach((exercise, index) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${exercise.name}`, 20, yPos);
      yPos += 8;
      
      pdf.setFontSize(10);
      const descLines = pdf.splitTextToSize(exercise.description, 170);
      descLines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
      
      exercise.instructions.forEach((instruction, instrIndex) => {
        const instrLines = pdf.splitTextToSize(`${instrIndex + 1}. ${instruction}`, 165);
        instrLines.forEach((line: string) => {
          pdf.text(line, 30, yPos);
          yPos += 5;
        });
      });
      yPos += 10;
    });
  }
  
  // Lifestyle Modifications (GPT only)
  if (gptAnalysis) {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text("ライフスタイル改善提案", 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.text("職場での改善", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.lifestyleModifications.workplace.forEach((mod) => {
      const lines = pdf.splitTextToSize(`• ${mod}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("日常生活での改善", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.lifestyleModifications.daily.forEach((mod) => {
      const lines = pdf.splitTextToSize(`• ${mod}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("予防策", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.lifestyleModifications.preventive.forEach((mod) => {
      const lines = pdf.splitTextToSize(`• ${mod}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
  }
  
  // Follow-up Schedule (GPT only)
  if (gptAnalysis) {
    if (yPos > 250) {
      pdf.addPage();
      yPos = 20;
    }
    
    yPos += 10;
    pdf.setFontSize(14);
    pdf.text("フォローアップ計画", 20, yPos);
    yPos += 10;
    
    pdf.setFontSize(12);
    pdf.text("次回評価", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    const nextAssessmentLines = pdf.splitTextToSize(gptAnalysis.followUpSchedule.nextAssessment, 170);
    nextAssessmentLines.forEach((line: string) => {
      pdf.text(line, 25, yPos);
      yPos += 5;
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("マイルストーン", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.followUpSchedule.milestones.forEach((milestone) => {
      const lines = pdf.splitTextToSize(`• ${milestone}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
    yPos += 5;
    
    pdf.setFontSize(12);
    pdf.text("注意すべき症状", 20, yPos);
    yPos += 8;
    pdf.setFontSize(10);
    gptAnalysis.followUpSchedule.warningSigns.forEach((sign) => {
      const lines = pdf.splitTextToSize(`• ${sign}`, 170);
      lines.forEach((line: string) => {
        pdf.text(line, 25, yPos);
        yPos += 5;
      });
    });
  }
  
  // Add timestamp
  pdf.setFontSize(8);
  pdf.text(`生成日時: ${new Date().toLocaleDateString("ja-JP")} ${new Date().toLocaleTimeString("ja-JP")}`, 20, 285);
  
  // Save PDF
  const filename = gptAnalysis ? "AI健康リスク評価レポート.pdf" : "健康リスク評価レポート.pdf";
  pdf.save(filename);
}
