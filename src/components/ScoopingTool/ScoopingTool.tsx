import {useRef, useState} from "react";

import TranscriptFile from "./TranscriptFile/TranscriptFile";
import AudioPlayer from "../audioPlayer/AudioPlayer";


const ScoopingTool = () => {

    return (
        <>
            <AudioPlayer src="/audioFiles/test.mp3" />
            <TranscriptFile />
        </>
    )
}

export default ScoopingTool