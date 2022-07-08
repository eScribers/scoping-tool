import {Button} from "antd";
import rootStore from "../../../store";
import {observer} from "mobx-react-lite";

interface DeleteSentenceInterface {
    sIndex: number
}

const TranscriptFileDeleteSentence = ({sIndex}: DeleteSentenceInterface) => {
    const {transcriptStore} = rootStore
    const {transcriptFile} = transcriptStore

    const handleDelete = () => {
        const copyTranscriptFile = [...transcriptFile]
        copyTranscriptFile.splice(sIndex, 1)
        transcriptStore.setTranscriptFile(copyTranscriptFile)
    }

    return (
        <Button
            danger
            onClick={handleDelete}
        >
            Delete Sentence
        </Button>
    )
}

export default observer(TranscriptFileDeleteSentence)