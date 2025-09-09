import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AssessmentData, RiskResult } from "../types/assessment";
import { GPTAnalysisResult } from "./gptAnalysis";

export async function generatePDF(data: AssessmentData, results: RiskResult, gptAnalysis?: GPTAnalysisResult | null): Promise<void> {
  // Create a temporary HTML element to render the report
  const reportElement = createReportHTML(data, results, gptAnalysis);
  document.body.appendChild(reportElement);
  
  try {
    // Convert HTML to canvas with higher resolution
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: reportElement.scrollHeight, // Use actual content height
      scrollX: 0,
      scrollY: 0,
    });
    
    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    const filename = gptAnalysis ? "AI健康リスク評価レポート.pdf" : "健康リスク評価レポート.pdf";
    pdf.save(filename);
    
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("PDFの生成に失敗しました。ブラウザの設定を確認してください。");
  } finally {
    // Clean up
    document.body.removeChild(reportElement);
  }
}

function createReportHTML(data: AssessmentData, results: RiskResult, gptAnalysis?: GPTAnalysisResult | null): HTMLElement {
  const reportDiv = document.createElement('div');
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
  `;
  
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">健康リスク評価レポート</h1>
      ${gptAnalysis ? '<p style="color: #0066cc; font-size: 14px;">AI詳細分析付き</p>' : ''}
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
    const overallText = "medium" === "high" ? "高リスク" : 
                       "medium" === "medium" ? "中リスク" : "低リスク";
    
    html += `
      <p style="margin: 5px 0;"><strong>転倒リスク（AI分析）:</strong> ${fallRiskText}</p>
      <p style="margin: 5px 0;"><strong>腰痛リスク（AI分析）:</strong> ${backPainText}</p>
      <p style="margin: 5px 0;"><strong>総合リスク:</strong> ${overallText}</p>
    `;
  } else {
    if (results.fallRisk) {
      const fallRiskText = results.fallRisk === "high" ? "高リスク" : 
                          results.fallRisk === "medium" ? "中リスク" : "低リスク";
      html += `<p style="margin: 5px 0;"><strong>転倒リスク:</strong> ${fallRiskText}`;
      if (results.fallRiskPercentage) {
        html += ` (${results.fallRiskPercentage}%)`;
      }
      html += `</p>`;
      if (results.fallRiskComment) {
        html += `<p style="margin: 5px 0; color: #666; font-size: 14px;">${results.fallRiskComment}</p>`;
      }
    }
    
    if (results.lowBackPainRisk) {
      const backPainText = results.lowBackPainRisk === "high" ? "高リスク" : 
                          results.lowBackPainRisk === "medium" ? "中リスク" : "低リスク";
      html += `<p style="margin: 5px 0;"><strong>腰痛リスク:</strong> ${backPainText}`;
      if (results.lowBackPainRiskPercentage) {
        html += ` (${results.lowBackPainRiskPercentage}%)`;
      }
      html += `</p>`;
      if (results.lowBackPainRiskComment) {
        html += `<p style="margin: 5px 0; color: #666; font-size: 14px;">${results.lowBackPainRiskComment}</p>`;
      }
    }
  }
  
  html += `</div>`;
  
  // Fall Risk Scores (if available)
  if (results.fallRiskScores) {
    html += `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">転倒リスク詳細スコア</h2>
    `;
    
    const categories = [
      { name: "歩行能力・筋力", physical: results.fallRiskScores.physical.walkingAbility, self: results.fallRiskScores.selfAssessment.walkingAbility },
      { name: "敏捷性", physical: results.fallRiskScores.physical.agility, self: results.fallRiskScores.selfAssessment.agility },
      { name: "動的バランス", physical: results.fallRiskScores.physical.dynamicBalance, self: results.fallRiskScores.selfAssessment.dynamicBalance },
      { name: "静的バランス(閉眼)", physical: results.fallRiskScores.physical.staticBalanceClosed, self: results.fallRiskScores.selfAssessment.staticBalanceClosed },
      { name: "静的バランス(開眼)", physical: results.fallRiskScores.physical.staticBalanceOpen, self: results.fallRiskScores.selfAssessment.staticBalanceOpen },
    ];
    
    categories.forEach(category => {
      html += `<p style="margin: 5px 0;"><strong>${category.name}:</strong> 測定${category.physical}点 / 自己評価${category.self}点</p>`;
    });
    
    html += `</div>`;
  }
  
  // Detailed Analysis (GPT only)
  if (gptAnalysis) {
    html += `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">詳細分析</h2>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #006600;">強み</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(strength => {
      html += `<li style="margin: 5px 0;">${strength}</li>`;
    });
    
    html += `
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #cc6600;">懸念点</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(concern => {
      html += `<li style="margin: 5px 0;">${concern}</li>`;
    });
    
    html += `
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #0066cc;">重要な発見</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(finding => {
      html += `<li style="margin: 5px 0;">${finding}</li>`;
    });
    
    html += `</ul></div>`;
  }
  
  // Recommendations
  html += `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">推奨事項</h2>
  `;
  
  if (gptAnalysis) {
    html += `
      <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #cc0000;">即座に実行すべき事項</h3>
      <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(rec => {
      html += `<li style="margin: 5px 0;">${rec}</li>`;
    });
    
    html += `
      </ul>
      
      <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #cc6600;">短期間で実行すべき事項</h3>
      <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(rec => {
      html += `<li style="margin: 5px 0;">${rec}</li>`;
    });
    
    html += `
      </ul>
      
      <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #006600;">長期間で実行すべき事項</h3>
      <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(rec => {
      html += `<li style="margin: 5px 0;">${rec}</li>`;
    });
    
    html += `</ul>`;
  } else {
    html += `<ul style="margin: 0 0 20px 20px;">`;
    results.recommendations.forEach(rec => {
      html += `<li style="margin: 5px 0;">${rec}</li>`;
    });
    html += `</ul>`;
  }
  
  html += `</div>`;
  
  // Exercise Plan
  html += `
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">エクササイズプラン</h2>
  `;
  
  if (gptAnalysis) {
    html += `
      <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #0066cc;">毎日のエクササイズ</h3>
      <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(exercise => {
      html += `<li style="margin: 5px 0;">${exercise}</li>`;
    });
    
    html += `
      </ul>
      
      <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #6600cc;">週次のエクササイズ</h3>
      <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(exercise => {
      html += `<li style="margin: 5px 0;">${exercise}</li>`;
    });
    
    html += `</ul>`;
    
    if ([].length > 0) {
      html += `
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #cc0000;">注意事項</h3>
        <ul style="margin: 0 0 20px 20px;">
      `;
      
      [].forEach(precaution => {
        html += `<li style="margin: 5px 0;">${precaution}</li>`;
      });
      
      html += `</ul>`;
    }
  } else {
    html += `<ul style="margin: 0 0 20px 20px;">`;
    results.exercises.forEach((exercise, index) => {
      html += `
        <li style="margin: 10px 0;">
          <strong>${index + 1}. ${exercise.name}</strong><br>
          <span style="color: #666; font-size: 14px;">${exercise.description}</span><br>
          <ol style="margin: 5px 0 0 20px;">
      `;
      
      exercise.instructions.forEach(instruction => {
        html += `<li style="margin: 3px 0;">${instruction}</li>`;
      });
      
      html += `</ol></li>`;
    });
    html += `</ul>`;
  }
  
  html += `</div>`;
  
  // Lifestyle Modifications (GPT only)
  if (gptAnalysis) {
    html += `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">ライフスタイル改善提案</h2>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #0066cc;">職場での改善</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(mod => {
      html += `<li style="margin: 5px 0;">${mod}</li>`;
    });
    
    html += `
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #006600;">日常生活での改善</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(mod => {
      html += `<li style="margin: 5px 0;">${mod}</li>`;
    });
    
    html += `
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #6600cc;">予防策</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(mod => {
      html += `<li style="margin: 5px 0;">${mod}</li>`;
    });
    
    html += `</ul></div>`;
  }
  
  // Follow-up Schedule (GPT only)
  if (gptAnalysis) {
    html += `
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px;">フォローアップ計画</h2>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #0066cc;">次回評価</h3>
        <p style="margin: 5px 0 20px 0;">${"3ヶ月後"}</p>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #006600;">マイルストーン</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(milestone => {
      html += `<li style="margin: 5px 0;">${milestone}</li>`;
    });
    
    html += `
        </ul>
        
        <h3 style="font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #cc0000;">注意すべき症状</h3>
        <ul style="margin: 0 0 20px 20px;">
    `;
    
    [].forEach(sign => {
      html += `<li style="margin: 5px 0;">${sign}</li>`;
    });
    
    html += `</ul></div>`;
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
