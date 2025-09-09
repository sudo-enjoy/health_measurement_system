import React, { useState } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import Button from "../components/Button";
import FormField from "../components/FormField";
import ProgressBar from "../components/ProgressBar";
import { useAssessment } from "../contexts/AssessmentContext";
import { FallRiskPhysical } from "../types/assessment";
import { calculateRisk } from "../utils/riskCalculation";
import walkImg from "../../images/walk.PNG";
import sitImg from "../../images/sit.PNG";
import armImg from "../../images/arm.PNG";
import closeEyeImg from "../../images/closeeye.PNG";
import openEyeImg from "../../images/openeye.PNG";

export default function FallRiskPhysicalPage() {
  const { state, dispatch } = useAssessment();
  const [physical, setPhysical] = useState<FallRiskPhysical>({
    oneLegStanding: 30,
    twoStepTest: 120,
    fingerToFloor: 0,
    closeEyeStand: 0,
    openEyeStand: 0,
    deepSquat: "full",
    fourDirectionStep: "≤10s"
  });
  const [activeField, setActiveField] = useState<keyof FallRiskPhysical>("oneLegStanding");

  const imageMap: Record<keyof FallRiskPhysical, { src: string; title: string; subtitle: string }> = {
    oneLegStanding: { src: walkImg, title: "片脚立位", subtitle: "One-Leg Standing (sec)" },
    twoStepTest: { src: sitImg, title: "2ステップテスト", subtitle: "Two-Step Test (cm)" },
    fingerToFloor: { src: armImg, title: "ファンクショナルリーチ", subtitle: "Functional Reach (cm)" },
    closeEyeStand: { src: closeEyeImg, title: "閉眼片足立ち", subtitle: "Eyes Closed (sec)" },
    openEyeStand: { src: openEyeImg, title: "開眼片足立ち", subtitle: "Eyes Open (sec)" },
    deepSquat: { src: sitImg, title: "ディープスクワット", subtitle: "Deep Squat" },
    fourDirectionStep: { src: walkImg, title: "4方向ステップ", subtitle: "Four-Direction Step" }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingFallRisk = state.data.fallRisk || {};
    dispatch({ 
      type: "UPDATE_DATA", 
      payload: { 
        fallRisk: ({ 
          ...existingFallRisk, 
          physical 
        } as any) 
      } 
    });

    // Navigate based on assessment type
    if (state.assessmentType === "both") {
      dispatch({ type: "SET_STEP", payload: "lowbackPhysical" });
    } else {
      // Calculate results and show
      const fullData = {
        userInfo: state.data.userInfo!,
        fallRisk: {
          questionnaire: (existingFallRisk as any).questionnaire,
          physical
        }
      } as const;
      const results = calculateRisk(fullData);
      dispatch({ type: "SET_RESULTS", payload: results });
    }
  };

  const currentVisual = imageMap[activeField];

  return (
    <Layout title="転倒リスク評価 - 身体機能テスト" showBack>
      <ProgressBar current={3} total={5} />
      
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">身体機能テスト</h2>
        <p className="text-gray-600 mb-6">各テストの結果を入力してください。</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-6 order-2 lg:order-1">
            <FormField 
              label="片脚立位 (静的バランス)"
            >
              <input
                type="number"
                min="0"
                max="300"
                value={physical.oneLegStanding}
                onFocus={() => setActiveField("oneLegStanding")}
                onChange={(e) => setPhysical({ ...physical, oneLegStanding: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
              <span className="text-sm text-gray-500">秒</span>
            </FormField>

            <FormField 
              label="2ステップテスト (歩行能力・筋力)"
            >
              <input
                type="number"
                min="0"
                max="300"
                value={physical.twoStepTest}
                onFocus={() => setActiveField("twoStepTest")}
                onChange={(e) => setPhysical({ ...physical, twoStepTest: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="120"
              />
              <span className="text-sm text-gray-500">cm</span>
            </FormField>

            <FormField 
              label="ファンクショナルリーチ (動的バランス)"
            >
              <input
                type="number"
                min="0"
                max="50"
                value={physical.fingerToFloor}
                onFocus={() => setActiveField("fingerToFloor")}
                onChange={(e) => setPhysical({ ...physical, fingerToFloor: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">cm</span>
            </FormField>

            <FormField label="閉眼片足立ち(静的バランス)">
              <input
                type="number"
                min="0"
                max="50"
                value={physical.closeEyeStand}
                onFocus={() => setActiveField("closeEyeStand")}
                onChange={(e) => setPhysical({ ...physical, closeEyeStand: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">秒</span>
            </FormField>

            <FormField label="開眼片足立ち(静的バランス)">
              <input
                type="number"
                min="0"
                max="50"
                value={physical.openEyeStand}
                onFocus={() => setActiveField("openEyeStand")}
                onChange={(e) => setPhysical({ ...physical, openEyeStand: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">秒</span>
            </FormField>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg">
                {state.assessmentType === "both" ? "腰痛評価へ" : "AI分析で結果を表示"}
              </Button>
            </div>
          </form>

          <div className="order-1 lg:order-2">
            <div className="sticky top-4">
              <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-sm text-gray-500">現在のテスト</p>
                  <h3 className="text-lg font-semibold text-gray-900">{currentVisual.title}</h3>
                  <p className="text-xs text-gray-500">{currentVisual.subtitle}</p>
                </div>
                <div className="p-4">
                  <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center rounded-lg">
                    <img src={currentVisual.src} alt={currentVisual.title} className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
