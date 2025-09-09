import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Slider from '../components/Slider';
import { useAssessment } from '../contexts/AssessmentContext';
import { calculateRisk } from '../utils/riskCalculation';
import type { FallRiskPhysical } from '../types/assessment';

export default function FallRiskPhysical() {
  const navigate = useNavigate();
  const { state, dispatch } = useAssessment();
  
  const [physical, setPhysical] = useState<FallRiskPhysical>({
    twoStepTest: 0,
    seatedSteppingTest: 0,
    functionalReach: 0,
    closedEyeStand: 0,
    openEyeStand: 0,
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  // Image mapping for each test
  const imageMap: Record<string, string> = {
    twoStepTest: '/images/walk.PNG',
    seatedSteppingTest: '/images/sit.PNG', 
    functionalReach: '/images/arm.PNG',
    closedEyeStand: '/images/closeeye.PNG',
    openEyeStand: '/images/openeye.PNG',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all tests are completed
    const allCompleted = Object.values(physical).every(value => value > 0);
    if (!allCompleted) {
      alert('すべてのテストを完了してください。');
      return;
    }

    const updatedData = {
      fallRisk: {
        ...state.data.fallRisk,
        physical
      }
    };
    
    dispatch({ type: 'UPDATE_DATA', payload: updatedData });

    // Navigate based on assessment type
    if (state.assessmentType === 'both') {
      navigate('/low-back-pain/physical');
    } else {
      // Calculate results for fall risk only assessment
      const results = calculateRisk({ ...state.data, ...updatedData });
      dispatch({ type: 'SET_RESULTS', payload: results });
      navigate('/results');
    }
  };

  return (
    <Layout title="転倒リスク身体機能測定">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Form */}
        <Card>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              転倒リスク身体機能測定
            </h1>
            <p className="text-gray-600">
              厚生労働省推奨の5つのテストを実施してください。
              各テストの結果を正確に測定し、入力してください。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ① 2ステップテスト */}
            <FormField 
              label="① 2ステップテスト" 
              description="最大歩幅で2歩歩いた距離を測定してください（cm）"
            >
              <div onFocus={() => setActiveField("twoStepTest")}>
                <Slider
                  value={physical.twoStepTest}
                  onChange={(value) => setPhysical({ ...physical, twoStepTest: value })}
                  min={100}
                  max={300}
                  step={1}
                  unit="cm"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>測定方法：</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>スタートラインに両足を揃えて立つ</li>
                    <li>最大歩幅で2歩歩く</li>
                    <li>2歩目の足先までの距離を測定</li>
                  </ul>
                </div>
              </div>
            </FormField>

            {/* ② 座位ステッピングテスト */}
            <FormField 
              label="② 座位ステッピングテスト" 
              description="20秒間でできるステップ数を測定してください"
            >
              <div onFocus={() => setActiveField("seatedSteppingTest")}>
                <Slider
                  value={physical.seatedSteppingTest}
                  onChange={(value) => setPhysical({ ...physical, seatedSteppingTest: value })}
                  min={10}
                  max={80}
                  step={1}
                  unit="回"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>測定方法：</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>椅子に座り、背もたれに寄りかからない</li>
                    <li>片足ずつ交互にステップを踏む</li>
                    <li>20秒間でできる回数をカウント</li>
                  </ul>
                </div>
              </div>
            </FormField>

            {/* ③ ファンクショナルリーチ */}
            <FormField 
              label="③ ファンクショナルリーチ" 
              description="壁に沿って前傾した時のリーチ距離を測定してください（cm）"
            >
              <div onFocus={() => setActiveField("functionalReach")}>
                <Slider
                  value={physical.functionalReach}
                  onChange={(value) => setPhysical({ ...physical, functionalReach: value })}
                  min={10}
                  max={60}
                  step={1}
                  unit="cm"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>測定方法：</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>壁に沿って立つ</li>
                    <li>腕を前に伸ばし、指先の位置を記録</li>
                    <li>前傾して指先が届く最大距離を測定</li>
                  </ul>
                </div>
              </div>
            </FormField>

            {/* ④ 閉眼片足立ち */}
            <FormField 
              label="④ 閉眼片足立ち" 
              description="目を閉じて片足で立っていられる時間を測定してください（秒）"
            >
              <div onFocus={() => setActiveField("closedEyeStand")}>
                <Slider
                  value={physical.closedEyeStand}
                  onChange={(value) => setPhysical({ ...physical, closedEyeStand: value })}
                  min={0}
                  max={120}
                  step={0.1}
                  unit="秒"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>測定方法：</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>目を閉じて片足で立つ</li>
                    <li>もう一方の足は床から離す</li>
                    <li>バランスを崩すまでの時間を測定</li>
                    <li>最大120秒で終了</li>
                  </ul>
                </div>
              </div>
            </FormField>

            {/* ⑤ 開眼片足立ち */}
            <FormField 
              label="⑤ 開眼片足立ち" 
              description="目を開けて片足で立っていられる時間を測定してください（秒）"
            >
              <div onFocus={() => setActiveField("openEyeStand")}>
                <Slider
                  value={physical.openEyeStand}
                  onChange={(value) => setPhysical({ ...physical, openEyeStand: value })}
                  min={0}
                  max={180}
                  step={0.1}
                  unit="秒"
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p>測定方法：</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>目を閉じて片足で立つ</li>
                    <li>もう一方の足は床から離す</li>
                    <li>バランスを崩すまでの時間を測定</li>
                    <li>最大180秒で終了</li>
                  </ul>
                </div>
              </div>
            </FormField>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button type="submit" className="px-8">
                {state.assessmentType === 'both' ? '次へ進む' : '結果を見る'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Right side - Dynamic Image Display */}
        <div className="lg:block hidden">
          <Card className="h-fit">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                測定方法の参考画像
              </h3>
              {activeField && imageMap[activeField] ? (
                <div className="space-y-4">
                  <img
                    src={imageMap[activeField]}
                    alt={`${activeField} の測定方法`}
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-600">
                    {activeField === 'twoStepTest' && '2ステップテストの測定方法'}
                    {activeField === 'seatedSteppingTest' && '座位ステッピングテストの測定方法'}
                    {activeField === 'functionalReach' && 'ファンクショナルリーチの測定方法'}
                    {activeField === 'closedEyeStand' && '閉眼片足立ちの測定方法'}
                    {activeField === 'openEyeStand' && '開眼片足立ちの測定方法'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">
                    左側の項目を選択すると<br />
                    測定方法の画像が表示されます
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
