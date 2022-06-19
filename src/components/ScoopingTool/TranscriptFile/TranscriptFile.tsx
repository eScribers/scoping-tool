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
    sIndex: number,
    wIndex: number,
    word: String,
    newWord: String
}

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFile: FC<TranscriptFileInterface> = ({playHead}) => {
    const [transcriptChanges, setTranscriptChanges] = useState<TranscriptChangesInterface[]>([ 
        {
        sIndex: 2,
        wIndex: 3,
        word: "Sam",
        newWord: "new test word"
    }, {
        sIndex: 2,
        wIndex: 4,
        word: "How",
        newWord: "new test word2"}
    ]);
    const [transcriptFile, setTranscriptFile] = useState<SentenceInterface[]>([]);
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

    const sendChanges = async () => {
        const response = await axios.post(
            'https://example.com',
            { payload: transcriptChanges },
            { headers: { 'Content-Type': 'application/json' } }
        )
        console.log(response.data)
    }
    const onChangeWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number) => {

        if (word === null || oldword === word) {
            return false

        }
        const updateTranscriptFile = _.cloneDeep(transcriptFile)
        updateTranscriptFile[sIndex].Words[wordIndex].Text = word



        console.log(sIndex, wordIndex, word, oldword);
        // if object doesn't exist, add it to the array:
        const indexOfChangeState = transcriptChanges.findIndex((obj: TranscriptChangesInterface) => obj.sIndex === sIndex && obj.wIndex === wordIndex)
        if (indexOfChangeState === -1) {
            var newObj = { sIndex: sIndex, wIndex: wordIndex,word: oldword, newWord: word}
            console.log(newObj);
            setTranscriptChanges((transcriptChanges) => [...transcriptChanges, newObj])
        }
        // else object exist and we need to update it:
        else {
            const newTranscriptChanges = _.cloneDeep(transcriptChanges)
            newTranscriptChanges[indexOfChangeState].newWord = word
            setTranscriptChanges(newTranscriptChanges)
        }
        // if we have more than 20 object in transcriptChanges, send an api request to update the db:
        if (transcriptChanges.length > 20) {
            console.log("sending request to update db");
             // create a new request
             sendChanges();
                // clear the array
            setTranscriptChanges([])
        }

        console.log(transcriptChanges);
        console.log(word)
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
                                <Title style={{textAlign: "center"}} level={4}>{sentence.NameSpeaker}</Title>
                                <Paragraph>&nbsp;—&nbsp;
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
                                            <span id={`sentence_${s_index}_word_${index}`} key={index}
                                                  style={isInTimeRange ? {background: 'yellow'} : {}}
                                                  contentEditable
                                                  suppressContentEditableWarning={true}
                                                  onBlur={(e) => {
                                                      onChangeWord(word.Text, e.target.textContent, s_index, index)
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