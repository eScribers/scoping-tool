import React, { useEffect, useState} from "react";
import {Button} from "antd";
import {AudioOutlined} from "@ant-design/icons";
import rootStore from "../../store";
import {observer} from "mobx-react-lite";

const footPedalVendorId = 0x05F3;
const footPedalProductId = 0x00FF;

const Hid = () => {
    const [device, setDevice] = useState<any>(null);
    const {audioStore} = rootStore
    const {audioRef} = audioStore

    useEffect(() => {
        // @ts-expect-error
        window.navigator.usb.getDevices().then((devices: any) => {
            console.log("Total devices: " + devices.length);
            devices.forEach((device: any) => {
                setDevice(device);
                console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
            });
        })
        document.addEventListener("contextmenu", e => e.preventDefault());

    }, [])

    useEffect(() => {
        if (!device) return;
        if(!audioRef) return;

        device.addEventListener('inputreport', (event: any) => {
            let byte1 = event.data.getInt8(0);
            switch (byte1) {
                case 1:
                    audioStore.setPlayHead(audioRef.currentTime - 15);
                    break;
                case 2:
                    audioRef.paused ? audioRef.play() : audioRef.pause();

                    break;
                case 4:
                    audioStore.setPlayHead(audioRef.currentTime + 15);
                    break;
            }
        })
    }, [device])


    const getDevices = async () => {
        try {
            // get a list of Hid device as per filters
            // @ts-expect-error
            let devices = await navigator.hid.requestDevice({
                filters: [{vendorId: footPedalVendorId, productId: footPedalProductId}]
            });
            let device = devices[0];
            // if no selection was made there is nothing to do
            if (device === undefined) return;
            if (device.opened === false) await device.open();
            setDevice(device);
        } catch (e) {
            console.log("FAILED: " + e);
        }
    }

    return (
        <Button
            onClick={() => getDevices()}
            className={'hid-btn'}
            size='large'
        >
            <AudioOutlined />
        </Button>
    )
}

export default observer(Hid)