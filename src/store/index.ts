import AudioStore from "./audioStore";
import TranscriptStore from "./transcriptStore";
import SplitTextStore from "./splitTextStore";

export class RootStore {
    audioStore: AudioStore;
    transcriptStore: TranscriptStore;
    splitTextStore:SplitTextStore

    constructor() {
        this.audioStore = new AudioStore(this);
        this.transcriptStore = new TranscriptStore(this);
        this.splitTextStore = new SplitTextStore(this);
    }
}

const rootStore = new RootStore();

export default rootStore;
