import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import {Card} from "antd";
import {CSSProperties} from "react";
import TranscriptFileEditSpeaker from "./TranscriptFileEditSpeaker";
import TranscriptFileSentence from "./TranscriptFileSentence";
import moment from "moment";

const textContainerStyle: CSSProperties = {
    flex: 1,
    overflowY: 'scroll'
}

const TranscriptFileList = () => {
    const {transcriptFile} = rootStore.transcriptStore
    const {playHead} = rootStore.audioStore
    // console.log(playHead)
    return (
        <div style={textContainerStyle}>
            <Card>
                {transcriptFile.map((sentence, sIndex) => {
                    return (
                        <Card type={'inner'} key={sIndex}>
                            <TranscriptFileEditSpeaker
                                nameSpeaker={sentence.Speaker}
                                sIndex={sIndex}
                            />
                            <TranscriptFileSentence
                                text={sentence.Text}
                                startTime={moment.duration(sentence.StartTime).asSeconds()}
                                endTime={moment.duration(sentence.EndTime).asSeconds()}
                                playHead={playHead}
                                sIndex={sIndex}
                            />
                        </Card>

                    )
                })}
            </Card>
        </div>
    )
}

export default observer(TranscriptFileList)