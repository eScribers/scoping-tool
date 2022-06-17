import React, {FC, useState, useRef, useEffect, useCallback} from "react";
import PlayerControls from "./PlayerControls";


interface AudioPlayerProps {
    src: string;
    setPlayHead: (value: number) => void
}

const AudioPlayer: FC<AudioPlayerProps> = ({src, setPlayHead}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        // set playHead when audio is playing
        audioRef.current.addEventListener("timeupdate", () => {
            if (!audioRef.current) return;
            setPlayHead(audioRef.current.currentTime);
        });
    }, [audioRef.current]);

    const justFowardHandler = useCallback((time: number) => {
        if (!audioRef.current) return;
        const setTime = audioRef.current.currentTime + time;
        setPlayHead(setTime);
        audioRef.current.currentTime = setTime;
    }, [audioRef.current]);


    return (
        <div>
            <div style={{display: 'none'}}>
                <div className="player">
                    <audio controls src={src} ref={audioRef}/>
                </div>
            </div>
            <PlayerControls justFowardHandler={justFowardHandler} audioRef={audioRef}/>
        </div>
    );
};

export default AudioPlayer
