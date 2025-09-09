import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import Modal from '../components/Modal';
import { useAssessment } from '../contexts/AssessmentContext';
import type { FallRiskQuestionnaire } from '../types/assessment';

export default function FallRiskQuestionnaire() {
  const navigate = useNavigate();
  const { dispatch } = useAssessment();
  
  const [showModal, setShowModal] = useState(false);
  
  const [questionnaire, setQuestionnaire] = useState<FallRiskQuestionnaire>({
    // Group 1: 歩行能力・筋力
    crowdWalking: 0,
    physicalConfidence: 0,
    
    // Group 2: 敏捷性
    quickReaction: 0,
    stepRecovery: 0,
    
    // Group 3: 動的バランス
    sockWearing: 0,
    heelToToe: 0,
    
    // Group 4: 静的バランス(閉眼)
    closedEyeConfidence: 0,
    
    // Group 5: 静的バランス(開眼)
    trainStanding: 0,
    openEyeConfidence: 0,
  });

  const handleAnswerChange = (question: keyof FallRiskQuestionnaire, value: number) => {
    setQuestionnaire(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all questions are answered
    const allAnswered = Object.values(questionnaire).every(value => value > 0);
    if (!allAnswered) {
      setShowModal(true);
      return;
    }

    dispatch({
      type: 'UPDATE_DATA',
      payload: {
        fallRisk: {
          questionnaire,
          physical: {
            twoStepTest: 0,
            seatedSteppingTest: 0,
            functionalReach: 0,
            closedEyeStand: 0,
            openEyeStand: 0,
          }
        }
      }
    });

    navigate('/fall-risk/physical');
  };

  const renderQuestionGroup = (
    title: string,
    questions: Array<{
      key: keyof FallRiskQuestionnaire;
      question: string;
      options: string[];
    }>
  ) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="space-y-6">
        {questions.map(({ key, question, options }) => (
          <FormField key={key} label={question}>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    questionnaire[key] === index + 1
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={key}
                    value={index + 1}
                    checked={questionnaire[key] === index + 1}
                    onChange={() => handleAnswerChange(key, index + 1)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium text-center">
                    {index + 1}<br />
                    <span className="text-xs text-gray-600">{option}</span>
                  </span>
                </label>
              ))}
            </div>
          </FormField>
        ))}
      </div>
    </div>
  );

  return (
    <Layout title="転倒リスク自己評価アンケート">
      <Card>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            転倒リスク自己評価アンケート
          </h1>
          <p className="text-gray-600">
            以下の質問について、あなたの現在の状況に最も当てはまる選択肢を選んでください。
            各質問について1〜5の5段階で評価してください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Question 1: 人ごみの中を歩く自信 */}
          {renderQuestionGroup(
            "① 歩行能力・筋力",
            [
              {
                key: "crowdWalking",
                question: "人ごみの中、正面から来る人にぶつからず、よけて歩けますか？",
                options: ["自信がない", "あまり自信がない", "人並み程度", "少し自信がある", "自信がある"]
              },
              {
                key: "physicalConfidence",
                question: "同年代に比べて体力に自信はありますか？",
                options: ["自信がない", "あまり自信がない", "人並み程度", "やや自信がある", "自信がある"]
              }
            ]
          )}

          {/* Question 3 & 4: 敏捷性 */}
          {renderQuestionGroup(
            "② 敏捷性",
            [
              {
                key: "quickReaction",
                question: "突発的な事態に対する体の反応は素早い方だと思いますか？",
                options: ["素早くないと思う", "あまり素早くない方と思う", "普通", "やや素早い方と思う", "素早い方と思う"]
              },
              {
                key: "stepRecovery",
                question: "歩行中、小さい段差に足を引っ掛けたとき、すぐに次の足が出ると思いますか？",
                options: ["自信がない", "あまり自信がない", "少し自信がある", "かなり自信がある", "とても自信がある"]
              }
            ]
          )}

          {/* Question 5 & 6: 動的バランス */}
          {renderQuestionGroup(
            "③ 動的バランス",
            [
              {
                key: "sockWearing",
                question: "片足で立ったまま靴下を履くことができると思いますか？",
                options: ["できないと思う", "最近やってないができないと思う", "最近やってないが何回かに1回はできると思う", "最近やってないができると思う", "できると思う"]
              },
              {
                key: "heelToToe",
                question: "一直線に引いたラインの上を、継ぎ足歩行（後ろ足のかかとを前脚のつま先に付けるように歩く）で簡単に歩くことができると思いますか？",
                options: ["継ぎ足歩行ができない", "継ぎ足歩行はできるがラインからずれる", "ゆっくりであればできる", "普通にできる", "簡単にできる"]
              }
            ]
          )}

          {/* Question 7: 静的バランス(閉眼) */}
          {renderQuestionGroup(
            "④ 静的バランス(閉眼)",
            [
              {
                key: "closedEyeConfidence",
                question: "眼を閉じて片足でどのくらい立つ自信がありますか？",
                options: ["10秒以内", "20秒程度", "40秒程度", "1分程度", "それ以上"]
              }
            ]
          )}

          {/* Question 8 & 9: 静的バランス(開眼) */}
          {renderQuestionGroup(
            "⑤ 静的バランス(開眼)",
            [
              {
                key: "trainStanding",
                question: "電車に乗って、つり革につかまらずどのくらい立っていられると思いますか？",
                options: ["10秒以内", "30秒程度", "1分程度", "2分程度", "3分以上"]
              },
              {
                key: "openEyeConfidence",
                question: "眼を開けて片足でどのくらい立つ自信がありますか？",
                options: ["15秒以内", "30秒程度", "1分程度", "1分30秒程度", "2分以上"]
              }
            ]
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button type="submit" className="px-8">
              次へ進む
            </Button>
          </div>
        </form>
      </Card>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="質問の回答が必要です"
        message="より正確な評価を行うために、すべての質問にお答えください。各質問はあなたの健康状態を理解するために重要です。"
        type="warning"
      />
    </Layout>
  );
}
