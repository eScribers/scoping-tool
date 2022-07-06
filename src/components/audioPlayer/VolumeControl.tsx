import {Popover, Button, Slider} from "antd";
import {SoundOutlined} from "@ant-design/icons";
import React from "react";
import rootStore from "../../store";
import {observer} from "mobx-react-lite";

const VolumeControl = () => {
    const {audioRef} = rootStore.audioStore

    const changeVolume = (value: any) => {
        if (!audioRef) return;
        audioRef.volume = value
    };

    const volumeInput = (
        <div
            style={{
                height: 60
            }}
        >
            <Slider
                vertical
                defaultValue={1}
                min={0}
                max={1}
                step={0.01}
                tooltipVisible={false}
                onChange={changeVolume}
            />
        </div>
    )

    return (
        <Popover content={volumeInput} trigger='click' placement="bottom">
            <Button size='large'>
                <SoundOutlined/>
            </Button>
        </Popover>
    )
}

export default observer(VolumeControl)