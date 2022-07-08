import {Button, Card, Space} from "antd";
import React from "react";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

const TranscriptFileVersionControl = () => {
    const {transcriptStore, historyStore} = rootStore
    const {isLoading} = transcriptStore
    const {historyDocs, currentVersion} = historyStore

    const handleSaveCLick = () => {
        transcriptStore.updateFile(transcriptStore.transcriptFile)
    }

    return (
        <Card>
            <Space
                style={{
                    width: '100%',
                }}
            >
                <Button
                    type='primary'
                    onClick={historyStore.previewVersion}
                    disabled={currentVersion === 1}
                >
                    Preview Version
                </Button>
                <Button
                    type='primary'
                    onClick={historyStore.nextVersion}
                    disabled={currentVersion === historyDocs.length }
                >
                    Next Version
                </Button>
                <Button
                    type='primary'
                    onClick={handleSaveCLick}
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Save
                </Button>
            </Space>
        </Card>
    )
}

export default observer(TranscriptFileVersionControl)