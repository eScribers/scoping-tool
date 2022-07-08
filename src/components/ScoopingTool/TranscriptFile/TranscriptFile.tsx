import React, {useEffect} from "react";
import {Typography, Space, Card, Divider, Button} from "antd";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import TranscriptFileList from "./TranscriptFileList";
import TranscriptFileVersionControl from "./TranscriptFileVersionControl";


const {Text} = Typography

const TranscriptFile = () => {
    const {transcriptStore} = rootStore
    const {isScrollLock} = transcriptStore

    const loadFile = async () => {
        transcriptStore.loadFile('D1UA2YEBNV5JkCejPNLG')
    }
    useEffect(() => {
        loadFile();
    }, []);

    if (!transcriptStore.transcriptFile.length) return null;

    return (
        <>
            <Card>
                <Space
                    style={{
                        width: '100%',
                    }}
                >
                    <Button type='primary' onClick={() => transcriptStore.setIsScrollLock(!isScrollLock)}>
                        {isScrollLock ? 'Unlock Scroll' : 'Lock Scroll'}
                    </Button>
                    <CopyBtn/>
                    <Text>Edit transcription text below</Text>
                    <DownloadWord/>
                    <DownloadPDF/>
                </Space>
            </Card>
            <Divider/>
            <TranscriptFileVersionControl/>
            <TranscriptFileList/>
        </>
    )
}

export default observer(TranscriptFile)