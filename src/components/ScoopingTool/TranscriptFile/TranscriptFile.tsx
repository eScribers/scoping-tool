import React, {useEffect} from "react";
import {Typography, Space, Card, Divider, Button} from "antd";
import CopyBtn from "../ScoopingButtons/CopyBtn";
import DownloadWord from "../ScoopingButtons/DownloadWord";
import DownloadPDF from "../ScoopingButtons/DownloadPDF";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";
import TranscriptFileList from "./TranscriptFileList";

const {Text} = Typography

const TranscriptFile = () => {
    const {transcriptStore} = rootStore
    const {isScrollLock, previousFileId, forwardsFileId, currentFileID, isLoading} = transcriptStore

    const loadFile = async () => {
        transcriptStore.loadFile('m1V7yIEBNV5JkCejpNGH')
    }
    useEffect(() => {
        loadFile();
    }, []);

    const handlePreviousClick = () => {
        transcriptStore.setForwardFileId(currentFileID)
        transcriptStore.loadFile(previousFileId)
    }

    const handleNextClick = () => {
        transcriptStore.setForwardFileId('')
        transcriptStore.loadFile(forwardsFileId)
    }

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
            <Card>
                <Space
                    style={{
                        width: '100%',
                    }}
                >
                    <Button
                        type='primary'
                        onClick={handlePreviousClick}
                        disabled={previousFileId === '' || isLoading}
                        loading={isLoading}
                    >
                        Preview Version
                    </Button>
                    <Button
                        type='primary'
                        onClick={handleNextClick}
                        disabled={forwardsFileId === '' || isLoading}
                        loading={isLoading}
                    >
                        Next Version
                    </Button>
                </Space>
            </Card>
            <TranscriptFileList/>
        </>
    )
}

export default observer(TranscriptFile)