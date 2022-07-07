import "./TranscriptFileSentence.scss"
import {Typography} from "antd";
import {observer} from "mobx-react-lite";
import rootStore from "../../../../store";
import React, {useEffect, useState, useRef} from "react";
import ContentEditable from 'react-contenteditable'
import _ from "lodash"

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
    const {transcriptStore, splitTextStore} = rootStore
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
            const updateData = _.cloneDeep(transcriptStore.transcriptFile)
            updateData[sIndex].Text = v
            transcriptStore.setTranscriptFile(updateData)
        }

        transcriptStore.setIsScrollLock(false)
    }

    const handleMouseUp = () => {
        const selectionText = window.getSelection()?.toString()
        let start = window.getSelection()?.getRangeAt(0)?.startOffset
        let end = window.getSelection()?.getRangeAt(0)?.endOffset

        console.log(selectionText)

        if (selectionText) {
            splitTextStore.setSplitTextParams({
                text: selectionText,
                sIndex: sIndex,
                start: start ? start : 0,
                end: end ? end : 0
            })
        }
    }

    console.log('render')

    return (
        <div ref={refSentence} className={isInTimeRange ? 'sentence-block-highlight' : ''}>
            {/*<Paragraph*/}
            {/*    editable={{*/}
            {/*        onStart: onHandleStart,*/}
            {/*        onChange: handleChange,*/}
            {/*        triggerType: ['text'],*/}
            {/*        enterIcon: null*/}
            {/*    }}*/}
            {/*    className={`sentence-block ${isInTimeRange ? '_current' : null}`}*/}

            {/*>*/}
            {/*    {text}*/}
            {/*</Paragraph>*/}
            <ContentEditable
                onChange={(e)=>{}}
                onBlur={(e)=>handleChange(e.target.innerText)}
                className={`sentence-block`}
                html={text}
                onMouseUp={handleMouseUp}
            />
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