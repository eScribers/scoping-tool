import React, {CSSProperties, FC, useState} from "react";
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

interface PlayerControlsInterface {
    justFowardHandler: (value: number) => void,
    audioRef: { current: HTMLAudioElement | null }
}

const spaceStyle:CSSProperties = {width: '100%', justifyContent: 'center'}

const PlayerControls: FC<PlayerControlsInterface> = ({audioRef, justFowardHandler}) => {

    const [isPlay, setPlay] = useState<boolean>(false)


    const playAudio = () => {
        if (!audioRef.current) return;
        if (!isPlay) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
        setPlay(!isPlay)
    }
    return (
        <Card style={{marginBottom: 24}}>
            <div style={{marginBottom: 8}}>
                <ProgressBar audioRef={audioRef}/>
                <Space style={spaceStyle}>
                    <Button
                        onClick={() => justFowardHandler(-15)}
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
                        onClick={() => justFowardHandler(15)}
                        title='forward +15s'
                        size='large'
                    >
                        <StepForwardOutlined/>
                    </Button>
                    <VolumeControl audioRef={audioRef}/>
                </Space>
            </div>
            <div>
                <Space style={spaceStyle}>
                    <Hid justFowardHandler={justFowardHandler} audioRef={audioRef}/>
                    <ChanelControl/>
                </Space>
            </div>
        </Card>

    )
}

export default PlayerControls