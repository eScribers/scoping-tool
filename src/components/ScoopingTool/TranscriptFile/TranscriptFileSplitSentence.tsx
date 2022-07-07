import React from "react";
import {Button} from "antd";
import {TranscriptFileInterface} from "../../../store/types";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import _ from "lodash"

interface SplitSentenceInterface {
    sIndex: number,
    splitText: string,
    splitTextIndex: number | null,
    splitTextStart: number,
    splitTextEnd: number
}

const TranscriptFileSplitSentence = ({
                                         sIndex,
                                         splitText,
                                         splitTextIndex,
                                         splitTextStart,
                                         splitTextEnd
                                     }: SplitSentenceInterface) => {
    const {splitTextStore, transcriptStore} = rootStore

    const handleSplitBefore = (updateData: TranscriptFileInterface[], newSentence: TranscriptFileInterface) => {
        updateData.splice(Number(splitTextIndex), 0, newSentence)
        return updateData
    }
    const handleSplitCenter = (updateData: TranscriptFileInterface[], middleSentence: TranscriptFileInterface) => {
        if (!splitTextIndex) return updateData

        const sentencesArray = updateData[splitTextIndex].Text.split(splitText)
        const firstSentence = {...middleSentence, Text: sentencesArray[0]}
        const lastSentence = {...middleSentence, Text: sentencesArray[1]}

        updateData.splice(Number(splitTextIndex), 1, firstSentence, middleSentence, lastSentence)

        return updateData
    }
    const handleSplitAfter = (updateData: TranscriptFileInterface[], newSentence: TranscriptFileInterface) => {
        updateData.splice(Number(splitTextIndex) + 1, 0, newSentence)
        return updateData
    }

    const handleSplit = () => {
        if (splitTextIndex === null) return false;
        const newSentence: TranscriptFileInterface = {
            Sentenceindex: transcriptStore.transcriptFile[splitTextIndex].Sentenceindex,
            currSpeakerIndex: transcriptStore.transcriptFile[splitTextIndex].currSpeakerIndex,
            Speaker: transcriptStore.transcriptFile[splitTextIndex].Speaker,
            Text: splitText,
            StartTime: transcriptStore.transcriptFile[splitTextIndex].StartTime,
            EndTime: transcriptStore.transcriptFile[splitTextIndex].EndTime
        }
        const defaultTextLength = transcriptStore.transcriptFile[splitTextIndex].Text.trim().length
        let updateData = _.cloneDeep(transcriptStore.transcriptFile)
        if (splitTextStart === 0 || splitTextEnd >= defaultTextLength) {
            updateData[splitTextIndex].Text = updateData[splitTextIndex].Text.replace(splitText, '')
        }

        if (splitTextStart === 0) {
            updateData = handleSplitBefore(updateData, newSentence)
        }

        if (splitTextEnd >= defaultTextLength) {
            updateData = handleSplitAfter(updateData, newSentence)
        }

        if (splitTextStart > 0 && splitTextEnd < defaultTextLength) {
            updateData = handleSplitCenter(updateData, newSentence)
        }


        transcriptStore.setTranscriptFile(updateData)
        splitTextStore.setSplitTextParams({
            text: '',
            sIndex: null,
            start: 0,
            end: 0
        })
    }

    return (
        <Button
            onClick={handleSplit}
            disabled={splitTextIndex !== sIndex}
        >
            Split Sentence
        </Button>
    )
}

export default React.memo(observer(TranscriptFileSplitSentence), (prev, next) => {
    if (next.sIndex === prev.splitTextIndex) {
        return false
    }
    if (next.sIndex === next.splitTextIndex) {
        return false
    }

    return true
})