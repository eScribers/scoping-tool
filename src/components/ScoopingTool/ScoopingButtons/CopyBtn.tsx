import React, {useEffect, useState} from "react";
import useCopy from '@react-hook/copy';
import {TranscriptFileInterface} from "../../../store/types";
import {Button, message} from "antd";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

const CopyBtn = () => {
    const {transcriptFile} = rootStore.transcriptStore
    const [copyText, setCopyText] = useState<string>('')
    const {copy} = useCopy(copyText)

    useEffect(() => {
        const text: string = transcriptFile.reduce((acc: string, sentence: TranscriptFileInterface) => {
            let next = acc + sentence.Speaker + ':'
            const words = sentence.Text
            return next + words + '\n';
        }, "");
        setCopyText(text)
    }, [transcriptFile])

    const handleCopy = () => {
        copy().then(() => {
            message.success('text copied')
        })
    }

    return (
        <Button
            type='primary'
            onClick={handleCopy}
            className='save-btn'
        >
            Copy to Clipboard
        </Button>
    )
}

export default observer(CopyBtn)