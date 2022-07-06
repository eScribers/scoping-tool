import React, {CSSProperties} from "react";
import {
    PauseCircleOutlined,
    PlayCircleOutlined,
    StepBackwardOutlined,
    StepForwardOutlined
} from "@ant-design/icons";
import {Button, Space, Card} from "antd";
import ProgressBar from "./ProgressBar/ProgressBar";
import VolumeControl from "./VolumeControl";
import ChanelControl from "./ChanelControl";
import Hid from "./Hid";
import rootStore from "../../store";
import {observer} from "mobx-react-lite";

const spaceStyle: CSSProperties = {width: '100%', justifyContent: 'center'}

const PlayerControls = () => {
    const {audioStore} = rootStore
    const {isPlay, audioRef} = audioStore

    const playAudio = () => {
        if (!audioRef) return;
        if (!isPlay) {
            audioRef.play()
        } else {
            audioRef.pause()
        }
        audioStore.setIsPlay(!isPlay)
    }

    const handlerForward = (v: number) => {
        if (!audioRef) return;
        audioStore.setPlayHead(audioRef.currentTime + v)
    }
    return (
        <Card style={{marginBottom: 24}}>
            <div style={{marginBottom: 8}}>
                <ProgressBar/>
                <Space style={spaceStyle}>
                    <Button
                        onClick={() => handlerForward(-15)}
                        title='backward -15s'
                        size='large'
                    >
                        <StepBackwardOutlined/>
                    </Button>
                    <Button
                        onClick={playAudio}
                        title={isPlay ? 'pause audio' : 'play audio'}
                        size='large'
                    >
                        {isPlay ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
                    </Button>
                    <Button
                        onClick={() => handlerForward(15)}
                        title='forward +15s'
                        size='large'
                    >
                        <StepForwardOutlined/>
                    </Button>
                    <VolumeControl/>
                </Space>
            </div>
            <div>
                <Space style={spaceStyle}>
                    <Hid/>
                    <ChanelControl/>
                </Space>
            </div>
        </Card>

    )
}

export default observer(PlayerControls)