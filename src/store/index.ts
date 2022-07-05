import AudioStore from "./audioStore";
import TranscriptStore from "./transcriptStore";

export class RootStore {
    audioStore: AudioStore;
    transcriptStore: TranscriptStore;

    constructor() {
        this.audioStore = new AudioStore(this);
        this.transcriptStore = new TranscriptStore(this);
    }
}

const rootStore = new RootStore();

export default rootStore;
