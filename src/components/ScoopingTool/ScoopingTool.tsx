import {useRef, useState} from "react";

import TranscriptFile from "./TranscriptFile/TranscriptFile";
import AudioPlayer from "../audioPlayer/AudioPlayer";


const ScoopingTool = () => {
    const [playHead, setPlayHead] = useState<number>(0);

    return (
        <>
            <AudioPlayer src="/audioFiles/test.mp3" setPlayHead={setPlayHead}/>
            <TranscriptFile playHead={playHead}/>
        </>
    )
}

export default ScoopingTool