import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Slider from '../components/Slider';
import Modal from '../components/Modal';
import { useAssessment } from '../contexts/AssessmentContext';
import type { LowBackPainPhysical } from '../types/assessment';
import state1Img from '../../images/state1.png';
import state2Img from '../../images/state2.png';
import state3Img from '../../images/state3.png';
import state4Img from '../../images/state4.png';
import state5Img from '../../images/state5.png';

export default function LowBackPainPhysicalPage() {
  const { state, dispatch } = useAssessment();
  const navigate = useNavigate();
  const [physical, setPhysical] = useState<LowBackPainPhysical>({
    standingForwardBend: '',
    hipFlexion: '',
    plankChallenge: 45,
    wallPostureHead: '',
    wallPostureWaist: ''
  });
  const [activeTest, setActiveTest] = useState<string>('standingForwardBend');
  const [showModal, setShowModal] = useState(false);

  const imageMap: Record<string, { src: string; title: string; description: string }> = {
    standingForwardBend: { 
      src: state1Img, 
      title: "立位体前屈", 
      description: "両足をそろえて指先で床をさわれますか？" 
    },
    hipFlexion: { 
      src: state2Img, 
      title: "腰沈み込みテスト", 
      description: "両足を広げ、つま先は30度ほど外向きに。お尻を沈めていき両ひざのラインを超えれますか？" 
    },
    plankChallenge: { 
      src: state3Img, 
      title: "プランクチャレンジ", 
      description: "最大で60秒で計測は終了。（入力例：45）" 
    },
    wallPostureHead: { 
      src: state4Img, 
      title: "壁姿勢チェック（あたま）", 
      description: "頭の位置のチェックです。踵は壁につけるようにして正面を向いてみてください。" 
    },
    wallPostureWaist: { 
      src: state5Img, 
      title: "壁姿勢チェック（こし）", 
      description: "腰の位置のチェックです。踵は壁につけるようにして正面を向いてみてください。" 
    }
  };

  const handleInputChange = (field: keyof LowBackPainPhysical, value: string | number) => {
    setPhysical(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields are completed
    const isComplete = physical.standingForwardBend && 
                      physical.hipFlexion && 
                      physical.plankChallenge > 0 && 
                      physical.wallPostureHead && 
                      physical.wallPostureWaist;
    
    if (!isComplete) {
      setShowModal(true);
      return;
    }

    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        lowBackPain: {
          physical
        }
      }
    });

    navigate('/low-back-pain/biopsychosocial');
  };

  const renderRadioOptions = (field: keyof LowBackPainPhysical, options: string[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((option) => (
        <label
          key={option}
          className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
            physical[field] === option
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name={field}
            value={option}
            checked={physical[field] === option}
            onChange={() => handleInputChange(field, option)}
            className="sr-only"
          />
          <span className="text-sm font-medium text-center">{option}</span>
        </label>
      ))}
    </div>
  );

  return (
    <Layout title="腰痛リスク 身体測定">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              腰痛リスク 身体測定
            </h1>
            <p className="text-gray-600">
              以下のテストを順番に実施し、結果を入力してください。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 立位体前屈 */}
            <FormField 
              label="① 立位体前屈 * 両足をそろえて指先で床をさわれますか？"
              onFocus={() => setActiveTest('standingForwardBend')}
            >
              {renderRadioOptions('standingForwardBend', ['OK', '点線まで', 'かたい'])}
            </FormField>

            {/* 腰沈み込みテスト */}
            <FormField 
              label="② 腰沈み込みテスト * 両足を広げ、つま先は30度ほど外向きに。お尻を沈めていき両ひざのラインを超えれますか？"
              onFocus={() => setActiveTest('hipFlexion')}
            >
              {renderRadioOptions('hipFlexion', ['OK', '点線まで', 'かたい'])}
            </FormField>

            {/* プランクチャレンジ */}
            <FormField 
              label="③ プランクチャレンジ（秒） * 最大で60秒で計測は終了。　（入力例：45）"
              onFocus={() => setActiveTest('plankChallenge')}
            >
              <Slider
                value={physical.plankChallenge}
                onChange={(value) => handleInputChange('plankChallenge', value)}
                min={0}
                max={60}
                step={1}
                unit="秒"
              />
            </FormField>

            {/* 壁姿勢チェック（あたま） */}
            <FormField 
              label="④ 壁姿勢チェック（あたま） * 頭の位置のチェックです。踵は壁につけるようにして正面を向いてみてください。"
              onFocus={() => setActiveTest('wallPostureHead')}
            >
              {renderRadioOptions('wallPostureHead', [
                '頭は壁についており、視線はまっすぐだ',
                '頭が前に出ている、猫背の姿勢',
                '顎が上がっている'
              ])}
            </FormField>

            {/* 壁姿勢チェック（こし） */}
            <FormField 
              label="⑤ 壁姿勢チェック（こし） * 腰の位置のチェックです。踵は壁につけるようにして正面を向いてみてください。"
              onFocus={() => setActiveTest('wallPostureWaist')}
            >
              {renderRadioOptions('wallPostureWaist', [
                'パーが入る（自然なカーブ）',
                '手は入らない（骨盤後傾）',
                'グーが入る（反り腰）'
              ])}
            </FormField>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button type="submit" className="px-8">
                確認
              </Button>
            </div>
          </form>
        </Card>

        {/* Dynamic Image Display */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <img
              src={imageMap[activeTest]?.src}
              alt={imageMap[activeTest]?.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-lg transition-all duration-300"
            />
            <h3 className="text-lg font-semibold text-gray-800 mt-4">
              {imageMap[activeTest]?.title}
            </h3>
            <p className="text-gray-600 mt-2">
              {imageMap[activeTest]?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Ecstatic Modal for Incomplete Selections */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="テストの完了が必要です"
        message="より正確な腰痛リスク評価を行うために、すべてのテストを完了してください。各テストはあなたの身体機能を理解するために重要です。"
        type="warning"
      />
    </Layout>
  );
}
