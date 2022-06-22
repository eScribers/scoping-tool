import "./TranscriptFileSentenceControl.scss"
import React, {useState, FC} from "react";
import {Button, Drawer, List, Typography} from "antd";
import {ScissorOutlined} from "@ant-design/icons";
import {SentenceInterface} from "../../types";

const {Text} = Typography

interface SentenceControlInterface {
    transcriptFile: SentenceInterface[],
    speakerName: string,
    sIndex: number,
    handleUtilSentences: (targetSIndex: number, sIndex: number) => void
}

const TranscriptFileSentenceControl: FC<SentenceControlInterface> = ({
                                                                         transcriptFile,
                                                                         speakerName,
                                                                         sIndex,
                                                                         handleUtilSentences
                                                                     }) => {
    const [visible, setVisible] = useState(false);


    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };
    return (

        <>
            <Button
                type='primary'
                size='small'
                onClick={showDrawer}
                style={{
                    marginLeft: 10
                }}
            >
                <ScissorOutlined />
            </Button>
            <Drawer
                title="Chose util sentence"
                placement="right"
                onClose={onClose}
                visible={visible}
                destroyOnClose
            >
                <List
                    dataSource={transcriptFile}
                    bordered
                    size='small'
                    renderItem={(sentence, index: number) => {

                        if (sentence.NameSpeaker !== speakerName ) {
                            return null
                        }

                        return (
                            <List.Item
                                className={'listItem'}
                                onClick={() => handleUtilSentences(index, sIndex)}
                                style={{
                                    background: sIndex===index ? '#b7eb8f' : ''
                                }}
                            >
                                <Text mark>[{sentence.NameSpeaker}]</Text> <br/>

                                {sentence.Words.map(word => (
                                    word.Text
                                ))}

                            </List.Item>
                        )
                    }}
                >

                </List>
            </Drawer>
        </>
    )
}

export default TranscriptFileSentenceControl