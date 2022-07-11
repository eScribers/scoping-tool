import {makeAutoObservable} from "mobx";
import {RootStore} from "./index";
import axios from "axios";
import {TranscriptFileInterface, JSONFileInterface, FileParams} from "./types";
import moment from "moment";
import _ from "lodash"

class TranscriptStore {
    transcriptFile: TranscriptFileInterface[] = [];
    transcriptDocs: JSONFileInterface[] = [];
    speakersName: string[] = [];
    fileParams: FileParams = {
        IsCompleted: false,
        LastEditor: '',
        ParentDocId: '',
        JobRef: '',
        TimeStamp: '',
    };
    currentFileID: string = '';
    isScrollLock: boolean = false;
    isLoading: boolean = false;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setTranscriptFile(v: TranscriptFileInterface[]) {
        this.transcriptFile = v
        this.rootStore.historyStore.updateHistoryDoc(v)
    }

    setTranscriptDocs = (transcriptDoc: JSONFileInterface) => {
        const updateDocs = _.cloneDeep(this.transcriptDocs)
        updateDocs.push(transcriptDoc)
        this.transcriptDocs = updateDocs
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

    setIsLoading = (v: boolean) => {
        this.isLoading = v
    }

    loadFile = (id: string) => {
        this.setIsLoading(true)
        axios.get(`https://search-myscopingtooldomain-a5n4jhnv7oi7lfbvflh42ly2hu.us-east-1.es.amazonaws.com/docs/_doc/_search`,{
            auth: {
                username: 'admin',
                password: 'Test#123'
            }
        }).then((res) => {
            console.log('get response', res)
            const simpleDoc: JSONFileInterface = res.data.hits.hits[0]._source.SimpleDoc
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
            this.setTranscriptDocs(simpleDoc)
            this.setIsLoading(false)
        }).catch((error) => {
            console.log('axios error', error)
            this.setIsLoading(false)
        })
    }

    updateFile = (data: TranscriptFileInterface[]) => {
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