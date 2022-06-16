import {useState, useEffect, Fragment, useRef, useCallback} from 'react'
import logo from './logo.svg'
import moment from 'moment';
import {AudioPlayer} from './components/audioPlayer/AudioPlayer';
import {
    PauseCircleOutlined,
    PlayCircleOutlined,
    StepForwardOutlined,
    StepBackwardOutlined,
    SoundOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import './App.scss'
import _ from "lodash"
import {createCache, useCache} from '@react-hook/cache'

interface Word {
    ConfidenceLevel: number | null;
    FormatWord: null
    LogNote: null
    Tag: number
    Text: string
    TimeRange: {
        StartTime: number;
        EndTime: number;
    }
}

interface Sentence {
    NameSpeaker: string;
    Words: Word[];
}

const footPedalVendorId = 0x05F3;
const footPedalProductId = 0x00FF;


const fetchCache = createCache(async (key, options) => {
    console.log("Fetching", key);
    const response = await fetch(key, options);
    return response.json();
  }, 10);

function App() {
    const [transcriptFile, setTranscriptFile] = useState<Sentence[]>([]);
    const cloneTranscript = useRef<Sentence[]>([])
    const [test,setTest]= useState<Sentence[]>([])
    const [playHead, setPlayHead] = useState<number>(0);
    const ref = useRef<HTMLAudioElement>(null);
    const [device, setDevice] = useState<any>(null);
    const [isPlay, setPlay] = useState<boolean>(false)
    const [isVolume, setVolume] = useState<boolean>(false)
    const [sliders, setSliders] = useState<number[]>([0, 0, 0, 0]);
    const [showSliders, setShowSliders] = useState<boolean>(false);
    
    const [{ status, value, error, cancel }, fetchData] = useCache(
        fetchCache,
        `/transcripts/36939240-df53-4e05-b1e5-d450980e3a34-adapted_20220509_223453_08sa_4c088156.json`,
        []
      );


      useEffect(() => {
        if (status === "idle") {
            fetchData();
        }
      }, [fetchData, status]);

      useEffect(()=>{
    
        if(value){
            const converted = value.DocumentParts.map((sentence: Sentence) => (
                {
                    ...sentence,
                    Words: sentence.Words.map((word: Word) => ({
                        ...word,
                        TimeRange: !word.TimeRange ? null : {
                            StartTime: moment.duration(word.TimeRange.StartTime).asSeconds(),
                            EndTime: moment.duration(word.TimeRange.EndTime).asSeconds(),
                        }
                    }))
                }
            ))
            const localFile = window.localStorage.getItem('transcript')
        
    
            setTranscriptFile(converted);
    
            
            cloneTranscript.current = converted
        }
      

      },[value])


    const getDevices = async () => {
        try {
            // get a list of HID device as per filters
            // @ts-expect-error
            let devices = await navigator.hid.requestDevice({
                filters: [{vendorId: footPedalVendorId, productId: footPedalProductId}]
            });
            let device = devices[0];
            // if no selection was made there is nothing to do
            if (device === undefined) return;
            if (device.opened === false) await device.open();
            setDevice(device);
        } catch (e) {
            console.log("FAILED: " + e);
        }
        ;
    }


    useEffect(() => {
        // @ts-expect-error
        window.navigator.usb.getDevices().then((devices: any) => {
            console.log("Total devices: " + devices.length);
            devices.forEach((device: any) => {
                setDevice(device);
                console.log("Product name: " + device.productName + ", serial number " + device.serialNumber);
            });
        })
        document.addEventListener("contextmenu", e => e.preventDefault());
        
    }, [])

    useEffect(() => {
        if (!device) return;
        device.addEventListener('inputreport', (event: any) => {
            let byte1 = event.data.getInt8(0);
            switch (byte1) {
                case 1:
                    justFowardHandler(-15);
                    break;
                case 2:
                    ref.current?.paused ? ref.current.play() : ref.current!.pause();
                    break;
                case 4:
                    justFowardHandler(15);
                    break;
            }
        })
    }, [device])


    useEffect(() => {

        if (!ref.current) return;

        // set playHead when audio is playing
        ref.current.addEventListener("timeupdate", () => {
            if (!ref.current) return;
            setPlayHead(ref.current.currentTime);
        });
    }, [ref.current]);


    const saveFileToText = () => {

        let tFile = _.cloneDeep(transcriptFile)

        if(cloneTranscript.current.length > 0) {
            tFile = _.cloneDeep(cloneTranscript.current)
        }

        const text: string = tFile.reduce((acc: string, sentence: Sentence) => {
            let next = acc + sentence.NameSpeaker + ':'
            const words = sentence.Words.reduce((acc: string, word: Word) => acc + word.Text, "")
            return next + words + '\n';
        }, "");
        download(text, "output.txt", "text/plain");

    }

    const download = (data: string, filename: string, type: string) => {
        var file = new Blob([data], {type: type});
        // @ts-expect-error
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            // @ts-expect-error
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    const justFowardHandler = useCallback((time: number) => {
        if (!ref.current) return;
        const setTime = ref.current.currentTime + time;
        setPlayHead(setTime);
        ref.current.currentTime = setTime;
    }, [ref.current]);

    const changeVolume = (value: string) => {
        if (!ref.current) return;
        ref.current.volume = Number(value) / 100
        // setVolume(Number(value))
    };

    const playAudio = () => {
        if (!ref.current) return;
        if (!isPlay) {
            ref.current.play()
        } else {
            ref.current.pause()
        }
        setPlay(!isPlay)
    }

    const onChangeWord = (word: string | null, sIndex:number, wordIndex:number)=> {

        const updateTranscriptFile = _.cloneDeep(cloneTranscript.current)

        if(word === null) {
            return null
        }
        
        updateTranscriptFile[sIndex].Words[wordIndex].Text = word
        
        cloneTranscript.current = updateTranscriptFile
        setTest(updateTranscriptFile)
        
        console.log(cloneTranscript.current);
        
    } 



    if (!transcriptFile.length) return null;

    return (
        <div className="App">
            {transcriptFile.map((sentence: Sentence, s_index: number) => {
                return (
                    <div key={s_index}>
                        <h1 className={'speaker-header'}>{sentence.NameSpeaker}</h1>
                        <pre style={{display: 'flex', fontFamily: 'sans-serif', flexWrap: 'wrap'}}>
              {sentence.Words.map((word: Word, index: number) => {
                  // Check if the word is in the current time range
                  let isInTimeRange = null;
                  if (word.TimeRange?.StartTime) {
                      isInTimeRange = word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead;
                  }

                  if (isInTimeRange) {
                      document.getElementById(`sentence_${s_index}_word_${index}`)?.scrollIntoView({
                          block: 'center',
                          behavior: 'smooth'
                      });
                  }

                  return (
                      <span id={`sentence_${s_index}_word_${index}`} key={index}
                            style={isInTimeRange ? {background: 'yellow'} : {}}
                            contentEditable
                            onInput={(e)=> onChangeWord(e.currentTarget.textContent,s_index,index)}
                            dangerouslySetInnerHTML={{__html: word.Text}}/>
                  )
              })}
            </pre>
                    </div>
                );
            })}
            <div className="controls">
            <button onClick={() => setShowSliders(!showSliders)}>{showSliders ? 'Hide' : 'Show'} Sliders</button>
            {showSliders && (
                <>
                {sliders.map((slider: number, index: number) => {
                                return (
                                    <input type="range" key={index}
                                            value={slider}
                                            className="vranger"
                                            onChange={(e) => {
                                                const newSliders = [...sliders];
                                                newSliders[index] = Number(e.currentTarget.value);
                                                setSliders(newSliders);
                                            }
                                            }
                                    /> 
                                    
                                )
                            }
                            )}
                </>
            )}
            

                <div style={{display: 'none'}}>
                    <div className="player">
                        <audio controls src={`/audioFiles/test.mp3`} ref={ref}/>
                    </div>
                </div>
                <div className={'player-controls'}>
                    <button onClick={() => justFowardHandler(-15)} title='backward -15s'><StepBackwardOutlined/></button>
                    <button onClick={playAudio} title={isPlay ? 'pause audio' : 'play audio'}>
                        {isPlay ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
                    </button>
                    <button onClick={() => justFowardHandler(15)} title='forward +15s'><StepForwardOutlined/></button>
                    <div className='volume-control'>
                        <input
                            type="range"
                            className="volume-range"
                            onChange={(e) => changeVolume(e.currentTarget.value)}
                        />
                        <SoundOutlined/>
                    </div>
                    <button title='download audio'>
                        <DownloadOutlined/>
                    </button>
                    <button
                        onClick={() => getDevices()}
                        className={'hid-btn'}
                    >
                        connect HID
                    </button>

                    <button
                        onClick={() => saveFileToText()}
                        className='save-btn'
                    >
                        Save to text
                    </button>
                </div>
            </div>
        </div>
    )
}

export default App
