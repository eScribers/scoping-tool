import React, {FC, useEffect, useState} from "react";
import useCopy from '@react-hook/copy';
import {SentenceInterface, WordInterface} from "../types";
import {Button, message} from "antd";


interface CopyBtnInterface {
    transcriptFile: SentenceInterface[]
}

const CopyBtn: FC<CopyBtnInterface> = ({transcriptFile}) => {
    const [copyText, setCopyText] = useState<string>('')
    const {copy} = useCopy(copyText)

    useEffect(() => {
        const text: string = transcriptFile.reduce((acc: string, sentence: SentenceInterface) => {
            let next = acc + sentence.NameSpeaker + ':'
            const words = sentence.Words.reduce((acc: string, word: WordInterface) => acc + word.Text, "")
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

export default CopyBtn