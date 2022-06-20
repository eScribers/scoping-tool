import React, {useState} from "react";
import {Popover, Button, Slider, Space} from "antd";


const ChanelControl = () => {
    const [sliders, setSliders] = useState<number[]>([1, 0.5, 0.8, 0.2]);

    const ChanelSliders = (
        <Space>
            {sliders.map((slider: number, index: number) => {
                    return (
                        <div key={index} style={{height: 60}}>
                            <Slider
                                vertical
                                defaultValue={slider}
                                min={0}
                                max={1}
                                step={0.01}
                                tooltipVisible={false}
                            />
                        </div>
                    )
                }
            )}
        </Space>
    )

    return (
        <Popover content={ChanelSliders} trigger='click' placement="bottom">
            <Button size='large'>Channels</Button>
        </Popover>
    )
}

export default ChanelControl