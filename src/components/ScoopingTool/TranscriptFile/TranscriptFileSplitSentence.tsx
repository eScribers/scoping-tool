import React from "react";
import {Button} from "antd";
import {TranscriptFileInterface} from "../../../store/types";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

interface SplitSentenceInterface {
    sIndex: number,
    splitText: string,
    splitTextId: number | null,
    speakerName: string
}

const TranscriptFileSplitSentence = ({sIndex, splitText, splitTextId, speakerName}: SplitSentenceInterface) => {
    const {transcriptStore} = rootStore
    const handleSplit = () => {
        if (splitTextId === null) return false;
        const newSentence: TranscriptFileInterface = {
            Sentenceindex: sIndex + 1,
            currSpeakerIndex: sIndex + 1,
            Speaker: speakerName,
            Text: splitText,
            StartTime: '',
            EndTime: ''
        }
        const updateData = [...transcriptStore.transcriptFile]
        updateData[splitTextId].Text = updateData[splitTextId].Text.replace(splitText, '')
        updateData.splice(sIndex + 1, 0, newSentence)
        transcriptStore.setTranscriptFile(updateData)
        transcriptStore.setSplitTextParams('', null)
    }

    return (
        <Button
            onClick={handleSplit}
            disabled={splitTextId !== sIndex}
        >
            Split Sentence
        </Button>
    )
}

export default React.memo(observer(TranscriptFileSplitSentence), (prev, next) => {
    if (next.sIndex === prev.splitTextId) {
        return false
    }
    if (next.sIndex === next.splitTextId) {
        return false
    }

    return true
})