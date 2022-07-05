export interface TranscriptFileInterface {
    Sentenceindex: number,
    currSpeakerIndex: number,
    Text: string,
    Speaker: string,
    StartTime: string,
    EndTime: string
}

export interface FileParams {
    IsCompleted: boolean,
    LastEditor: string,
    ParentDocId: string,
    JobRef: string,
    TimeStamp: string
}

export interface JSONFileInterface extends FileParams {
    SimpleSentances: TranscriptFileInterface[]
}