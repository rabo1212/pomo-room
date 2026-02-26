/**
 * 집중 배경음 (Web Audio API)
 * 비, 카페, 숲 3가지 + 볼륨 제어
 */

type AmbientType = 'rain' | 'cafe' | 'forest' | 'none';

// 오디오 파라미터 상수
const MASTER_VOLUME = 0.3;
const NOISE_BUFFER_SEC = 4;

const RAIN = { LPF: 800, LPF_Q: 0.5, HPF: 200, GAIN: 0.6, DRIP_FREQ: 2500, DRIP_Q: 2, DRIP_GAIN: 0.15 } as const;
const CAFE = { LPF: 3000, HPF: 100, GAIN: 0.35, HUM_FREQ: 120, HUM_GAIN: 0.03 } as const;
const FOREST = { WIND_LPF: 600, WIND_GAIN: 0.4, BIRD_GAIN: 0.08, BIRD_BASE: 2000, BIRD_RANGE: 2000, CHIRP_MIN: 2000, CHIRP_RANGE: 5000, CHIRP_INITIAL: 1000 } as const;

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: AudioNode[] = [];
let activeTimers: ReturnType<typeof setTimeout>[] = [];
let currentType: AmbientType = 'none';

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = MASTER_VOLUME;
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
  noise.buffer = createNoiseBuffer(audioCtx, NOISE_BUFFER_SEC);
  noise.loop = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = RAIN.LPF;
  lpf.Q.value = RAIN.LPF_Q;

  const hpf = audioCtx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = RAIN.HPF;

  const gain = audioCtx.createGain();
  gain.gain.value = RAIN.GAIN;

  noise.connect(lpf).connect(hpf).connect(gain).connect(dest);
  noise.start();
  activeNodes.push(noise, lpf, hpf, gain);

  const drip = audioCtx.createBufferSource();
  drip.buffer = createNoiseBuffer(audioCtx, NOISE_BUFFER_SEC);
  drip.loop = true;

  const dripFilter = audioCtx.createBiquadFilter();
  dripFilter.type = 'bandpass';
  dripFilter.frequency.value = RAIN.DRIP_FREQ;
  dripFilter.Q.value = RAIN.DRIP_Q;

  const dripGain = audioCtx.createGain();
  dripGain.gain.value = RAIN.DRIP_GAIN;

  drip.connect(dripFilter).connect(dripGain).connect(dest);
  drip.start();
  activeNodes.push(drip, dripFilter, dripGain);
}

/** 카페 소리: 넓은 대역 노이즈 + 은은한 잡음 */
function startCafe(audioCtx: AudioContext, dest: AudioNode) {
  const noise = audioCtx.createBufferSource();
  noise.buffer = createNoiseBuffer(audioCtx, NOISE_BUFFER_SEC);
  noise.loop = true;

  const lpf = audioCtx.createBiquadFilter();
  lpf.type = 'lowpass';
  lpf.frequency.value = CAFE.LPF;

  const hpf = audioCtx.createBiquadFilter();
  hpf.type = 'highpass';
  hpf.frequency.value = CAFE.HPF;

  const gain = audioCtx.createGain();
  gain.gain.value = CAFE.GAIN;

  noise.connect(lpf).connect(hpf).connect(gain).connect(dest);
  noise.start();
  activeNodes.push(noise, lpf, hpf, gain);

  const hum = audioCtx.createOscillator();
  hum.type = 'sine';
  hum.frequency.value = CAFE.HUM_FREQ;
  const humGain = audioCtx.createGain();
  humGain.gain.value = CAFE.HUM_GAIN;
  hum.connect(humGain).connect(dest);
  hum.start();
  activeNodes.push(hum, humGain);
}

/** 숲 소리: 바람 노이즈 + 새 지저귐 오실레이터 */
function startForest(audioCtx: AudioContext, dest: AudioNode) {
  const wind = audioCtx.createBufferSource();
  wind.buffer = createNoiseBuffer(audioCtx, NOISE_BUFFER_SEC);
  wind.loop = true;

  const windLpf = audioCtx.createBiquadFilter();
  windLpf.type = 'lowpass';
  windLpf.frequency.value = FOREST.WIND_LPF;

  const windGain = audioCtx.createGain();
  windGain.gain.value = FOREST.WIND_GAIN;

  wind.connect(windLpf).connect(windGain).connect(dest);
  wind.start();
  activeNodes.push(wind, windLpf, windGain);

  const birdGain = audioCtx.createGain();
  birdGain.gain.value = FOREST.BIRD_GAIN;
  birdGain.connect(dest);
  activeNodes.push(birdGain);

  function chirp() {
    if (currentType !== 'forest') return;
    const a = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    const baseFreq = FOREST.BIRD_BASE + Math.random() * FOREST.BIRD_RANGE;
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

    scheduleTimer(chirp, FOREST.CHIRP_MIN + Math.random() * FOREST.CHIRP_RANGE);
  }
  scheduleTimer(chirp, FOREST.CHIRP_INITIAL);
}

/** 현재 재생 중인 사운드 정리 */
function stopAll() {
  for (const id of activeTimers) {
    clearTimeout(id);
  }
  activeTimers = [];

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
