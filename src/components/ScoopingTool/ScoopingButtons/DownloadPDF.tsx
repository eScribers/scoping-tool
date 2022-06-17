import {useState} from "react";
import {Button} from "antd";
import {sleep} from "../../../utils/sleep";
import {FilePdfOutlined} from "@ant-design/icons";

const DownloadPDF = () => {
    const [isLoading, setLoading] = useState<boolean>(false)


    const onSavePDF = () => {
        setLoading(true)
        sleep(1000).then(() => {
            console.log('download PDF')
            setLoading(false)
        })
    }

    return (
        <Button
            type={'primary'}
            onClick={onSavePDF}
            loading={isLoading}
            disabled={isLoading}
            icon={<FilePdfOutlined/>}
        >
            Download PDF
        </Button>
    )
}

export default DownloadPDF