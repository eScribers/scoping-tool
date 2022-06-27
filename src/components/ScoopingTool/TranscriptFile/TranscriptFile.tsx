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
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import TranscriptFileSentenceControl from "./TranscriptFileSentenceControl/TranscriptFileSentenceControl";

const {Paragraph, Text} = Typography

interface TranscriptFileInterface {
    playHead: number
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
    const [triggerElement, setTriggerElement] = useState<triggerElemInterface | null>(null)
    const [isScrollLock, setIsScrollLock] = useState<boolean>(false)
    const textContainerRef = useRef<HTMLDivElement>(null)

    const loadFile = async () => {
      
        const requestOptions = {
            headers: { 'Content-Type': 'application/json' },
            auth: {
                username: "admin",
                password: "Test#123"
              },
            body: JSON.stringify({
                "sort": {
                  "Sentenceindex": {
                    "order": "asc"
                  },
                   "WordIndex": {
                    "order": "asc"
                  }
                },
                "query": {
                  "match_phrase": {
                    "TabulaJobRef": "NYCDOE215892"
                  }
                }
              })
        };
        // Simple GET request with a requestOptions JSON body using fetch:
        const text = await axios.get('https://search-myscopingtooldomain-a5n4jhnv7oi7lfbvflh42ly2hu.us-east-1.es.amazonaws.com/original_documents/_search?filter_path=hits.hits._source', requestOptions).then(response => {
            return response.data.hits.hits[0]._source;
        }
        ).catch(error => {
            console.log(error);
        }
        );


        //const file = await fetch('/transcripts/36939240-df53-4e05-b1e5-d450980e3a34-adapted_20220509_223453_08sa_4c088156.json');
        //const text = await file.json();
        console.log(text);
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


    if (!transcriptFile.length) return null;

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
            <div style={textContainerStyle} ref={textContainerRef}>
                <Card>
                    {transcriptFile.map((sentence: SentenceInterface, s_index: number) => {
                        const wordWithTime = sentence.Words.find(word => word.TimeRange?.StartTime !== null)
                        let renderItem = null

                        if (wordWithTime?.TimeRange?.StartTime) {
                            renderItem = wordWithTime.TimeRange.StartTime <= playHead + 100 && wordWithTime.TimeRange.StartTime >= playHead - 100
                        }

                        if (!renderItem) {
                            return null
                        }

                        return (
                            <Card type={'inner'} key={s_index}>
                                <TranscriptFileEditSpeaker
                                    transcriptFile={transcriptFile}
                                    setTranscriptFile={setTranscriptFile}
                                    speakersName={speakersName}
                                    setSpeakersName={setSpeakersName}
                                    nameSpeaker={sentence.NameSpeaker}
                                    sIndex={s_index}
                                />
                                <Paragraph>
                                    {sentence.Words.map((word: WordInterface, wIndex: number) => {
                                        let isInTimeRange = null
                                        if (word.TimeRange?.StartTime) {
                                            isInTimeRange = word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead
                                        }
                                        if (isInTimeRange && !isScrollLock) {
                                            document.getElementById(`sentence_${s_index}_word_${wIndex}`)?.scrollIntoView({
                                                block: 'center',
                                            });
                                        }
                                        return (
                                            <TranscriptFileWord
                                                onChangeWord={onChangeWord}
                                                onBlurWord={onBlurWord}
                                                word={word}
                                                sIndex={s_index}
                                                wIndex={wIndex}
                                                key={`${word.Text}${s_index}${wIndex}`}
                                                isInTimeRange={isInTimeRange}
                                            />
                                        )
                                    })}
                                    <TranscriptFileSentenceControl
                                        transcriptFile={transcriptFile}
                                        speakerName={sentence.NameSpeaker}
                                        sIndex={s_index}
                                        handleUtilSentences={handleUtilSentences}
                                    />
                                </Paragraph>
                            </Card>
                        );
                    })}
                </Card>
            </div>
        </>
    )
}

export default TranscriptFile