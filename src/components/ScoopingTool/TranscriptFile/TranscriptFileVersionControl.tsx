import {Button, Card, Space} from "antd";
import React from "react";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

const TranscriptFileVersionControl = () => {
    const {transcriptStore, historyStore} = rootStore
    const {isLoading} = transcriptStore
    const {historyDocs, currentVersion} = historyStore
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
                    disabled={currentVersion === 1 || isLoading}
                    loading={isLoading}
                >
                    Preview Version
                </Button>
                <Button
                    type='primary'
                    onClick={historyStore.nextVersion}
                    disabled={currentVersion === historyDocs.length || isLoading}
                    loading={isLoading}
                >
                    Next Version
                </Button>
            </Space>
        </Card>
    )
}

export default observer(TranscriptFileVersionControl)