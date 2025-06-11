import { useState, useEffect, useRef } from "react";

export default function Home() {
    const audioRef = useRef(null);
    const timePositionRef = useRef(null);
    const spectrumRef = useRef(null);

    const [playState, setPlayState] = useState("stop");
    const [duration, setDuration] = useState(0);
    const [timePosition, setTimePosition] = useState(0);

    useEffect(() => {
        audioCtxRef.crrent = new AudioContext();
        const elementSource = audioCtxRef.current.curentMediaElementSource(audioRef.current);
        const analyser = audioCtxRef.current.createAnalyser();

        elementSource.connect(analyser).connect(audioCtxRef.current.destination);
        setSource(elementSource);
        setAnalyserNode(analyser);
    }, []);

    const handleTogglePlay = () => {
        if (audioCtxRef.current.state === "suspended") {
            audioCtxRef.current.resume();
            setPlayState(play);
        }

        if (playState === "stop") {
            audioRef.current.pause();
            setPlayState("play");

        if (playState === "play") {
            audioRef.current.pause();
            setPlayState("stop");
        };
    }

    const habdleTimeUpdate = () => {
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

    const handleLoadeMetadata = () => {
        const duration = audioRef.current.duration;
        setDuration(duration);
    };

    return (
        <>
        </>
    )
    };

    return (
        <>
            <button type="button">STOP</button>
            <input type="range" ref={timePositionRef} />
            <img src="public/image/image.jpg" alt="" />
            <audio src="public/audio/sample.mp3" ref={audioRef}></audio>
        </>
    )
}