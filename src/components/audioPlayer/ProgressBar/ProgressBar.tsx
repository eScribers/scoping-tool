import "./ProgressBar.scss"
import {CSSProperties, useEffect, useState} from "react";
import {Slider, Typography} from "antd";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

const {Text} = Typography


const trackStyle: CSSProperties = {
    background: '#ffc700',
    height: 15
}
const handleStyle: CSSProperties = {
    width: 1,
    height: 22,
    border: 'none',
    background: '#c4c4c4',
    marginTop: -7
}

const secondInMinutes = (value: number | undefined) => {
    if (!value) return '0m 0s';
    let minutes = Math.floor(value / 60);
    let seconds = Math.floor(value % 60);

    return `${minutes}m ${Number(seconds) < 10 ? `0${seconds}` : seconds}s`
}

const ProgressBar = () => {
    const [duration, setDuration,] = useState(0)
    const {playHead, audioRef} = rootStore.audioStore

    useEffect(() => {
        if (!audioRef) return;
        if (audioRef.duration && duration !== audioRef.duration) {
            setDuration(audioRef.duration)
        }
    }, [playHead])

    const marks = {
        0: {
            label: <Text strong>0</Text>
        },
        [duration ? duration : 100]: {
            label: (
                <Text
                    style={{whiteSpace: 'nowrap'}}
                    strong
                >
                    {duration ? `${secondInMinutes(duration)}` : ''}
                </Text>
            )
        }
    }

    const progressOnChange = (value: number) => {
        if (!audioRef) return;
        if (audioRef.currentTime) {
            audioRef.currentTime = value
        }
    }

    return (
        <div className='audio-progress-bar'>
            <Slider
                defaultValue={0}
                value={playHead}
                min={0}
                max={duration}
                tooltipVisible={true}
                marks={marks}
                tipFormatter={value => secondInMinutes(value)}
                onAfterChange={progressOnChange}
                trackStyle={trackStyle}
                handleStyle={handleStyle}
                tooltipPrefixCls={'progress-bar-tooltip'}
            />
        </div>
    )
}

export default observer(ProgressBar)