import {CSSProperties, FC, useEffect, useState, useRef} from "react";
import {Typography, Space, Card, Divider} from "antd";
import {SentenceInterface, WordInterface} from "../types";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
import _ from "lodash";
import moment from "moment";

const {Title, Paragraph, Text} = Typography

interface TranscriptFileInterface {
    playHead: number
}

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFile: FC<TranscriptFileInterface> = ({playHead}) => {
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


    const onChangeWord = (oldword: string, word: string | null, sIndex: number, wordIndex: number) => {

        if (word === null || oldword === word) {
            return false

        }
        const updateTranscriptFile = _.cloneDeep(transcriptFile)

        updateTranscriptFile[sIndex].Words[wordIndex].Text = word

        setTranscriptFile(updateTranscriptFile)
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