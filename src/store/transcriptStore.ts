import {makeAutoObservable} from "mobx";
import {RootStore} from "./index";
import axios from "axios";
import {TranscriptFileInterface, JSONFileInterface, FileParams} from "./types";
import moment from "moment";

class TranscriptStore {
    transcriptFile: TranscriptFileInterface[] = [];
    speakersName: string[] = [];
    fileParams: FileParams = {
        IsCompleted: false,
        LastEditor: '',
        ParentDocId: '',
        JobRef: '',
        TimeStamp: '',
    };
    currentFileID: string = '';
    previousFileId: string = '';
    forwardsFileId: string = ''
    isScrollLock: boolean = false;
    isLoading: boolean = false;
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

    setFileParams(v: FileParams) {
        this.fileParams = v
    }

    setIsScrollLock = (v: boolean) => {
        this.isScrollLock = v
    }

    setCurrentFileId = (v: string) => {
        this.currentFileID = v
    }

    setPreviousFileId = (v: string) => {
        this.previousFileId = v
    }

    setForwardFileId = (v: string) => {
        this.forwardsFileId = v
    }

    setIsLoading = (v: boolean) => {
        this.isLoading = v
    }

    loadFile(id: string) {
        this.setIsLoading(true)
        axios.get(`https://djrxmzl1ec.execute-api.us-east-1.amazonaws.com/Prod/scoping-tool-api-HelloWorldFunction-57Owtxk448XU/?id=${id}`).then((res) => {
            console.log(res)
            const simpleDoc: JSONFileInterface = res.data.SimpleDoc
            const allSpeakersName: string[] = simpleDoc.SimpleSentences.map((sentence: TranscriptFileInterface) => sentence.Speaker)
            const uniqSpeakersName = [...new Set(allSpeakersName)]

            this.setSpeakersName(uniqSpeakersName)
            this.setFileParams({
                IsCompleted: simpleDoc.IsCompleted,
                LastEditor: simpleDoc.LastEditor,
                JobRef: simpleDoc.JobRef,
                ParentDocId: simpleDoc.ParentDocId,
                TimeStamp: simpleDoc.TimeStamp
            })
            this.setCurrentFileId(id)
            this.setTranscriptFile(simpleDoc.SimpleSentences)
            if (simpleDoc.ParentDocId !== '' && simpleDoc.ParentDocId.length > 4) {
                this.setPreviousFileId(simpleDoc.ParentDocId)
            } else {
                this.setPreviousFileId('')
            }
            this.setIsLoading(false)
        }).catch((error) => {
            console.log('axios error', error)
            this.setIsLoading(false)
        })
    }

    updateFile(data: TranscriptFileInterface[]) {
        this.setIsLoading(true)

        const newJSON = {
            SimpleDoc: {
                ...this.fileParams,
                LastEditor: moment().format('YYYY-MM-DD:HH:MM:SS'),
                SimpleSentences: data
            }
        }
        axios.post(`https://djrxmzl1ec.execute-api.us-east-1.amazonaws.com/Prod/scoping-tool-api-HelloWorldFunction-57Owtxk448XU/?id=${this.currentFileID}`, newJSON).then((res) => {
            console.log('post request', res)
            setTimeout(() => {
                if (res.status === 201) {
                    this.loadFile(res.data._id)
                }
                this.setIsLoading(false)
            }, 500)

        }).catch((error) => {
            console.log('axios error', error)
            this.setIsLoading(false)
        })
    }
}

export default TranscriptStore