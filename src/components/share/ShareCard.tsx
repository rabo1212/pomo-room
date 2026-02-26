'use client';

import { useRef, useEffect } from 'react';
import { useStatsStore } from '@/stores/statsStore';
import { showToast } from '@/components/ui/Toast';
import { localDateKey } from '@/lib/utils';

interface ShareCardProps {
  onClose: () => void;
}

/** roundRect 폴리필 (Safari < 17.4 대응) */
function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export default function ShareCard({ onClose }: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dailyRecords = useStatsStore((s) => s.dailyRecords);
  const today = dailyRecords[localDateKey()] || { count: 0, minutes: 0 };

  // 스트릭 계산
  let streak = 0;
  const d = new Date();
  if (!dailyRecords[localDateKey()]) d.setDate(d.getDate() - 1);
  while (true) {
    const key = localDateKey(d);
    if (dailyRecords[key]?.count > 0) { streak++; d.setDate(d.getDate() - 1); }
    else break;
  }

  // useEffect로 안정적으로 캔버스 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 600, h = 340;
    canvas.width = w;
    canvas.height = h;

    // 배경 그라디언트
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#FFF8F0');
    grad.addColorStop(1, '#FFE4D6');
    ctx.fillStyle = grad;
    drawRoundRect(ctx, 0, 0, w, h, 20);
    ctx.fill();

    // 테두리
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    drawRoundRect(ctx, 4, 4, w - 8, h - 8, 18);
    ctx.stroke();

    // 토마토 아이콘
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🍅', w / 2, 60);

    // 타이틀
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#FF6B6B';
    ctx.fillText('Pomo Room', w / 2, 100);

    // 오늘 뽀모도로
    ctx.font = 'bold 52px sans-serif';
    ctx.fillStyle = '#3D3D3D';
    ctx.fillText(`${today.count}`, w / 2, 170);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#9A87B3';
    ctx.fillText('오늘 뽀모도로 완료', w / 2, 198);

    // 통계 카드들
    const cards = [
      { icon: '⏱️', value: `${today.minutes}분`, label: '집중 시간' },
      { icon: '🔥', value: `${streak}일`, label: '연속 달성' },
    ];

    cards.forEach((card, i) => {
      const cx = w / 2 + (i - 0.5) * 160;
      const cy = 252;
      // 카드 배경
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(ctx, cx - 65, cy - 30, 130, 65, 12);
      ctx.fill();

      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.icon, cx, cy - 5);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#3D3D3D';
      ctx.fillText(card.value, cx, cy + 18);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#9A87B3';
      ctx.fillText(card.label, cx, cy + 32);
    });

    // 날짜
    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#B8A9C9';
    ctx.textAlign = 'center';
    ctx.fillText(dateStr, w / 2, h - 16);
  }, [today, streak]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `pomo-room-${localDateKey()}.png`;
    a.click();
    showToast('이미지 저장 완료! 📸');
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `pomo-room-${localDateKey()}.png`, { type: 'image/png' });

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Pomo Room',
            text: `오늘 ${today.count}개 뽀모도로 완료! 🍅`,
            files: [file],
          });
        } catch {
          // 사용자가 공유 취소
        }
      } else {
        handleDownload();
      }
    });
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="modal-content clay bg-cream w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-[family-name:var(--font-fredoka)] text-coral">
            📸 공유 카드
          </h2>
          <button onClick={onClose} className="clay-button w-8 h-8 flex items-center justify-center text-sm">
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-4 overflow-hidden rounded-xl">
          <canvas ref={canvasRef} className="w-full max-w-[300px] h-auto rounded-xl" style={{ imageRendering: 'auto' }} role="img" aria-label="오늘의 뽀모도로 통계 공유 카드" />
        </div>

        <div className="flex gap-3">
          <button onClick={handleDownload} className="clay-button flex-1 py-3 text-sm text-lavender-dark">
            💾 저장
          </button>
          <button onClick={handleShare} className="clay-button flex-1 py-3 text-sm font-bold bg-coral text-white">
            📤 공유
          </button>
        </div>
      </div>
    </div>
  );
}
