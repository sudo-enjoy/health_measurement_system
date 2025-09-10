import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AssessmentData, RiskResult } from "../types/assessment";
import { GPTAnalysisResult } from "./gptAnalysis";

export async function generatePDF(data: AssessmentData, results: RiskResult, gptAnalysis?: GPTAnalysisResult | null): Promise<void> {
  try {
    // Create a temporary HTML element to render the report with proper Japanese font support
    const reportElement = createReportHTML(data, results, gptAnalysis);
    document.body.appendChild(reportElement);
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    // Convert HTML to canvas with higher resolution and proper font rendering
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: reportElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in the cloned document
        const clonedElement = clonedDoc.querySelector('.pdf-report');
        if (clonedElement) {
          clonedElement.style.fontFamily = "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif";
        }
      }
    });
    
    // Create PDF from canvas with proper page handling
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm (297 - 2mm margin)
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    // Add pages with proper content distribution
    for (let i = 0; i < totalPages; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      const yOffset = -(i * pageHeight);
      const currentPageHeight = Math.min(pageHeight, imgHeight - (i * pageHeight));
      
      pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
    }
    
    // Save PDF
    const filename = gptAnalysis ? "AI健康リスク評価レポート.pdf" : "健康リスク評価レポート.pdf";
    pdf.save(filename);
    
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("PDFの生成に失敗しました。ブラウザの設定を確認してください。");
  } finally {
    // Clean up
    const reportElement = document.querySelector('.pdf-report');
    if (reportElement) {
      document.body.removeChild(reportElement);
    }
  }
}

