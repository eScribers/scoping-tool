export interface WordInterface {
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

export interface SentenceInterface {
    NameSpeaker: string;
    Words: WordInterface[];
}