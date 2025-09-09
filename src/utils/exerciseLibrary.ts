import { Exercise } from '../types/assessment';

// 片脚立位訓練のバリエーション
export const singleLegStandingVariations: Exercise[] = [
  {
    name: '基本片脚立位',
    description: 'バランス能力の基礎を築く最も重要な運動です。転倒予防の第一歩として最適です。',
    instructions: [
      '壁や手すりの近くで安全を確保してください',
      '両手を腰に当て、片足を床から5cm程度浮かせます',
      '目線は前方の一点を見つめ、姿勢を安定させます',
      '30秒間キープを目標に、左右交互に実施してください',
      '毎日2-3セット実施し、徐々に時間を延ばしていきます'
    ],
    illustration: '/images/openeye.PNG'
  },
  {
    name: '閉眼片脚立位',
    description: '視覚に頼らないバランス能力を鍛える高度な訓練です。内耳の平衡感覚を強化します。',
    instructions: [
      '基本片脚立位が安定してできるようになってから挑戦してください',
      '安全な場所で、壁の近くに立ちます',
      '片足立ちの姿勢を取った後、ゆっくりと目を閉じます',
      '10-15秒間キープを目標にします',
      '左右交互に実施し、毎日1-2セット行います'
    ],
    illustration: '/images/openeye.PNG'
  },
  {
    name: '動的片脚立位',
    description: '動きながらのバランス訓練で、実用的なバランス能力を向上させます。',
    instructions: [
      '片足立ちの姿勢を取ります',
      '浮かせた足を前後左右にゆっくりと動かします',
      '体幹を安定させたまま、8の字を描くように動かします',
      '各方向10回ずつ実施します',
      '左右交互に行い、毎日2セット実施しましょう'
    ],
    illustration: '/images/openeye.PNG'
  }
];

