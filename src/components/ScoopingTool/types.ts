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