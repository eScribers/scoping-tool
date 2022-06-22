import React, {FC} from "react"
import {WordInterface, HandleWordBlurInterface, HandleWordChangeInterface} from "../types";

interface FileWordInterface {
    onChangeWord: (params: HandleWordChangeInterface) => void,
    onBlurWord: (params: HandleWordBlurInterface) => void,
    word: WordInterface,
    sIndex: number,
    wIndex: number,
    isInTimeRange: boolean | null
}

const TranscriptFileWord: FC<FileWordInterface> = ({
                                                       onChangeWord,
                                                       onBlurWord,
                                                       word,
                                                       sIndex,
                                                       wIndex,
                                                       isInTimeRange
                                                   }) => {
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

export default React.memo(TranscriptFileWord)