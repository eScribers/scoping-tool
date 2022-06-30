import {makeAutoObservable} from "mobx";
import {RootStore} from "./index";
import axios from "axios";
import {TranscriptFileInterface} from "./types";

class TranscriptStore {
    transcriptFile: TranscriptFileInterface[] = [];
    speakersName: string[] = [];
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setTranscriptFile(v: TranscriptFileInterface[]) {
        this.transcriptFile = v
    }

    setSpeakersName(v: string[]) {
        this.speakersName = v
    }

    loadFile() {
        axios.get('https://search-myscopingtooldomain-a5n4jhnv7oi7lfbvflh42ly2hu.us-east-1.es.amazonaws.com/docs/_doc/NVTdr4EBlagkqpmKpAtt/_source', {
            auth: {
                username: 'admin',
                password: 'Test#123'
            }
        }).then((res) => {
            const allSpeakersName: string[] = res.data.SimpleDoc.SimpleSentances.map((sentence: TranscriptFileInterface) => sentence.Speaker)
            const uniqSpeakersName = [...new Set(allSpeakersName)]

            this.setSpeakersName(uniqSpeakersName)
            this.setTranscriptFile(res.data.SimpleDoc.SimpleSentances)
        }).catch((error) => {
            console.log('axios error', error)
        })
    }
}

export default TranscriptStore