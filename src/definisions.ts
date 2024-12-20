export type ReturnSuccess<T> = {
    status: true
    message: T
}

export type ReturnError = {
    status: false
    message: string
}

export type DigestType = {
    url: string,
    title: string,
    suggest: string,
    chatMessages: {
        talker: string,
        message: string,
    }[],
    screenShot: string,
    summary: string,
    terms: {
        surface: string,
        pronunciation: string,
        accent_type: number,
    }[]
}

export type DigestsType = DigestType[]

export type SpeechType = {
    url: string,
    speechMessages: {
        name: string,
        audio: Uint8Array,
        time: number,
    }[]
}

export type SpeechsType = SpeechType[]


export type StorysType = {
    url: string,
    storyMessages: {
        audio: Uint8Array,
        time: number,
    }[],
}[]

export type OpTalkType = {
    name: string,
    audio: Uint8Array,
    time: number,
    time_list: number[],
}[]