function createReportHTML(data: AssessmentData, results: RiskResult, gptAnalysis?: GPTAnalysisResult | null): HTMLElement {
  const reportDiv = document.createElement('div');
  reportDiv.className = 'pdf-report';
  reportDiv.style.cssText = `
    width: 794px;
    min-height: auto;
    padding: 40px;
    font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
    background: white;
    color: black;
    line-height: 1.6;
    position: absolute;
    top: -9999px;
    left: -9999px;
    overflow: visible;
    font-size: 14px;
  `;
  
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; color: #333;">健康リスク評価レポート</h1>
      ${gptAnalysis ? '<p style="color: #0066cc; font-size: 14px; font-weight: bold;">AI詳細分析付き</p>' : ''}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">基本情報</h2>
      <p style="margin: 5px 0;"><strong>性別:</strong> ${data.userInfo!.gender === "male" ? "男性" : "女性"}</p>
      <p style="margin: 5px 0;"><strong>年齢層:</strong> ${data.userInfo!.ageGroup}</p>
      <p style="margin: 5px 0;"><strong>身長:</strong> ${data.userInfo!.height}m</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">リスク評価サマリー</h2>
  `;
  
  if (gptAnalysis) {
    const fallRiskText = results.fallRisk === "high" ? "高リスク" : 
                        results.fallRisk === "medium" ? "中リスク" : "低リスク";
    const backPainText = results.lowBackPainRisk === "high" ? "高リスク" : 
                        results.lowBackPainRisk === "medium" ? "中リスク" : "低リスク";
    
    html += `
      <p style="margin: 5px 0;"><strong>転倒リスク（AI分析）:</strong> <span style="color: ${getRiskColor(results.fallRisk)}; font-weight: bold;">${fallRiskText}</span></p>
      <p style="margin: 5px 0;"><strong>腰痛リスク（AI分析）:</strong> <span style="color: ${getRiskColor(results.lowBackPainRisk)}; font-weight: bold;">${backPainText}</span></p>
    `;
  } else {
    if (results.fallRisk) {
      const fallRiskText = results.fallRisk === "high" ? "高リスク" : 
                          results.fallRisk === "medium" ? "中リスク" : "低リスク";
      html += `<p style="margin: 5px 0;"><strong>転倒リスク:</strong> <span style="color: ${getRiskColor(results.fallRisk)}; font-weight: bold;">${fallRiskText}`;
      if (results.fallRiskPercentage) {
        html += ` (${results.fallRiskPercentage}%)`;
      }
      html += `</span></p>`;
      if (results.fallRiskComment) {
        html += `<p style="margin: 5px 0; color: #666; font-size: 13px; padding-left: 20px;">${results.fallRiskComment}</p>`;
      }
    }
    
    if (results.lowBackPainRisk) {
      const backPainText = results.lowBackPainRisk === "high" ? "高リスク" : 
                          results.lowBackPainRisk === "medium" ? "中リスク" : "低リスク";
      html += `<p style="margin: 5px 0;"><strong>腰痛リスク:</strong> <span style="color: ${getRiskColor(results.lowBackPainRisk)}; font-weight: bold;">${backPainText}`;
      if (results.lowBackPainRiskPercentage) {
        html += ` (${results.lowBackPainRiskPercentage}%)`;
      }
      html += `</span></p>`;
      if (results.lowBackPainRiskComment) {
        html += `<p style="margin: 5px 0; color: #666; font-size: 13px; padding-left: 20px;">${results.lowBackPainRiskComment}</p>`;
      }
    }
  }
  
  html += `</div>`;
  
  // Fall Risk Scores (if available)
  if (results.fallRiskScores) {
    html += `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">転倒リスク詳細スコア</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
    `;
    
    const categories = [
      { name: "歩行能力・筋力", physical: results.fallRiskScores.physical.walkingAbility, self: results.fallRiskScores.selfAssessment.walkingAbility },
      { name: "敏捷性", physical: results.fallRiskScores.physical.agility, self: results.fallRiskScores.selfAssessment.agility },
      { name: "動的バランス", physical: results.fallRiskScores.physical.dynamicBalance, self: results.fallRiskScores.selfAssessment.dynamicBalance },
      { name: "静的バランス(閉眼)", physical: results.fallRiskScores.physical.staticBalanceClosed, self: results.fallRiskScores.selfAssessment.staticBalanceClosed },
      { name: "静的バランス(開眼)", physical: results.fallRiskScores.physical.staticBalanceOpen, self: results.fallRiskScores.selfAssessment.staticBalanceOpen },
    ];
    
    categories.forEach(category => {
      html += `<p style="margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #eee;"><strong>${category.name}:</strong> 測定${category.physical}点 / 自己評価${category.self}点</p>`;
    });
    
    html += `
        </div>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">
          <strong>黒線：</strong>実際の測定結果に基づいた評価（1～5点）<br>
          <strong>赤線：</strong>自己評価アンケートによる自己認識のスコア（1～5点）
        </p>
      </div>
    `;
  }
  
  // GPT Analysis Results
  if (gptAnalysis) {
    // Evaluation Comments
    if (gptAnalysis.evaluationComments.fallRiskComment) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">転倒リスク評価（AI分析）</h2>
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; line-height: 1.6;">${gptAnalysis.evaluationComments.fallRiskComment}</p>
          </div>
        </div>
      `;
    }
    
    if (gptAnalysis.evaluationComments.lowBackPainRiskComment) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">腰痛リスク評価（AI分析）</h2>
          <div style="background: #fff3e0; padding: 15px; border-radius: 5px; border-left: 4px solid #ff9800;">
            <p style="margin: 0; line-height: 1.6;">${gptAnalysis.evaluationComments.lowBackPainRiskComment}</p>
          </div>
        </div>
      `;
    }
    
    // Exercise Guidance
    if (gptAnalysis.exerciseGuidance.fallRiskExercises && gptAnalysis.exerciseGuidance.fallRiskExercises.length > 0) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">転倒リスク対策運動</h2>
      `;
      
      gptAnalysis.exerciseGuidance.fallRiskExercises.forEach((exercise, index) => {
        html += `
          <div style="margin-bottom: 20px; padding: 15px; background: #f0f8ff; border-radius: 5px; border-left: 4px solid #0066cc;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0; color: #0066cc;">${index + 1}. ${exercise.name}</h3>
            <p style="margin: 5px 0; font-weight: bold; color: #666;">目的: ${exercise.purpose}</p>
            <p style="margin: 5px 0; line-height: 1.5;">${exercise.instructions}</p>
          </div>
        `;
      });
      
      html += `</div>`;
    }
    
    if (gptAnalysis.exerciseGuidance.lowBackPainExercises && gptAnalysis.exerciseGuidance.lowBackPainExercises.length > 0) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">腰痛リスク対策運動</h2>
      `;
      
      gptAnalysis.exerciseGuidance.lowBackPainExercises.forEach((exercise, index) => {
        html += `
          <div style="margin-bottom: 20px; padding: 15px; background: #fff8e1; border-radius: 5px; border-left: 4px solid #ff9800;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 8px 0; color: #ff9800;">${index + 1}. ${exercise.name}</h3>
            <p style="margin: 5px 0; font-weight: bold; color: #666;">目的: ${exercise.purpose}</p>
            <p style="margin: 5px 0; line-height: 1.5;">${exercise.instructions}</p>
          </div>
        `;
      });
      
      html += `</div>`;
    }
  } else {
    // Basic Recommendations
    if (results.recommendations && results.recommendations.length > 0) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">推奨事項</h2>
          <ul style="margin: 0; padding-left: 20px;">
      `;
      results.recommendations.forEach((recommendation, index) => {
        html += `<li style="margin: 8px 0; line-height: 1.5;">${recommendation}</li>`;
      });
      html += `</ul></div>`;
    }
    
    // Basic Exercises
    if (results.exercises && results.exercises.length > 0) {
      html += `
        <div style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">推奨エクササイズ</h2>
      `;
      
      results.exercises.forEach((exercise, index) => {
        html += `
          <div style="margin-bottom: 25px; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #0066cc;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 10px 0; color: #0066cc;">${index + 1}. ${exercise.name}</h3>
            <p style="margin: 5px 0; color: #666; font-size: 13px;">${exercise.description}</p>
            <div style="margin-top: 10px;">
              <h4 style="font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">実施方法:</h4>
              <ol style="margin: 0; padding-left: 20px;">
        `;
        
        exercise.instructions.forEach((instruction, instrIndex) => {
          html += `<li style="margin: 5px 0; line-height: 1.4;">${instruction}</li>`;
        });
        
        html += `
              </ol>
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
    }
  }
  
  // Footer
  html += `
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666; font-size: 12px;">
      生成日時: ${new Date().toLocaleDateString("ja-JP")} ${new Date().toLocaleTimeString("ja-JP")}
    </div>
  `;
  
  reportDiv.innerHTML = html;
  return reportDiv;
}

function getRiskColor(risk: "low" | "medium" | "high" | undefined): string {
  switch (risk) {
    case "high": return "#d32f2f";
    case "medium": return "#f57c00";
    case "low": return "#388e3c";
    default: return "#666";
  }
}
