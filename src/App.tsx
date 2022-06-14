import { useState, useEffect, Fragment, useRef, useCallback } from 'react'
import logo from './logo.svg'
import moment from 'moment';
import { AudioPlayer } from './components/audioPlayer/AudioPlayer';
import './App.css'

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


function App() {
  const [transcriptFile, setTranscriptFile] = useState<Sentence[]>([]);
  const [playHead, setPlayHead] = useState<number>(0);
  const ref = useRef<HTMLAudioElement>(null);
  const [device, setDevice] = useState<any>(null);



  
  const getDevices = async () => {
    try{
        // get a list of HID device as per filters
        // @ts-expect-error
        let devices = await navigator.hid.requestDevice({
            filters: [{ vendorId: footPedalVendorId, productId: footPedalProductId }]
        });
        let device = devices[0];
        // if no selection was made there is nothing to do
        if(device === undefined) return;
        if (device.opened === false) await device.open();
        setDevice(device);
    } catch( e ) { 
        console.log("FAILED: " + e);
    };
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
    document.addEventListener("contextmenu",e => e.preventDefault());
  }, [])

  useEffect(() => {
    if(!device) return;
    device.addEventListener('inputreport', (event:any) => {
        let byte1 = event.data.getInt8(0);
        switch( byte1){
            case 1: justFowardHandler(-15);break;
            case 2: ref.current?.paused ? ref.current.play() : ref.current!.pause();break;
            case 4: justFowardHandler(15);break;
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

  const loadFile = async () => {
    const file = await fetch('/transcripts/36939240-df53-4e05-b1e5-d450980e3a34-adapted_20220509_223453_08sa_4c088156.json');
    const text = await file.json();
    const converted = text.DocumentParts.map((sentence:Sentence) => (
      {
        ...sentence,
        Words: sentence.Words.map((word:Word) => ({
          ...word,
          TimeRange: !word.TimeRange ? null : {
            StartTime: moment.duration(word.TimeRange.StartTime).asSeconds(),
            EndTime: moment.duration(word.TimeRange.EndTime).asSeconds(),
          }
        }))
      }
    ))
    setTranscriptFile(converted);
  }

  useEffect(() => {
    loadFile();
  }, []);

  const saveFileToText = () => {
    
    const text:string = transcriptFile.reduce((acc: string , sentence:Sentence ) => {
      let next = acc + sentence.NameSpeaker + ':'
      const words = sentence.Words.reduce((acc: string, word:Word) => acc + word.Text,"")
      return next + words + '\n';
    }, "");
    download(text, "output.txt", "text/plain");

  }

  const download = (data:string, filename:string, type: string)=> {
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
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

  const justFowardHandler = useCallback((time: number) => {
    if(!ref.current) return;
    const setTime = ref.current.currentTime + time;
    setPlayHead(setTime);
    ref.current.currentTime = setTime;
  }, [ref.current]);
  
  if(!transcriptFile.length) return null;

  return (
    <div className="App">
    {transcriptFile.map((sentence:Sentence, s_index:number) => {
        return (
          <div key={s_index}>
            <h1>{sentence.NameSpeaker}</h1>
            <pre style={{display: 'flex', fontFamily: 'sans-serif'}}>
              {sentence.Words.map((word:Word, index:number) => {
                // Check if the word is in the current time range
                let isInTimeRange = null;
                if(word.TimeRange?.StartTime) {
                  isInTimeRange = word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead;
                }
                
                if(isInTimeRange) {
                  document.getElementById(`sentence_${s_index}_word_${index}`)?.scrollIntoView();
                }

                return (
                  <span id={`sentence_${s_index}_word_${index}`} key={index} style={isInTimeRange ? {background: 'yellow'} : {}} contentEditable dangerouslySetInnerHTML={{__html: word.Text}}/>
                )
              })}
            </pre>
          </div>
        );
      })}
      <div className="controls">
        <div>
          <button onClick={() => justFowardHandler(15)}>+15</button>
          <button onClick={() => justFowardHandler(-15)}>-15</button>
          <button onClick={() => getDevices()}>connect HID</button>
        </div>
        <div>
          <div className="player">
            <audio controls src={`/audioFiles/test.mp3`} ref={ref} />
          </div>
        </div>
        <div>
          <button style={{}} onClick={() => saveFileToText()}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default App
