import {useState} from "react";
import {Button} from "antd";
import {sleep} from "../../../utils/sleep";
import {FileWordOutlined} from "@ant-design/icons";

const DownloadWord = () => {
    const [isLoading, setLoading] = useState<boolean>(false)


    const onSavePDF = () => {
        setLoading(true)
        sleep(1000).then(() => {
            console.log('download Word')
            setLoading(false)
        })
    }

    return (
        <Button
            type={'primary'}
            onClick={onSavePDF}
            loading={isLoading}
            disabled={isLoading}
            icon={<FileWordOutlined/>}
        >
            Download Word
        </Button>
    )
}

export default DownloadWord