import {RootStore} from "./index";
import {makeAutoObservable} from "mobx";

class SplitTextStore {
    splitText: string = '';
    splitTextIndex: number | null = null;
    splitTextStart: number = 0;
    splitTextEnd: number = 0;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setSplitTextParams(params:{text: string, sIndex: number | null, start: number, end: number}) {
        this.splitText = params.text;
        this.splitTextIndex = params.sIndex;
        this.splitTextStart = params.start;
        this.splitTextEnd = params.end;
    }
}

export default SplitTextStore