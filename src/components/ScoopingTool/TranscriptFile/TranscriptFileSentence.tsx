import {Typography} from "antd";
import {observer} from "mobx-react-lite";
import rootStore from "../../../store";
import React, {useEffect, useState, useRef} from "react";

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
    const {isScrollLock} = transcriptStore
    const refSentence = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsInTimeRange(startTime <= playHead && endTime >= playHead)
        console.log(playHead)
    }, [playHead])

    useEffect(() => {
        if (isInTimeRange && refSentence.current && !isScrollLock) {

            refSentence.current.scrollIntoView({
                block: 'center',
            });
            console.log('render', isInTimeRange)
        }


    }, [isInTimeRange])

    const onHandleStart = () => {
        transcriptStore.setIsScrollLock(true)
    }

    const handleChange = (v: string) => {
        if (transcriptStore.transcriptFile[sIndex].Text !== v) {
            const updateData = [...transcriptStore.transcriptFile]
            updateData[sIndex].Text = v
            transcriptStore.sendFile(updateData)
        }

        transcriptStore.setIsScrollLock(false)
    }

    return (
        <Paragraph
            editable={{
                onStart: onHandleStart,
                onChange: handleChange
            }}
            style={isInTimeRange ? {background: 'yellow'} : {}}
            ref={refSentence}
        >
            {text}
        </Paragraph>
    )
}

export default observer(TranscriptFileSentence)