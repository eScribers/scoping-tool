import {RootStore} from "./index";
import {makeAutoObservable} from "mobx";
import {TranscriptFileInterface} from "./types";

class HistoryStore {
    historyDocs: any[] = [];
    currentVersion: number = 0;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    updateHistoryDoc = (doc: TranscriptFileInterface[]) => {
        if (this.currentVersion !== this.historyDocs.length) {
            this.historyDocs = this.historyDocs.slice(0, this.currentVersion)
        }

        this.historyDocs.push(doc)
        this.currentVersion = this.historyDocs.length
    }

    previewVersion = () => {
        let newVersion = this.currentVersion - 1
        if (this.currentVersion !== 0 && this.historyDocs.length !== 0) {
            this.rootStore.transcriptStore.transcriptFile = this.historyDocs[newVersion - 1]
            this.currentVersion = newVersion
        }
    }

    nextVersion = () => {
        let newVersion = this.currentVersion + 1
        if (newVersion <= this.historyDocs.length) {
            this.rootStore.transcriptStore.transcriptFile = this.historyDocs[newVersion - 1]
            this.currentVersion = newVersion
        }
    }
}

export default HistoryStore