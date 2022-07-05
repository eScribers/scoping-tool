import React, {FC, useEffect, useState} from "react"
import {WordInterface, HandleWordBlurInterface, HandleWordChangeInterface} from "../types";
import {observer} from "mobx-react-lite";
import audioParams from "../../../store";

interface FileWordInterface {
    onChangeWord: (params: HandleWordChangeInterface) => void,
    onBlurWord: (params: HandleWordBlurInterface) => void,
    word: WordInterface,
    sIndex: number,
    wIndex: number
}

const TranscriptFileWord: FC<FileWordInterface> = ({
                                                       onChangeWord,
                                                       onBlurWord,
                                                       word,
                                                       sIndex,
                                                       wIndex
                                                   }) => {
    const {playHead} = audioParams
    const [isInTimeRange, setIsInTimeRange] = useState<boolean>(false)

    useEffect(()=>{
        if (word.TimeRange?.StartTime) {
            setIsInTimeRange(word.TimeRange.StartTime <= playHead && word.TimeRange.EndTime >= playHead)
        }
    },[playHead])

    useEffect(()=>{
        if(isInTimeRange){
            document.getElementById(`sentence_${sIndex}_word_${wIndex}`)?.scrollIntoView({
                block: 'center',
            });
            console.log('render',isInTimeRange)
        }


    },[isInTimeRange])
    console.log('render', word.Text)
    return (
        <span
            id={`sentence_${sIndex}_word_${wIndex}`}
            key={wIndex}
            style={isInTimeRange ? {background: 'yellow'} : {}}
            contentEditable
            suppressContentEditableWarning={true}
            onKeyUp={(e) => onChangeWord({
                oldword: word.Text,
                word: e.currentTarget.textContent,
                sIndex: sIndex,
                wordIndex: wIndex,
                keyCode: e.code
            })}

            onBlur={(e) => onBlurWord({
                oldword: word.Text,
                word: e.currentTarget.textContent,
                sIndex: sIndex,
                wordIndex: wIndex
            })}
        >
          {word.Text}
      </span>
    )
}

export default React.memo(observer(TranscriptFileWord),((prevProps,nextProps) => {
    return true
}))