import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import {Button, Card, Space} from "antd";
import {CSSProperties} from "react";
import TranscriptFileEditSpeaker from "./TranscriptFileEditSpeaker";
import TranscriptFileSentence from "./TranscriptFileSentence/TranscriptFileSentence";
import TranscriptFileAddNewSentence from "./TranscriptFileAddNewSentence";
import TranscriptFileSplitSentence from "./TranscriptFileSplitSentence";
import moment from "moment";

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFileList = () => {
    const {transcriptFile, isScrollLock, splitText,splitTextId} = rootStore.transcriptStore
    const {playHead} = rootStore.audioStore

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
                                    speakerName={sentence.Speaker}
                                    splitText={splitText}
                                    splitTextId={splitTextId}
                                />
                                <TranscriptFileAddNewSentence sIndex={sIndex}/>
                            </Space>
                        </Card>

                    )
                })}
            </Card>
        </div>
    )
}

export default observer(TranscriptFileList)