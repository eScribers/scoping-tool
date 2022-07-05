import {makeAutoObservable} from "mobx";
import {RootStore} from ".";

class AudioStore {
    playHead: number = 0;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setPlayHead(v: number) {
        this.playHead = v;
    }


}

export default AudioStore