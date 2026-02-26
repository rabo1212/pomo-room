'use client';

import { useState, useEffect } from 'react';
import { useTimerStore } from '@/stores/timerStore';
import { showToast } from '@/components/ui/Toast';

interface TimerSettingsProps {
  onClose: () => void;
}

function DurationSlider({
  label,
  icon,
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
}) {
  const minutes = Math.round(value / 60);

  return (
    <div className="clay p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-lavender-dark">
          {icon} {label}
        </span>
        <span className={`text-lg font-bold font-[family-name:var(--font-fredoka)] ${color}`}>
          {minutes}분
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-coral) 0%, var(--color-coral) ${((value - min) / (max - min)) * 100}%, #E8DDD0 ${((value - min) / (max - min)) * 100}%, #E8DDD0 100%)`,
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-lavender-dark/50">{Math.round(min / 60)}분</span>
        <span className="text-[10px] text-lavender-dark/50">{Math.round(max / 60)}분</span>
      </div>
    </div>
  );
}

export default function TimerSettings({ onClose }: TimerSettingsProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const settings = useTimerStore((s) => s.settings);
  const setSettings = useTimerStore((s) => s.setSettings);
  const status = useTimerStore((s) => s.status);

  const [focus, setFocus] = useState(settings.focusDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreakDuration);
  const [longBreak, setLongBreak] = useState(settings.longBreakDuration);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('pomo-sound') !== 'off';
  });

  const hasChanges =
    focus !== settings.focusDuration ||
    shortBreak !== settings.shortBreakDuration ||
    longBreak !== settings.longBreakDuration;

  const handleSave = () => {
    setSettings({
      focusDuration: focus,
      shortBreakDuration: shortBreak,
      longBreakDuration: longBreak,
    });
    showToast('설정이 저장되었어요! ✅');
    onClose();
  };

  const handleReset = () => {
    setFocus(25 * 60);
    setShortBreak(5 * 60);
    setLongBreak(15 * 60);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('pomo-sound', next ? 'on' : 'off');
    // 전역 사운드 상태 동기화
    window.dispatchEvent(new CustomEvent('pomo-sound-toggle', { detail: next }));
    showToast(next ? '사운드 켜짐 🔊' : '사운드 꺼짐 🔇');
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="modal-content clay bg-cream w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold font-[family-name:var(--font-fredoka)] text-coral">
            ⚙️ 설정
          </h2>
          <button
            onClick={onClose}
            className="clay-button w-8 h-8 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {status !== 'idle' && (
          <div className="bg-gold/10 text-gold-dark text-xs rounded-xl p-3 mb-4 text-center">
            ⚠️ 타이머 실행 중에는 다음 세션부터 적용돼요
          </div>
        )}

        {/* Sound Toggle */}
        <div className="clay p-4 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-lavender-dark">
              🔔 효과음
            </span>
            <button
              onClick={toggleSound}
              className={`clay-button w-14 h-8 rounded-full relative transition-colors ${
                soundEnabled ? 'bg-mint/30' : 'bg-cream-dark'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all ${
                soundEnabled ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <DurationSlider
            label="집중 시간"
            icon="🍅"
            value={focus}
            min={5 * 60}
            max={60 * 60}
            step={5 * 60}
            color="text-coral"
            onChange={setFocus}
          />
          <DurationSlider
            label="짧은 휴식"
            icon="☕"
            value={shortBreak}
            min={1 * 60}
            max={15 * 60}
            step={1 * 60}
            color="text-mint-dark"
            onChange={setShortBreak}
          />
          <DurationSlider
            label="긴 휴식"
            icon="🌙"
            value={longBreak}
            min={5 * 60}
            max={30 * 60}
            step={5 * 60}
            color="text-lavender-dark"
            onChange={setLongBreak}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleReset}
            className="clay-button flex-1 py-3 text-sm text-lavender-dark"
          >
            기본값
          </button>
          <button
            onClick={handleSave}
            className={`clay-button flex-1 py-3 text-sm font-bold ${
              hasChanges
                ? 'bg-coral text-white'
                : 'text-lavender-dark/50'
            }`}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
