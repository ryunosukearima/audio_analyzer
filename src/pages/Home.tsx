// 
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [playState, setPlayState] = useState<'stop' | 'play'>('stop');
  const [duration, setDuration] = useState(0);
  const [timePosition, setTimePosition] = useState(0);
  const [source, setSource] = useState<MediaElementAudioSourceNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const spectrumRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // すでにAudioContextやSourceが存在していたら何もしない
    if (!audioRef.current) return;
    if (audioCtxRef.current || source) return;

    const ctx = new AudioContext();
    const elementSource = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    elementSource.connect(analyser).connect(ctx.destination);
    audioCtxRef.current = ctx;
    setSource(elementSource);
    setAnalyserNode(analyser);

    // クリーンアップ
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSource(null);
      setAnalyserNode(null);
    };
    // eslint-disable-next-line
  }, []); // 初回のみ

  useEffect(() => {
    if (!source || !analyserNode || playState !== 'play' || !spectrumRef.current) return;
    const canvas = spectrumRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    analyserNode.fftSize = 16384;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = 1;

    let animationId: number;

    function renderFrame() {
      animationId = requestAnimationFrame(renderFrame);
      analyserNode.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      let bars = 128;
      let x = 0;
      for (let i = 0; i < bars; i++) {
        const barHeight = dataArray[i];
        canvasCtx.fillStyle = `rgba(0, 255, 0, ${barHeight / 256})`;
        canvasCtx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
        x += barWidth + (canvasWidth / 128);
      }
    }
    renderFrame();
    return () => cancelAnimationFrame(animationId);
  }, [playState, source, analyserNode]);

  const handleTogglePlay = () => {
    if (!audioRef.current || !audioCtxRef.current) return;
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (playState === 'stop') {
      audioRef.current.play();
      setPlayState('play');
    } else {
      audioRef.current.pause();
      setPlayState('stop');
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setTimePosition(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    setTimePosition(0);
    setPlayState('stop');
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleChangeTimePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseInt(e.target.value);
    setTimePosition(position);
    if (audioRef.current) audioRef.current.currentTime = position;
  };

  return (
    <>
      <button type="button" onClick={handleTogglePlay}>
        {playState === 'stop' ? '開始' : '停止'}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        value={timePosition}
        onChange={handleChangeTimePosition}
        step={1}
      />
      <audio
        src="/audio/FIRST_LOVE_SONG.mp3"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <canvas className="spectrums" ref={spectrumRef} />
    </>
  );
}