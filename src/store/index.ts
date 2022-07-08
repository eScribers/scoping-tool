import AudioStore from "./audioStore";
import TranscriptStore from "./transcriptStore";
import SplitTextStore from "./splitTextStore";
import HistoryStore from "./historyStore";

export class RootStore {
    audioStore: AudioStore;
    transcriptStore: TranscriptStore;
    splitTextStore: SplitTextStore;
    historyStore: HistoryStore;

    constructor() {
        this.audioStore = new AudioStore(this);
        this.transcriptStore = new TranscriptStore(this);
        this.splitTextStore = new SplitTextStore(this);
        this.historyStore = new HistoryStore(this);
    }
}

const rootStore = new RootStore();

export default rootStore;
