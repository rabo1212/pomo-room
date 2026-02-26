/**
 * 집중 배경음 (Web Audio API)
 * 비, 카페, 숲 3가지 + 볼륨 제어
 */

type AmbientType = 'rain' | 'cafe' | 'forest' | 'none';

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeTimers: ReturnType<typeof setTimeout>[] = [];
let currentType: AmbientType = 'none';

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function getMasterGain(): GainNode {
  getCtx();
  return masterGain!;
}

/** 타이머 등록 (정리 추적용) */
function scheduleTimer(fn: () => void, delay: number) {
  const id = setTimeout(() => {
    // 실행 후 목록에서 제거
    activeTimers = activeTimers.filter(t => t !== id);
    fn();
  }, delay);
  activeTimers.push(id);
}

/** 노이즈 버퍼 생성 */
function createNoiseBuffer(audioCtx: AudioContext, seconds: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate;
  const length = sampleRate * seconds;
  const buffer = audioCtx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/** 비 소리: 필터링된 핑크 노이즈 + 간헐적 방울 */
function startRain(audioCtx: AudioContext, dest: AudioNode) {
  const noise = audioCtx.createBufferSource();
  noise.buffer = createNoiseBuffer(audioCtx, 4);
  noise.loop = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 800;
  lpf.Q.value = 0.5;

  const hpf = audioCtx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 200;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.6;

  noise.connect(lpf).connect(hpf).connect(gain).connect(dest);
  noise.start();
  activeNodes.push(noise, lpf, hpf, gain);

  // 빗방울 간헐적 소리
  const drip = audioCtx.createBufferSource();
  drip.buffer = createNoiseBuffer(audioCtx, 4);
  drip.loop = true;

  const dripFilter = audioCtx.createBiquadFilter();
  dripFilter.type = 'bandpass';
  dripFilter.frequency.value = 2500;
  dripFilter.Q.value = 2;

  const dripGain = audioCtx.createGain();
  dripGain.gain.value = 0.15;

  drip.connect(dripFilter).connect(dripGain).connect(dest);
  drip.start();
  activeNodes.push(drip, dripFilter, dripGain);
}

/** 카페 소리: 넓은 대역 노이즈 + 은은한 잡음 */
function startCafe(audioCtx: AudioContext, dest: AudioNode) {
  const noise = audioCtx.createBufferSource();
  noise.buffer = createNoiseBuffer(audioCtx, 4);
  noise.loop = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = 3000;

  const hpf = audioCtx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = 100;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.35;

  noise.connect(lpf).connect(hpf).connect(gain).connect(dest);
  noise.start();
  activeNodes.push(noise, lpf, hpf, gain);

  // 저역 험 (에어컨/냉장고 같은 느낌)
  const hum = audioCtx.createOscillator();
  hum.type = 'sine';
  hum.frequency.value = 120;
  const humGain = audioCtx.createGain();
  humGain.gain.value = 0.03;
  hum.connect(humGain).connect(dest);
  hum.start();
  activeNodes.push(hum, humGain);
}

/** 숲 소리: 바람 노이즈 + 새 지저귐 오실레이터 */
function startForest(audioCtx: AudioContext, dest: AudioNode) {
  // 바람 소리
  const wind = audioCtx.createBufferSource();
  wind.buffer = createNoiseBuffer(audioCtx, 4);
  wind.loop = true;

  const windLpf = audioCtx.createBiquadFilter();
  windLpf.type = 'lowpass';
  windLpf.frequency.value = 600;

  const windGain = audioCtx.createGain();
  windGain.gain.value = 0.4;

  wind.connect(windLpf).connect(windGain).connect(dest);
  wind.start();
  activeNodes.push(wind, windLpf, windGain);

  // 새 소리 (고주파 사인파 트릴)
  const birdGain = audioCtx.createGain();
  birdGain.gain.value = 0.08;
  birdGain.connect(dest);
  activeNodes.push(birdGain);

  // 간헐적 새소리
  function chirp() {
    if (currentType !== 'forest') return;
    const a = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    const baseFreq = 2000 + Math.random() * 2000;
    osc.frequency.setValueAtTime(baseFreq, a);
    osc.frequency.linearRampToValueAtTime(baseFreq * 1.3, a + 0.05);
    osc.frequency.linearRampToValueAtTime(baseFreq * 0.9, a + 0.1);

    const env = audioCtx.createGain();
    env.gain.setValueAtTime(0, a);
    env.gain.linearRampToValueAtTime(1, a + 0.02);
    env.gain.linearRampToValueAtTime(0, a + 0.15);

    osc.connect(env).connect(birdGain);
    osc.start(a);
    osc.stop(a + 0.15);

    scheduleTimer(chirp, 2000 + Math.random() * 5000);
  }
  scheduleTimer(chirp, 1000);
}

/** 현재 재생 중인 사운드 정리 */
function stopAll() {
  // 모든 예약된 타이머 정리
  for (const id of activeTimers) {
    clearTimeout(id);
  }
  activeTimers = [];

  // 오디오 노드 정리
  for (const node of activeNodes) {
    try {
      if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
        (node as OscillatorNode).stop();
      }
      node.disconnect();
    } catch {
      // 이미 정리된 노드
    }
  }
  activeNodes = [];
  currentType = 'none';
}

/** 배경음 시작 */
export function startAmbient(type: AmbientType) {
  if (type === currentType) return;
  stopAll();
  if (type === 'none') return;

  const audioCtx = getCtx();
  const dest = getMasterGain();
  currentType = type;

  switch (type) {
    case 'rain': startRain(audioCtx, dest); break;
    case 'cafe': startCafe(audioCtx, dest); break;
    case 'forest': startForest(audioCtx, dest); break;
  }
}

/** 배경음 정지 */
export function stopAmbient() {
  stopAll();
}

/** 볼륨 설정 (0~1) */
export function setAmbientVolume(vol: number) {
  const gain = getMasterGain();
  gain.gain.setTargetAtTime(vol, getCtx().currentTime, 0.1);
}

/** 현재 타입 */
export function getCurrentAmbient(): AmbientType {
  return currentType;
}

export type { AmbientType };
