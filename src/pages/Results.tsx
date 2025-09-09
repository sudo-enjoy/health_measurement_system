import React, { useEffect, useState } from "react";
import { Download, RotateCcw, AlertTriangle, CheckCircle, Info, Loader2, Brain, Target, Shield } from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAssessment } from "../contexts/AssessmentContext";
import { generatePDF } from "../utils/pdfGenerator";
import RadarChart from "../components/RadarChart";

import { analyzeWithGPT } from "../utils/gptAnalysis";

export default function Results() {
  const { state, dispatch } = useAssessment();
  const { results, gptAnalysis, isLoading, error, assessmentType } = state;
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
      console.log("Calling GPT analysis with:", { data: state.data, results });
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

          {/* Radar Chart for Fall Risk */}
          {results.fallRiskScores && (assessmentType === "fall" || assessmentType === "both") && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">転倒リスク評価チャート</h3>
              <div className="bg-white p-4 rounded-lg border">
                <RadarChart scores={results.fallRiskScores} className="w-full" />
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>黒線：</strong>実際の測定結果に基づいた評価（1～5点）</p>
                <p><strong>赤線：</strong>自己評価アンケートによる自己認識のスコア（1～5点）</p>
              </div>
            </div>
          )}

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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span>AI詳細分析</span>
            </h2>
            
            {/* Evaluation Comments */}
            <div className="grid md:grid-cols-2 gap-6">
              {gptAnalysis.evaluationComments.fallRiskComment && (
                <Card>
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    転倒リスク評価
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {gptAnalysis.evaluationComments.fallRiskComment}
                  </p>
                </Card>
              )}
              
              {gptAnalysis.evaluationComments.lowBackPainRiskComment && (
                <Card>
                  <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    腰痛リスク評価
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {gptAnalysis.evaluationComments.lowBackPainRiskComment}
                  </p>
                </Card>
              )}
            </div>

            {/* Exercise Guidance */}
            <div className="grid md:grid-cols-2 gap-6">
              {gptAnalysis.exerciseGuidance.fallRiskExercises && gptAnalysis.exerciseGuidance.fallRiskExercises.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    転倒リスク対策運動
                  </h3>
                  <div className="space-y-4">
                    {gptAnalysis.exerciseGuidance.fallRiskExercises.map((exercise, index) => (
                      <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">{exercise.name}</h4>
                        <p className="text-sm text-blue-700 mb-2"><strong>目的:</strong> {exercise.purpose}</p>
                        <p className="text-sm text-gray-700">{exercise.instructions}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
              
              {gptAnalysis.exerciseGuidance.lowBackPainExercises && gptAnalysis.exerciseGuidance.lowBackPainExercises.length > 0 && (
                <Card>
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    腰痛リスク対策運動
                  </h3>
                  <div className="space-y-4">
                    {gptAnalysis.exerciseGuidance.lowBackPainExercises.map((exercise, index) => (
                      <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">{exercise.name}</h4>
                        <p className="text-sm text-orange-700 mb-2"><strong>目的:</strong> {exercise.purpose}</p>
                        <p className="text-sm text-gray-700">{exercise.instructions}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
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
                        src={exercise.illustration || "/images/state1.png"}
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
