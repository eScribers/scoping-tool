import {FC} from "react";
import {SentenceInterface} from "../types";
import {Button, Typography, Space, Popover, Select} from "antd";
import {EditOutlined} from "@ant-design/icons";
import _ from "lodash";

const {Title} = Typography
const {Option} = Select

interface EditSpeakerInterface {
    transcriptFile: SentenceInterface[],
    setTranscriptFile: (sentences: SentenceInterface[]) => void,
    speakersName: string[],
    setSpeakersName: (array: string[]) => void,
    nameSpeaker: string,
    sIndex: number
}

const TranscriptFileEditSpeaker: FC<EditSpeakerInterface> = ({
                                                                 transcriptFile,
                                                                 setTranscriptFile,
                                                                 speakersName,
                                                                 setSpeakersName,
                                                                 nameSpeaker,
                                                                 sIndex
                                                             }) => {
    const onSpeakerNameChange = (oldname: string, newname: string | null) => {
        if (oldname === newname || newname === null) {
            return false
        }

        const updateTranscriptFile = _.cloneDeep(transcriptFile)
        updateTranscriptFile[sIndex].NameSpeaker = newname.toUpperCase()

        setTranscriptFile(updateTranscriptFile)


        if (speakersName.find((title: string) => title.toUpperCase() === newname.toUpperCase()) === undefined) {
            setSpeakersName([...speakersName, newname.toUpperCase()])
        }
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

    return (
        <Title level={4}>
            <Space>
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
                    onBlur={(e) => onSpeakerNameChange(nameSpeaker, e.currentTarget.textContent)}
                >
                {nameSpeaker}
                </span>

            </Space>
        </Title>
    )
}

export default TranscriptFileEditSpeaker