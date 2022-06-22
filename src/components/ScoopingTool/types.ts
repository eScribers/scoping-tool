export interface WordInterface {
    ConfidenceLevel: number | null;
    FormatWord: null
    LogNote: null
    Tag: number
    Text: string
    IsNewWord?: boolean
    TimeRange: {
        StartTime: number;
        EndTime: number;
    } | null
}

export interface SentenceInterface {
    NameSpeaker: string;
    Words: WordInterface[];
}

export interface TranscriptChangesInterface {
    action: String,
    sIndex: number,
    wIndex: number,
    word: String,
    newWord: String | null
}

export interface HandleWordBlurInterface {
    oldword: string,
    word: string | null,
    sIndex: number,
    wordIndex: number
}

export interface HandleWordChangeInterface extends HandleWordBlurInterface {
    keyCode: string
}