// スクワットのバリエーション
export const squatVariations: Exercise[] = [
  {
    name: '基本スクワット',
    description: '下肢筋力とバランスを同時に鍛える全身運動の王様です。日常生活の基本動作を向上させます。',
    instructions: [
      '足を肩幅より少し広めに開いて立ちます',
      'つま先はやや外側を向くようにします',
      '胸を張り、背筋を伸ばしたまま腰を下ろします',
      '太ももが床と平行になるまで下げます（膝が90度）',
      '膝がつま先より前に出ないよう注意します',
      'かかとで床を押すようにして立ち上がります',
      '10-15回を2-3セット実施しましょう',
      '呼吸は下ろす時に吸い、立ち上がる時に吐きます'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: 'ウォールスクワット',
    description: '壁を使った安全なスクワットで、正しいフォームを身につけます。',
    instructions: [
      '壁に背中を付けて立ちます',
      '足を肩幅に開き、壁から少し離れます',
      '背中を壁に付けたまま、ゆっくりと腰を下ろします',
      '太ももが床と平行になるまで下げます',
      '5秒間キープした後、ゆっくりと立ち上がります',
      '10回を2-3セット実施しましょう'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: 'シングルレッグスクワット',
    description: '片脚でのスクワットで、より高度なバランスと筋力を鍛えます。',
    instructions: [
      '片足で立ち、もう一方の足を前に伸ばします',
      '手を前に伸ばしてバランスを取ります',
      'ゆっくりと腰を下ろします（無理のない範囲で）',
      '元の姿勢に戻ります',
      '左右各5-10回を2セット実施しましょう',
      '不安定な場合は椅子の背もたれに手を置いて行います'
    ],
    illustration: '/images/sit.PNG'
  }
];

// バランス訓練の追加エクササイズ
export const balanceExercises: Exercise[] = [
  {
    name: 'タンデム立位',
    description: '片脚立位訓練の次のステップとして、より高度なバランス能力を養います。',
    instructions: [
      '壁の近くで安全を確保してください',
      '片足のつま先を、もう一方の足のかかとに触れるように配置します',
      '両足が一直線上に並ぶようにします',
      '両手を腰に当て、姿勢を安定させます',
      '20-30秒間キープを目標にします',
      '左右交互に実施し、毎日2-3セット行います'
    ],
    illustration: '/images/openeye.PNG'
  },
  {
    name: 'ヒールトゥウォーク',
    description: '踵からつま先の順で歩くことで、動的バランス能力を向上させます。',
    instructions: [
      'まっすぐな線を想像し、その上を歩きます',
      '踵からつま先の順で着地します',
      '次の足の踵が前の足のつま先に触れるように歩きます',
      '腕を横に広げてバランスを取ります',
      '10歩前進した後、後ろ向きに10歩戻ります',
      '毎日2-3セット実施しましょう'
    ],
    illustration: '/images/openeye.PNG'
  },
  {
    name: 'ステップアップ',
    description: '階段やステップを使った実用的なバランスと筋力訓練です。',
    instructions: [
      '安定したステップや階段の一段目に立ちます',
      '片足でステップに上がります',
      'ゆっくりと元の位置に戻ります',
      '左右交互に10回ずつ実施します',
      '慣れてきたら高さを上げて挑戦しましょう',
      '毎日2-3セット実施してください'
    ],
    illustration: '/images/openeye.PNG'
  }
];

// 体幹強化エクササイズ
export const coreExercises: Exercise[] = [
  {
    name: 'プランク',
    description: '体幹の深層筋を鍛え、腰痛予防と姿勢改善に効果的な運動です。',
    instructions: [
      'うつ伏せになり、肘とつま先で体を支えます',
      '肘は肩の真下に位置させます',
      '頭からかかとまで一直線を保ちます',
      'お腹に力を入れ、腰が反らないよう注意します',
      '30秒から1分間キープしましょう',
      '毎日2-3セット実施してください'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: 'サイドプランク',
    description: '体幹の側面を強化し、姿勢の改善と腰痛予防に効果的です。',
    instructions: [
      '横向きに寝て、肘で体を支えます',
      '体を一直線に保ちます',
      '腰が下がらないよう注意します',
      '15-30秒間キープします',
      '左右交互に実施し、毎日2セット行います'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: 'バードドッグ',
    description: '体幹の安定性と協調性を向上させる効果的な運動です。',
    instructions: [
      '四つん這いの姿勢を取ります',
      '右手と左足を同時に伸ばします',
      '5秒間キープした後、元の姿勢に戻ります',
      '左手と右足で同様に行います',
      '左右各10回を2セット実施しましょう'
    ],
    illustration: '/images/sit.PNG'
  }
];

// 柔軟性向上エクササイズ
export const flexibilityExercises: Exercise[] = [
  {
    name: '体幹回旋運動',
    description: '腰の柔軟性を向上させ、日常動作での腰痛を予防します。',
    instructions: [
      '椅子に座り、背筋を伸ばします',
      '両手を胸の前で組みます',
      '息を吐きながら、ゆっくりと体を右に回旋させます',
      '5秒間キープした後、ゆっくりと正面に戻します',
      '同様に左側も実施します',
      '左右各10回を2-3セット実施しましょう'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: 'ハムストリングストレッチ',
    description: '太もも裏の柔軟性を向上させ、腰痛予防と歩行改善に効果的です。',
    instructions: [
      '椅子に座り、片足を前に伸ばします',
      'つま先を天井に向けます',
      '背筋を伸ばしたまま、体を前に倒します',
      '太もも裏が伸びているのを感じます',
      '30秒間キープします',
      '左右交互に実施し、毎日2セット行います'
    ],
    illustration: '/images/sit.PNG'
  },
  {
    name: '股関節ストレッチ',
    description: '股関節の柔軟性を向上させ、歩行とバランス能力を改善します。',
    instructions: [
      '椅子に座り、片足の足首をもう一方の膝の上に置きます',
      '背筋を伸ばしたまま、ゆっくりと体を前に倒します',
      '股関節が伸びているのを感じます',
      '30秒間キープします',
      '左右交互に実施し、毎日2セット行います'
    ],
    illustration: '/images/sit.PNG'
  }
];

// リスクレベル別の推奨エクササイズ
export function getRecommendedExercises(fallRisk: 'low' | 'medium' | 'high' | null, lowBackPainRisk: 'low' | 'medium' | 'high' | null): Exercise[] {
  const exercises: Exercise[] = [];

  // 転倒リスクに基づくエクササイズ
  if (fallRisk === 'high') {
    exercises.push(...singleLegStandingVariations.slice(0, 2)); // 基本と閉眼
    exercises.push(...balanceExercises.slice(0, 2)); // タンデム立位とヒールトゥウォーク
  } else if (fallRisk === 'medium') {
    exercises.push(singleLegStandingVariations[0]); // 基本片脚立位
    exercises.push(balanceExercises[0]); // タンデム立位
  }

  // 腰痛リスクに基づくエクササイズ
  if (lowBackPainRisk === 'high') {
    exercises.push(...coreExercises); // 全ての体幹エクササイズ
    exercises.push(...flexibilityExercises); // 全ての柔軟性エクササイズ
  } else if (lowBackPainRisk === 'medium') {
    exercises.push(coreExercises[0]); // プランク
    exercises.push(...flexibilityExercises.slice(0, 2)); // 体幹回旋とハムストリング
  }

  // 基本的なスクワットは常に含める
  exercises.push(squatVariations[0]); // 基本スクワット

  return exercises;
}

// Export exercises object for easy access
export const exercises = {
  balance: {
    basicSingleLegStand: singleLegStandingVariations[0],
    closedEyeSingleLegStand: singleLegStandingVariations[1],
    dynamicSingleLegStand: singleLegStandingVariations[2],
    tandemStand: singleLegStandingVariations[3]
  },
  core: {
    basicPlank: coreExercises[0],
    sidePlank: coreExercises[1],
    birdDog: coreExercises[2],
    trunkRotation: coreExercises[3]
  },
  flexibility: {
    hamstringStretch: flexibilityExercises[0],
    hipStretch: flexibilityExercises[1]
  },
  strength: {
    basicSquat: squatVariations[0],
    wallSquat: squatVariations[1],
    singleLegSquat: squatVariations[2]
  }
};
