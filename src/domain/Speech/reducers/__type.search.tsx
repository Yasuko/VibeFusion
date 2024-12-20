import {
    DigestsType,
    SpeechsType,
    StorysType,
} from '@/src/definisions'

/**********************************
 * Speech
 *********************************/
export type SpeechType = {
    Digests: DigestsType
    Speechs: SpeechsType
    Storys: StorysType
}

export const initialSpeech: SpeechType = {
    Digests: [],
    Speechs: [],
    Storys: []
}
