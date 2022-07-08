import {FC} from "react";
import {Button, Typography, Space, Popover, Select} from "antd";
import {EditOutlined, PlayCircleOutlined} from "@ant-design/icons";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

const {Title} = Typography
const {Option} = Select

interface EditSpeakerInterface {
    nameSpeaker: string,
    sIndex: number,
    startTime: number
}

const TranscriptFileEditSpeaker: FC<EditSpeakerInterface> = ({
                                                                 nameSpeaker,
                                                                 sIndex,
                                                                 startTime
                                                             }) => {
    const {transcriptStore, audioStore} = rootStore
    const {transcriptFile, speakersName} = transcriptStore

    const onSpeakerNameChange = (oldname: string, newname: string | null) => {
        if (oldname === newname || newname === null) {
            return false
        }

        const updateTranscriptFile = [...transcriptFile]
        updateTranscriptFile[sIndex].Speaker = newname.toUpperCase()

        transcriptStore.setTranscriptFile(updateTranscriptFile)

    }

    const SpeakerSelect = (
        <div style={{width: 250}}>
            <Select
                defaultValue={nameSpeaker}
                size='small'
                style={{
                    width: '100%'
                }}
                onChange={(value => onSpeakerNameChange(nameSpeaker, value))}
            >
                {speakersName.map(speaker => (
                    <Option value={speaker} key={speaker}>{speaker}</Option>
                ))}
            </Select>
        </div>
    )

    const handlePlayButton = () => {
        audioStore.setPlayHead(startTime)
        audioStore.setIsPlay(true)
        audioStore.audioRef?.play()
    }


    return (
        <Title level={4}>
            <Space>
                <Button type='primary' onClick={handlePlayButton}>
                    <PlayCircleOutlined/>
                </Button>
                <Popover placement="topLeft" title={'Select Speaker Name'} content={SpeakerSelect} trigger="click">
                    <Button
                        type='primary'
                        size='small'
                    >
                        <EditOutlined/>
                    </Button>
                </Popover>
                <span
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onSpeakerNameChange(nameSpeaker, e.currentTarget.textContent)}
                >
                {nameSpeaker}
                </span>
            </Space>
        </Title>
    )
}

export default observer(TranscriptFileEditSpeaker)