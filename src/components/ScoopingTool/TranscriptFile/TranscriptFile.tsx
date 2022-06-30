import React, {CSSProperties, FC, useEffect, useState, useRef} from "react";
import {Typography, Space, Card, Divider, Button, Popover} from "antd";
import {
    SentenceInterface,
    WordInterface,
    TranscriptChangesInterface,
    HandleWordBlurInterface,
    HandleWordChangeInterface
} from "../types";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
import TranscriptFileEditSpeaker from "./TranscriptFileEditSpeaker";
import TranscriptFileWord from "./TranscriptFileWord";
import TranscriptFileSentenceControl from "./TranscriptFileSentenceControl/TranscriptFileSentenceControl";
import _ from "lodash";
import axios from "axios";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import TranscriptFileList from "./TranscriptFileList";

const {Paragraph, Text} = Typography

interface triggerElemInterface {
    prevElem: string,
    currentElem: string
}


const TranscriptFile = () => {
    const {transcriptStore} = rootStore
    const [transcriptChanges, setTranscriptChanges] = useState<TranscriptChangesInterface[]>([]);
    const [transcriptFile, setTranscriptFile] = useState<SentenceInterface[]>([]);
    const [speakersName, setSpeakersName] = useState<string[]>([])
    const [triggerElement, setTriggerElement] = useState<triggerElemInterface | null>(null)
    const [isScrollLock, setIsScrollLock] = useState<boolean>(false)
    const textContainerRef = useRef<HTMLDivElement>(null)
    const loadFile = async () => {
        transcriptStore.loadFile()
    }

    useEffect(() => {
        const allSpeakersName: string[] = transcriptFile.map((sentence: SentenceInterface) => sentence.NameSpeaker)
        const uniqSpeakersName = [...new Set(allSpeakersName)]

        setSpeakersName(uniqSpeakersName)
    }, [transcriptFile])

    useEffect(() => {
        loadFile();
    }, []);

    useEffect(() => {
        if (triggerElement !== null) {
            // @ts-ignore
            document.getElementById(triggerElement.prevElem).blur()
            // @ts-ignore
            document.getElementById(triggerElement.currentElem).focus()
        }
    }, [triggerElement])

    // useEffect(() => {
    //     console.log('transcriptChanges', transcriptChanges)
    // }, [transcriptChanges])
    //
    // useEffect(() => {
    //     console.log('speakersName', speakersName)
    // }, [speakersName])

    const sendChanges = async () => {
        const response = await axios.post(
            'https://example.com',
            {payload: transcriptChanges},
            {headers: {'Content-Type': 'application/json'}}
        )
        console.log(response.data)
    }


    const handleTranscriptChanges = (params: HandleWordBlurInterface) => {
        const {oldword, word, sIndex, wordIndex} = params

        //if sIndex and sIndex equel to current object.sIndex and object.wIndex in transcriptChanges then update the word:
        const transcriptChange = transcriptChanges.find((change: TranscriptChangesInterface) => (
            change.sIndex === sIndex && change.wIndex === wordIndex
        ))

        if (transcriptChange) {
            if (word === '') {
                //if word is null then we edit the action in our transcriptChanges object to remove:
                setTranscriptChanges(transcriptChanges.map((change: TranscriptChangesInterface) => {
                    if (change.sIndex === sIndex && change.wIndex === wordIndex) {
                        return {
                            ...change,
                            action: 'delete'
                        }
                    }
                    return change
                }))
            } else {
                setTranscriptChanges(transcriptChanges.map((change: TranscriptChangesInterface) => {
                        if (change.sIndex === sIndex && change.wIndex === wordIndex) {
                            return {
                                ...change,
                                newWord: word
                            }
                        }
                        return change
                    }
                ))
            }
        } else {
            if (transcriptFile[sIndex].Words[wordIndex].hasOwnProperty('IsNewWord') === false) {
                setTranscriptChanges([...transcriptChanges, {
                    action: word === '' ? 'delete' : 'replace',
                    sIndex,
                    wIndex: wordIndex,
                    word: oldword,
                    newWord: word
                }])
            } else {

                setTranscriptChanges([...transcriptChanges, {
                    action: 'add',
                    sIndex,
                    wIndex: wordIndex,
                    word: oldword,
                    newWord: word
                }])

            }
        }
    }

    const onChangeWord = (params: HandleWordChangeInterface) => {
        const {oldword, word, sIndex, wordIndex, keyCode} = params
        if (word === null || oldword === word || word === '') {
            return false
        }

        const updateTranscriptFile = _.cloneDeep(transcriptFile)

        //if press key === space, we adding new empty word object and update our transcript file an
        if (keyCode === "Space") {
            let emptyWordObject: WordInterface = {
                ConfidenceLevel: null,
                FormatWord: null,
                LogNote: null,
                Tag: 0,
                Text: ' ',
                TimeRange: null,
                IsNewWord: true
            }
            updateTranscriptFile[sIndex].Words.splice(wordIndex + 1, 0, emptyWordObject)


            //we need update transcriptChanges if(wordIndex > object.wIndex):
            if (transcriptChanges.length > 0) {
                const newTranscriptChanges = transcriptChanges.map(change => {
                    if (sIndex === change.sIndex && wordIndex + 1 <= change.wIndex) {
                        return {
                            ...change,
                            wIndex: change.wIndex + 1
                        }
                    }
                    return change
                })
                setTranscriptChanges(newTranscriptChanges)
            }

            setTranscriptFile(updateTranscriptFile)
            //Set new triggerElem for change focus
            setTriggerElement({
                prevElem: `sentence_${sIndex}_word_${wordIndex}`,
                currentElem: `sentence_${sIndex}_word_${wordIndex + 1}`
            })
        }

    }

    const onBlurWord = (params: HandleWordBlurInterface) => {
        const {oldword, word, sIndex, wordIndex} = params
        if (word === null || oldword.trim() === word.trim()) {
            return false
        }

        const updateTranscriptFile = _.cloneDeep(transcriptFile)
        updateTranscriptFile[sIndex].Words[wordIndex].Text = word

        setTranscriptFile(updateTranscriptFile)

        handleTranscriptChanges({oldword, word, sIndex, wordIndex});

    }

    const handleUtilSentences = (targetSIndex: number, sIndex: number) => {

        const updateTranscriptFile = _.cloneDeep(transcriptFile)

        updateTranscriptFile[targetSIndex].Words.push(...updateTranscriptFile[sIndex].Words)
        updateTranscriptFile.splice(sIndex, 1)

        setTranscriptFile(updateTranscriptFile)
        setTranscriptChanges(transcriptChanges.filter(change => change.sIndex !== sIndex))
    }


    if (!transcriptStore.transcriptFile.length) return null;

    return (
        <>
            <Card>
                <Space
                    style={{
                        width: '100%',
                    }}
                >
                    <Button type='primary' onClick={() => setIsScrollLock(!isScrollLock)}>
                        {isScrollLock ? 'Unlock Scroll' : 'Lock Scroll'}
                    </Button>
                    <CopyBtn transcriptFile={transcriptFile}/>
                    <Text>Edit transcription text below</Text>
                    <DownloadWord/>
                    <DownloadPDF/>
                </Space>
            </Card>
            <Divider/>
            <TranscriptFileList/>
        </>
    )
}

export default observer(TranscriptFile)