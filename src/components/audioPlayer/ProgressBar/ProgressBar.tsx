import "./ProgressBar.scss"
import {CSSProperties, FC, useEffect} from "react";
import {Slider, Typography} from "antd";

const {Text} = Typography

interface ProgressBarInterface {
    audioRef: { current: HTMLAudioElement | null }
}

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

const ProgressBar: FC<ProgressBarInterface> = ({audioRef}) => {
    const currentTime = audioRef.current?.currentTime
    const duration = audioRef.current?.duration

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
        if (audioRef.current?.currentTime) {
            audioRef.current.currentTime = value
        }
    }

    return (
        <div className='audio-progress-bar'>
            <Slider
                defaultValue={0}
                value={currentTime}
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

export default ProgressBar