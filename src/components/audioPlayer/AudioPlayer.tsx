import React, {FC, useRef, useEffect} from "react";
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

        audioStore.setAudioRef(audioRef.current)

        audioRef.current.ontimeupdate = () => {
            if (!audioRef.current) return;
            if (Math.ceil(audioStore.playHead) !== Math.ceil(audioRef.current.currentTime)) {
                audioStore.setPlayHead(audioRef.current.currentTime);
            }
        };
    }, [audioRef.current]);


    return (
        <div>
            <div style={{display: 'none'}}>
                <div className="player">
                    <audio controls src={src} ref={audioRef}/>
                </div>
            </div>
            <PlayerControls/>
        </div>
    );
};

export default AudioPlayer
