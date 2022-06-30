import { makeAutoObservable } from 'mobx';

class AudioParams {
    playHead: number = 0;

    constructor() {
        makeAutoObservable(this);
    }

    setPlayHead(v:number) {
        this.playHead = v;
    }
}

const audioParams = new AudioParams();

export default audioParams;
