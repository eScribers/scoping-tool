import {makeAutoObservable} from "mobx";
import {RootStore} from ".";

class AudioStore {
    audioRef:HTMLAudioElement | null = null;
    playHead: number = 0;
    isPlay: boolean = false;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setPlayHead(v: number) {
        if (!this.audioRef) return;
        this.playHead = v;
        this.audioRef.currentTime = v;
    }

    setAudioRef(ref:HTMLAudioElement){
        this.audioRef = ref
    }

    setIsPlay(v:boolean){
        this.isPlay = v
    }


}

export default AudioStore