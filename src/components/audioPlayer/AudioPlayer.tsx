import React, {FC, useState, useRef, useEffect, useCallback} from "react";
import PlayerControls from "./PlayerControls";
import audioParams from "../../store";


interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({src}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        // set playHead when audio is playing
        audioRef.current.addEventListener("timeupdate", () => {
            if (!audioRef.current) return;
            audioParams.setPlayHead(audioRef.current.currentTime);
        });
    }, [audioRef.current]);

    const justFowardHandler = useCallback((time: number) => {
        if (!audioRef.current) return;
        const setTime = audioRef.current.currentTime + time;
        audioParams.setPlayHead(setTime);
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
