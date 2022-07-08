import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import {Button, Card, Space} from "antd";
import {CSSProperties} from "react";
import { Autosave, useAutosave } from 'react-autosave';
import TranscriptFileEditSpeaker from "./TranscriptFileEditSpeaker";
import TranscriptFileSentence from "./TranscriptFileSentence/TranscriptFileSentence";
import TranscriptFileAddNewSentence from "./TranscriptFileAddNewSentence";
import TranscriptFileSplitSentence from "./TranscriptFileSplitSentence";
import TranscriptFileDeleteSentence from "./TranscriptFileDeleteSentence";
import moment from "moment";

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFileList = () => {
    const {transcriptFile, isScrollLock} = rootStore.transcriptStore
    const {splitText, splitTextIndex, splitTextStart, splitTextEnd} = rootStore.splitTextStore
    const {playHead} = rootStore.audioStore

    useAutosave({
        data:transcriptFile,
        onSave: rootStore.transcriptStore.updateFile,
        interval: 60000,
        saveOnUnmount: false
    })

    return (
        <div style={textContainerStyle}>
            <Card>
                {transcriptFile.map((sentence, sIndex) => {
                    return (
                        <Card type={'inner'} key={sIndex}>
                            <TranscriptFileEditSpeaker
                                nameSpeaker={sentence.Speaker}
                                sIndex={sIndex}
                                startTime={moment.duration(sentence.StartTime).asSeconds()}
                            />
                            <TranscriptFileSentence
                                text={sentence.Text}
                                startTime={moment.duration(sentence.StartTime).asSeconds()}
                                endTime={moment.duration(sentence.EndTime).asSeconds()}
                                playHead={playHead}
                                sIndex={sIndex}
                                isScrollLock={isScrollLock}
                            />
                            <Space>
                                <TranscriptFileSplitSentence
                                    sIndex={sIndex}
                                    splitText={splitText}
                                    splitTextIndex={splitTextIndex}
                                    splitTextStart={splitTextStart}
                                    splitTextEnd={splitTextEnd}
                                />
                                <TranscriptFileAddNewSentence sIndex={sIndex}/>
                                <TranscriptFileDeleteSentence sIndex={sIndex}/>
                            </Space>
                        </Card>

                    )
                })}
            </Card>
        </div>
    )
}

export default observer(TranscriptFileList)