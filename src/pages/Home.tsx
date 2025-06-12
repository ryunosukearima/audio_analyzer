import { useState, useEffect, useRef } from "react";

export default function Home() {
    const [playState, setPlayState] = useState("stop");
    const [duration, setDuration] = useState(0);
    const [timePosition, setTimePosition] = useState(0);
    const [source, setSource] = useState(null);
    const [analyserNode, setAnalyserNode] = useState(null);
    const audioRef = useRef(null);
    const audioCtxRef = useRef(null);
    const timePositionRef = useRef(null);
    const spectrumRef = useRef(null);

    useEffect(() => {
        audioCtxRef.current = new AudioContext();
        const elementSource = audioCtxRef.current.createMediaElementSource(audioRef.current);
        const analyser = audioCtxRef.current.createAnalyser();
        elementSource.connect(analyser).connect(audioCtxRef.current.destination);
        setSource(elementSource);
        setAnalyserNode(analyser);
    }, []);

    useEffect(() => {
        if (source && analyzerNode && playSate === "play") {
            const canvas = spectrumRef.current;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const canvasCtx = canvas.getContext;
            AnalyserNode.fftSize = 16384;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const bufferLength = analyzerNode.frequencyBinCount;
            const dataArray = new Unit8Array(bufferLength);
            const barWidth = 1;
            
            let barHeight;
            let x = 0;

            function renderFrame() {
                requestAnimationFrame(renderFrame);

                x = 0;

                analyserNode.getByteFrequencyData(dataArray);
                canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
                // バーの数
                let bars = 128; 

                for (let i = 0; i < bars; i++) {
                    barHeight = (dataArray[i]);

                    // バーの高さに合わせて色が変わる
                    canvasCtx.fillStyle = `rgba(0, 255, 0, ${barHeight / 256})`;
                    canvasCtx.fillRect(x, (canvasHeight - barHeight), barWidth, barHeight);
                    x += barWidth + (canvasWidth / 128);
                }
            }
            renderFrame();
        }
    },[playState]);

    const handleTogglePlay = () => {
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
            setPlayState("play");
        }

        if (playState === "stop") {
            audioRef.current.pause();
            setPlayState("play");
        }

        if (playState === "play") {
            audioRef.current.pause();
            setPlayState("stop");
        }
    };

    const handleTimeUpdate = () => {
        setTimePosition(audioRef.current.currentTime);
    };

    const handleChangeTimePosition = (e) => {
        const position = parseInt(e.target.value);
        setTimePosition(position);
        audioRef.current.currentTime = position;
    };

    const handleEnded = () => {
        setTimePosition(0);
        setPlayState("stop");
    };

    const handleLoadedMetadata = () => {
        const duration = audioRef.current.duration;
        setDuration(duration);
    };

    return (
        <>
            <button type="button" onClick={handleTogglePlay}>
                {playState === "stop" && "開始"}
                {playState === "play" && "停止"}
            </button>
            <input type="range"
            min={0}
            max={duration}
            value={timePosition}
            onInput={handleChangeTimePosition}/>
            <img src="../assets/image/Temari.jpg" alt="" />
            <audio src="../assets/audio/FIRST_LOVE_SONG.mp3" ref={audioRef}
            onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleEnded}>  
            </audio>
            <canvas className="spectrums w-full h-full" ref={spectrumRef}></canvas>
        </>
    )
}