'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  {
    icon: '🍅',
    title: 'Pomo Room에 오신 걸 환영해요!',
    description: '집중하고, 코인 모으고, 나만의 방을 꾸며보세요.',
  },
  {
    icon: '⏱️',
    title: '뽀모도로 타이머',
    description: '25분 집중 + 5분 휴식. 시작 버튼을 눌러 집중을 시작하세요!\nSpace 키로도 시작/일시정지할 수 있어요.',
  },
  {
    icon: '🪙',
    title: '코인 & 상점',
    description: '뽀모도로를 완료하면 코인을 받아요.\n상점에서 가구, 식물, 고양이를 구매해 방을 꾸며보세요!',
  },
  {
    icon: '🏠',
    title: '나만의 방',
    description: '아이템을 드래그해서 원하는 위치에 배치하세요.\n방을 공개하면 다른 사람들이 구경할 수 있어요!',
  },
];

export default function OnboardingGuide() {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('pomo-onboarding');
    if (!done) setShow(true);
  }, []);

  if (!show) return null;

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('pomo-onboarding', 'done');
      setShow(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('pomo-onboarding', 'done');
    setShow(false);
  };

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4" onClick={handleSkip}>
      <div
        className="clay bg-cream w-full max-w-xs p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">{current.icon}</div>
        <h3 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral mb-2">
          {current.title}
        </h3>
        <p className="text-sm text-lavender-dark whitespace-pre-line leading-relaxed mb-5">
          {current.description}
        </p>

        {/* 진행 표시 */}
        <div className="flex justify-center gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-coral' : 'bg-cream-dark'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="clay-button flex-1 py-2.5 text-sm text-lavender-dark/50"
          >
            건너뛰기
          </button>
          <button
            onClick={handleNext}
            className="clay-button flex-1 py-2.5 text-sm font-bold bg-coral text-white"
          >
            {step < STEPS.length - 1 ? '다음' : '시작하기!'}
          </button>
        </div>
      </div>
    </div>
  );
}
