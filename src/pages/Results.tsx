import React, { useEffect, useState } from "react";
import { Download, RotateCcw, AlertTriangle, CheckCircle, Info, Loader2, Brain, Calendar, Target, Shield } from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAssessment } from "../contexts/AssessmentContext";
import { generatePDF } from "../utils/pdfGenerator";
import { analyzeWithGPT, GPTAnalysisResult } from "../utils/gptAnalysis";

export default function Results() {
  const { state, dispatch } = useAssessment();
  const { results, gptAnalysis, isLoading, error } = state;
  const [showGPTAnalysis, setShowGPTAnalysis] = useState(false);

  useEffect(() => {
    if (results && !gptAnalysis && !isLoading && !error) {
      handleGPTAnalysis();
    }
  }, [results, gptAnalysis, isLoading, error]);

  const handleGPTAnalysis = async () => {
    if (!results || !state.data.userInfo) return;
    
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });
    
    try {
      const analysis = await analyzeWithGPT(state.data as any, results);
      dispatch({ type: "SET_GPT_ANALYSIS", payload: analysis });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "分析に失敗しました" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  if (!results) {
    return (
      <Layout title="結果">
        <Card>
          <p>結果が見つかりません。</p>
        </Card>
      </Layout>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(state.data as any, results, gptAnalysis);
    } catch (error) {
      console.error("PDF生成エラー:", error);
      alert("PDFの生成に失敗しました。");
    }
  };

  const handleRestart = () => {
    dispatch({ type: "RESET" });
  };

  const getRiskColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-orange-600 bg-orange-100";
      case "low": return "text-green-600 bg-green-100";
    }
  };

  const getRiskIcon = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "high": return AlertTriangle;
      case "medium": return Info;
      case "low": return CheckCircle;
    }
  };

  const getRiskText = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "high": return "高リスク";
      case "medium": return "中リスク";
      case "low": return "低リスク";
    }
  };

  return (
    <Layout title="評価結果">
      <div className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <Card>
            <div className="flex items-center justify-center space-x-3 py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-lg text-gray-700">AI分析を実行中...</span>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">分析エラー</span>
              </div>
              <p className="text-red-700 mt-2">{error}</p>
              <Button onClick={handleGPTAnalysis} className="mt-3" variant="outline">
                再試行
              </Button>
            </div>
          </Card>
        )}

        {/* Basic Risk Summary */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">評価結果サマリー</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {results.fallRisk && (
              <div className={`p-4 rounded-lg ${getRiskColor(results.fallRisk)}`}>
                <div className="flex items-center space-x-2">
                  {React.createElement(getRiskIcon(results.fallRisk), { className: "w-5 h-5" })}
                  <h3 className="font-semibold">転倒リスク</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{getRiskText(results.fallRisk)}</p>
              </div>
            )}
            
            {results.lowBackPainRisk && (
              <div className={`p-4 rounded-lg ${getRiskColor(results.lowBackPainRisk)}`}>
                <div className="flex items-center space-x-2">
                  {React.createElement(getRiskIcon(results.lowBackPainRisk), { className: "w-5 h-5" })}
                  <h3 className="font-semibold">腰痛リスク</h3>
                </div>
                <p className="text-2xl font-bold mt-2">{getRiskText(results.lowBackPainRisk)}</p>
              </div>
            )}
          </div>

          {/* GPT Analysis Toggle */}
          {gptAnalysis && (
            <div className="border-t pt-4">
              <Button 
                onClick={() => setShowGPTAnalysis(!showGPTAnalysis)}
                className="flex items-center space-x-2"
                variant="outline"
              >
                <Brain className="w-5 h-5" />
                <span>{showGPTAnalysis ? "基本結果を表示" : "AI詳細分析を表示"}</span>
              </Button>
            </div>
          )}
        </Card>

        {/* GPT Analysis Results */}
        {gptAnalysis && showGPTAnalysis && (
          <>
            {/* Enhanced Risk Assessment */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <span>AI詳細分析</span>
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {gptAnalysis.riskAssessment.fallRisk && (
                  <div className={`p-4 rounded-lg ${getRiskColor(gptAnalysis.riskAssessment.fallRisk)}`}>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getRiskIcon(gptAnalysis.riskAssessment.fallRisk), { className: "w-5 h-5" })}
                      <h3 className="font-semibold">転倒リスク（AI分析）</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getRiskText(gptAnalysis.riskAssessment.fallRisk)}</p>
                  </div>
                )}
                
                {gptAnalysis.riskAssessment.lowBackPainRisk && (
                  <div className={`p-4 rounded-lg ${getRiskColor(gptAnalysis.riskAssessment.lowBackPainRisk)}`}>
                    <div className="flex items-center space-x-2">
                      {React.createElement(getRiskIcon(gptAnalysis.riskAssessment.lowBackPainRisk), { className: "w-5 h-5" })}
                      <h3 className="font-semibold">腰痛リスク（AI分析）</h3>
                    </div>
                    <p className="text-2xl font-bold mt-2">{getRiskText(gptAnalysis.riskAssessment.lowBackPainRisk)}</p>
                  </div>
                )}

                <div className={`p-4 rounded-lg ${getRiskColor(gptAnalysis.riskAssessment.overallRisk)}`}>
                  <div className="flex items-center space-x-2">
                    {React.createElement(getRiskIcon(gptAnalysis.riskAssessment.overallRisk), { className: "w-5 h-5" })}
                    <h3 className="font-semibold">総合リスク</h3>
                  </div>
                  <p className="text-2xl font-bold mt-2">{getRiskText(gptAnalysis.riskAssessment.overallRisk)}</p>
                </div>
              </div>
            </Card>

            {/* Detailed Analysis */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">詳細分析</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>強み</span>
                  </h3>
                  <ul className="space-y-2">
                    {gptAnalysis.detailedAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-orange-700 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>懸念点</span>
                  </h3>
                  <ul className="space-y-2">
                    {gptAnalysis.detailedAnalysis.concerns.map((concern, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{concern}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-blue-700 mb-3 flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>重要な発見</span>
                  </h3>
                  <ul className="space-y-2">
                    {gptAnalysis.detailedAnalysis.keyFindings.map((finding, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Personalized Recommendations */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>個別化推奨事項</span>
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-red-700 mb-3">即座に実行すべき事項</h3>
                  <div className="space-y-2">
                    {gptAnalysis.personalizedRecommendations.immediate.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-orange-700 mb-3">短期間で実行すべき事項</h3>
                  <div className="space-y-2">
                    {gptAnalysis.personalizedRecommendations.shortTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-green-700 mb-3">長期間で実行すべき事項</h3>
                  <div className="space-y-2">
                    {gptAnalysis.personalizedRecommendations.longTerm.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Exercise Plan */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">個別化エクササイズプラン</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-3">毎日のエクササイズ</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.exercisePlan.daily.map((exercise, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-700 mb-3">週次のエクササイズ</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.exercisePlan.weekly.map((exercise, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{exercise}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {gptAnalysis.exercisePlan.precautions.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>注意事項</span>
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {gptAnalysis.exercisePlan.precautions.map((precaution, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <span className="text-sm text-red-800">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* Lifestyle Modifications */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">ライフスタイル改善提案</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-3">職場での改善</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.lifestyleModifications.workplace.map((mod, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-green-700 mb-3">日常生活での改善</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.lifestyleModifications.daily.map((mod, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-purple-700 mb-3">予防策</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.lifestyleModifications.preventive.map((mod, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <span className="text-sm text-gray-700">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Follow-up Schedule */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>フォローアップ計画</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-blue-700 mb-3">次回評価</h3>
                  <p className="text-gray-700">{gptAnalysis.followUpSchedule.nextAssessment}</p>
                  
                  <h3 className="font-semibold text-green-700 mb-3 mt-4">マイルストーン</h3>
                  <ul className="space-y-2">
                    {gptAnalysis.followUpSchedule.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-sm text-gray-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-red-700 mb-3">注意すべき症状</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <ul className="space-y-2">
                      {gptAnalysis.followUpSchedule.warningSigns.map((sign, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                          <span className="text-sm text-red-800">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Basic Results (when GPT analysis is not shown) */}
        {!showGPTAnalysis && (
          <>
            {/* Basic Recommendations */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">推奨事項</h2>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Basic Exercises */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">推奨エクササイズ</h2>
              <div className="grid gap-6">
                {results.exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={exercise.illustration}
                        alt={exercise.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {exercise.name}
                        </h3>
                        <p className="text-gray-600 mb-3">{exercise.description}</p>
                        <div className="space-y-2">
                          {exercise.instructions.map((instruction, instrIndex) => (
                            <div key={instrIndex} className="flex items-start space-x-2">
                              <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                {instrIndex + 1}
                              </div>
                              <p className="text-sm text-gray-700">{instruction}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Actions */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleDownloadPDF} className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>PDFレポートをダウンロード</span>
            </Button>
            <Button variant="outline" onClick={handleRestart} className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>新しい評価を開始</span>
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
