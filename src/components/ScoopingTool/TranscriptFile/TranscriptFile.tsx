import {CSSProperties, FC, useEffect, useState, useRef} from "react";
import {Typography, Space, Card, Divider, Button} from "antd";
import {SentenceInterface, WordInterface} from "../types";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
import TranscriptFileEditSpeaker from "./TranscriptFileEditSpeaker";
import _ from "lodash";
import axios from "axios";
import moment from "moment";

const {Title, Paragraph, Text} = Typography

interface TranscriptFileInterface {
    playHead: number
}

interface TranscriptChangesInterface {
    action: String,
    sIndex: number,
    wIndex: number,
    word: String,
    newWord: String | null
}

interface triggerElemInterface {
    prevElem: string,
    currentElem: string
}

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}


const TranscriptFile: FC<TranscriptFileInterface> = ({playHead}) => {
    const [transcriptChanges, setTranscriptChanges] = useState<TranscriptChangesInterface[]>([]);
    const [transcriptFile, setTranscriptFile] = useState<SentenceInterface[]>([]);
    const [speakersName, setSpeakersName] = useState<string[]>([])
    const [isScrollLock, setIsScrollLock] = useState<boolean>(false)
    const [triggerElement, setTriggerElement] = useState<triggerElemInterface | null>(null)
    const textContainerRef = useRef<HTMLDivElement>(null)

    const loadFile = async () => {
        const file = await fetch('/transcripts/36939240-df53-4e05-b1e5-d450980e3a34-adapted_20220509_223453_08sa_4c088156.json');
        const text = await file.json();
        const converted = text.DocumentParts.map((sentence: SentenceInterface) => (
            {
                ...sentence,
                Words: sentence.Words.map((word: WordInterface) => ({
                    ...word,
                    TimeRange: !word.TimeRange ? null : {
                        StartTime: moment.duration(word.TimeRange.StartTime).asSeconds(),
                        EndTime: moment.duration(word.TimeRange.EndTime).asSeconds(),
                    }
                }))
            }
        ))
        const allSpeakersName: string[] = converted.map((sentence: SentenceInterface) => sentence.NameSpeaker)
        const uniqSpeakersName = [...new Set(allSpeakersName)]

        setTranscriptFile(converted);
        setSpeakersName(uniqSpeakersName)
    }

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

    useEffect(() => {
        console.log('transcriptChanges', transcriptChanges)
    }, [transcriptChanges])

    useEffect(() => {
        console.log('speakersName', speakersName)
    }, [speakersName])

    const sendChanges = async () => {
        const response = await axios.post(
            'https://example.com',
            {payload: transcriptChanges},
            {headers: {'Content-Type': 'application/json'}}
        )
        console.log(response.data)
    }


    const handleTranscriptChanges = (oldword: string, word: string, sIndex: number, wordIndex: number) => {
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

    const onChangeWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number, keyCode: string) => {
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

    const onBlurWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number) => {
        if (word === null || oldword.trim() === word.trim()) {
            return false
        }

        const updateTranscriptFile = _.cloneDeep(transcriptFile)
        updateTranscriptFile[sIndex].Words[wordIndex].Text = word

        setTranscriptFile(updateTranscriptFile)

        handleTranscriptChanges(oldword, word, sIndex, wordIndex);

    }


    if (!transcriptFile.length) return null;

    return (
        <>
            <Card>
                <Space
                    style={{
                        width: '100%',
                    }}
                >
                    <Button type='primary' onClick={()=>setIsScrollLock(!isScrollLock)}>
                        {isScrollLock ? 'Unlock Scroll' : 'Lock Scroll'}
                    </Button>
                    <CopyBtn transcriptFile={transcriptFile}/>
                    <Text>Edit transcription text below</Text>
                    <DownloadWord/>
                    <DownloadPDF/>
                </Space>
            </Card>
            <Divider/>
            <div style={textContainerStyle} ref={textContainerRef}>
                <Card>
                    {transcriptFile.map((sentence: SentenceInterface, s_index: number) => {
                        return (
                            <div key={s_index}>
                                <TranscriptFileEditSpeaker
                                    transcriptFile={transcriptFile}
                                    setTranscriptFile={setTranscriptFile}
                                    speakersName={speakersName}
                                    setSpeakersName={setSpeakersName}
                                    nameSpeaker={sentence.NameSpeaker}
                                    sIndex={s_index}
                                />
                                <Paragraph>
                                    {sentence.Words.map((word: WordInterface, index: number) => {
                                        // Check if the word is in the current time range
                                        let isInTimeRange = null;
                                        if (word.TimeRange?.StartTime) {
                                            isInTimeRange = word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead;
                                        }

                                        if (isInTimeRange && !isScrollLock) {
                                            document.getElementById(`sentence_${s_index}_word_${index}`)?.scrollIntoView({
                                                block: 'center',
                                            });
                                        }

                                        return (
                                            <span
                                                id={`sentence_${s_index}_word_${index}`}
                                                key={index}
                                                style={isInTimeRange ? {background: 'yellow'} : {}}
                                                contentEditable
                                                suppressContentEditableWarning={true}
                                                onKeyUp={(e) => {
                                                    onChangeWord(word.Text, e.currentTarget.textContent, s_index, index, e.code)
                                                }}

                                                onBlur={(e) => {
                                                    onBlurWord(word.Text, e.currentTarget.textContent, s_index, index)
                                                }}
                                            >
                                          {word.Text}
                                      </span>
                                        )
                                    })}
                                </Paragraph>
                            </div>
                        );
                    })}
                </Card>
            </div>
        </>
    )
}

export default TranscriptFile