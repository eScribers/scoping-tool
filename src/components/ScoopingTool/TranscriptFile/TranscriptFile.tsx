import {CSSProperties, FC, useEffect, useState, useRef} from "react";
import {Typography, Space, Card, Divider} from "antd";
import {SentenceInterface, WordInterface} from "../types";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
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

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFile: FC<TranscriptFileInterface> = ({playHead}) => {
    const [transcriptChanges, setTranscriptChanges] = useState<TranscriptChangesInterface[]>([
    ]);
    const [transcriptFile, setTranscriptFile] = useState<SentenceInterface[]>([]);
    const [triggerElement, setTriggerElement] = useState<string | null>(null)
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
        setTranscriptFile(converted);
    }

    useEffect(() => {
        loadFile();
    }, []);

    useEffect(() => {
        if (triggerElement !== null) {
            // @ts-ignore
            document.getElementById(triggerElement).focus()
        }
    }, [triggerElement])

    useEffect(() => {
        console.log(transcriptChanges)
    }, [transcriptChanges])

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
            change.sIndex === sIndex && change.wIndex === wordIndex +1
        ))

        console.log(transcriptChange)
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
                    console.log(change)
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
                    action: word === '' ? 'delete': 'replace',
                    sIndex,
                    wIndex: wordIndex,
                    word: oldword,
                    newWord: word
                }])
            } else {
                
                setTranscriptChanges([...transcriptChanges, {
                    action: 'add',
                    sIndex,
                    wIndex: wordIndex+1,
                    word: oldword,
                    newWord: word
                }])

        }
    }
}

    
    const onChangeWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number) => {
        if (word === null || oldword === word || word === '') {
            return false
        }

        const updateTranscriptFile = _.cloneDeep(transcriptFile)
        updateTranscriptFile[sIndex].Words[wordIndex].Text = word


        let spaceSymbol = new RegExp("\\s+");
        //if last symbol === space, we adding new empty word object and update our transcript file an
        if (word.split('')[word.length - 1].match(spaceSymbol)) {
            let emptyWordObject: WordInterface = {
                ConfidenceLevel: null,
                FormatWord: null,
                LogNote: null,
                Tag: 0,
                Text: '',
                TimeRange: null,
                IsNewWord: true
            }
            updateTranscriptFile[sIndex].Words.splice(wordIndex + 1, 0, emptyWordObject)
            
            setTranscriptFile(updateTranscriptFile)
            //we need update transcriptChanges if(wordIndex > object.wIndex):


            //Set new triggerElem for change focus
            setTriggerElement(`sentence_${sIndex}_word_${wordIndex + 1}`)
        }

    }

    const onBlurWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number) => {
        if (word === null || oldword === word) {
            return false
        }

        console.log(wordIndex);
        handleTranscriptChanges(oldword, word, sIndex , wordIndex);

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
                                <Title level={4}>{sentence.NameSpeaker}</Title>
                                <Paragraph>
                                    {sentence.Words.map((word: WordInterface, index: number) => {
                                        // Check if the word is in the current time range
                                        let isInTimeRange = null;
                                        if (word.TimeRange?.StartTime) {
                                            isInTimeRange = word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead;
                                        }

                                        if (isInTimeRange) {
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
                                                onInput={(e) => {
                                                    onChangeWord(word.Text, e.currentTarget.textContent, s_index, index)
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