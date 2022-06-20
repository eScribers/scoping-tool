import {Popover, Button, Slider} from "antd";
import {SoundOutlined} from "@ant-design/icons";
import React, {FC, useState} from "react";

interface VolumeInterface {
    audioRef: { current: HTMLAudioElement | null }
}

const VolumeControl: FC<VolumeInterface> = ({audioRef}) => {
    const changeVolume = (value: any) => {
        if (!audioRef.current) return;
        audioRef.current.volume = value
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

export default VolumeControl