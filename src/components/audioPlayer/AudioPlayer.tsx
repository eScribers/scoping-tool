import React, {FC, useState, useRef, useEffect, useCallback} from "react";
import PlayerControls from "./PlayerControls";
import rootStore from "../../store";


interface AudioPlayerProps {
    src: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({src}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const {audioStore} = rootStore

    useEffect(() => {
        if (!audioRef.current) return;

        // set playHead when audio is playing

        audioRef.current.ontimeupdate = () => {
            if (!audioRef.current) return;
            // console.log(Math.ceil(audioRef.current.currentTime))
            if(Math.ceil(audioStore.playHead) !== Math.ceil(audioRef.current.currentTime)){
                audioStore.setPlayHead(audioRef.current.currentTime);
            }
        };
    }, [audioRef.current]);

    const justFowardHandler = useCallback((time: number) => {
        if (!audioRef.current) return;
        const setTime = audioRef.current.currentTime + time;
        audioStore.setPlayHead(setTime);
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
