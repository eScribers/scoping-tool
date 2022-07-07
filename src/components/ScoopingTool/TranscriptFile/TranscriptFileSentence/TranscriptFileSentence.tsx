import "./TranscriptFileSentence.scss"
import {Typography} from "antd";
import {observer} from "mobx-react-lite";
import rootStore from "../../../../store";
import React, {useEffect, useState, useRef} from "react";

const {Paragraph} = Typography

interface SentenceInterface {
    text: string,
    startTime: number,
    endTime: number,
    playHead: number,
    sIndex: number,
    isScrollLock: boolean
}

const TranscriptFileSentence = ({text, startTime, endTime, playHead, isScrollLock, sIndex}: SentenceInterface) => {
    const [isInTimeRange, setIsInTimeRange] = useState<boolean>(false)
    const {transcriptStore} = rootStore
    const refSentence = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setIsInTimeRange(startTime <= playHead && endTime >= playHead)
    }, [playHead])


    useEffect(() => {

        if (isInTimeRange && refSentence.current && !isScrollLock) {
            refSentence.current.scrollIntoView({
                block: 'center',
            });
        }
    }, [isInTimeRange])


    const onHandleStart = () => {
        transcriptStore.setIsScrollLock(true)
    }

    const handleChange = (v: string) => {
        if (transcriptStore.transcriptFile[sIndex].Text.trim() !== v.trim()) {
            const updateData = [...transcriptStore.transcriptFile]
            updateData[sIndex].Text = v
            transcriptStore.setTranscriptFile(updateData)
        }

        transcriptStore.setIsScrollLock(false)
    }

    const handleMouseUp =() => {
        const selectionText = window.getSelection()?.toString()
        if(selectionText){
            transcriptStore.setSplitTextParams(selectionText,sIndex)
        }
    }

    console.log('render')

    return (
        <div ref={refSentence} onMouseUp={handleMouseUp}>
            <Paragraph
                editable={{
                    onStart: onHandleStart,
                    onChange: handleChange,
                    triggerType: ['text'],
                    enterIcon: null
                }}
                className={`sentence-block ${isInTimeRange ? '_current' : null}`}

            >
                {text}
            </Paragraph>
        </div>

    )
}

export default React.memo(observer(TranscriptFileSentence),
    (prev, next) => {
        if (prev.text !== next.text) {
            return false
        }

        if (next.startTime <= prev.playHead && next.endTime >= prev.playHead) {
            return false
        }
        if (next.startTime <= next.playHead && next.endTime >= next.playHead) {
            return false
        }

        return true
    })