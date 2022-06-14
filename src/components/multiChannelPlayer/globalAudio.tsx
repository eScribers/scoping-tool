import audio1 from './audio1.mp3';
import audio2 from './audio2.mp3';
import audio3 from './audio3.mp3';
import audio4 from './audio4.mp3';
import audio5 from './audio5.mp3';

const audios = [
    new Audio(audio1),
    new Audio(audio2),
    new Audio(audio3),
    new Audio(audio4),
    new Audio(audio5)
];

let currentlyPlaying:any = null;

const play = () => {
    audios.forEach((audio:any) => audio.play());
};

const pause = () => {

    audios.forEach((audio:any) => audio.pause());

};

export default {
    pause,
    play
};