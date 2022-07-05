import {useEffect, useState} from "react";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import {Button, Form, Input, Modal, Space, TimePicker} from "antd";
import moment from "moment";

const {TextArea} = Input

const formatTime = 'HH:mm:ss'

interface AddNewSentenceInterface {
    sIndex: number
}

interface formValueInterface {
    speaker: string,
    sentence: string,
    startTime: string,
    endTime: string
}

const TranscriptFileAddNewSentence = ({sIndex}: AddNewSentenceInterface) => {
    const {transcriptStore} = rootStore
    const {transcriptFile, isLoading} = transcriptStore
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [form] = Form.useForm()

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFormSubmit = (v: formValueInterface) => {
        const copyTranscriptFile = [...transcriptFile]
        const item = {
            Sentenceindex: sIndex + 1,
            currSpeakerIndex: 0,
            Text: v.sentence,
            Speaker: v.speaker,
            StartTime: moment(v.startTime).format(formatTime),
            EndTime: moment(v.endTime).format(formatTime)
        }
        copyTranscriptFile.splice(sIndex + 1, 0, item)
        transcriptStore.updateFile(copyTranscriptFile)
    }

    useEffect(() => {
        if (!isLoading) handleCancel();
    }, [isLoading])

    return (
        <div>
            <Button onClick={showModal}>
                Add New Sentence
            </Button>
            <Modal
                title="Add New Sentence"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true}
            >
                <Form
                    form={form}
                    layout='vertical'
                    colon={false}
                    onFinish={onFormSubmit}
                >
                    <Form.Item
                        name={'speaker'}
                        label='Speaker Name:'
                        rules={[{
                            required: true,
                            message: 'Please input speaker name'
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name={'sentence'}
                        label='Speaker Sentence:'
                        rules={[{
                            required: true,
                            message: 'Please input speaker sentence'
                        }]}
                    >
                        <TextArea/>
                    </Form.Item>
                    <Space style={{
                        width: '100%'
                    }}>
                        <Form.Item
                            name={'startTime'}
                            label='Start Time:'
                            rules={[{
                                required: true,
                                message: 'Please select start time'
                            }]}
                        >
                            <TimePicker/>
                        </Form.Item>
                        <Form.Item
                            name={'endTime'}
                            label='End Time:'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select end time'
                                },
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || moment(getFieldValue('startTime')) < moment(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('End time must be less than start time'));
                                    },
                                }),
                            ]}
                        >
                            <TimePicker/>
                        </Form.Item>
                    </Space>
                    <Button type='primary' htmlType='submit' loading={isLoading} disabled={isLoading}>Add
                        Sentence</Button>
                </Form>
            </Modal>
        </div>
    )
}

export default observer(TranscriptFileAddNewSentence)