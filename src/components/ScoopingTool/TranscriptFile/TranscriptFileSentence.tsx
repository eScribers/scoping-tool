import {Typography} from "antd";
import {observer} from "mobx-react-lite";
import rootStore from "../../../store";
import React, {useEffect, useState} from "react";

const {Paragraph} = Typography

interface SentenceInterface {
    text: string,
    startTime: number,
    endTime: number,
    playHead: number,
    sIndex: number
}

const TranscriptFileSentence = ({text, startTime, endTime, playHead, sIndex}: SentenceInterface) => {
    const [isInTimeRange, setIsInTimeRange] = useState<boolean>(false)
    const {transcriptStore} = rootStore

    useEffect(() => {
        // setIsInTimeRange(startTime <= playHead)
        console.log(playHead)
    }, [playHead])

    const handleChange = (v: string) => {
        const updateData = [...transcriptStore.transcriptFile]
        updateData[sIndex].Text = v
        transcriptStore.setTranscriptFile(updateData)
    }

    return (
        <Paragraph
            editable={{
                onChange: handleChange
            }}
            style={isInTimeRange ? {background: 'yellow'} : {}}
        >
            {text}
        </Paragraph>
    )
}

export default React.memo(
    observer(TranscriptFileSentence),
    (prevProps, nextProps) => {
        if (prevProps.text !== nextProps.text) {
            return false
        }
        if (nextProps.startTime <= nextProps.playHead) {
            return false
        }
        return true
    })