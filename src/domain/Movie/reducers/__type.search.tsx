import {
    DigestsType,
    SpeechsType,
    OpTalkType,
} from '@/src/definisions'

/**********************************
 * Movie
 *********************************/
export type MovieType = {
    Digests: DigestsType
    Speechs: SpeechsType
    OPTalk: OpTalkType
}

export const initialMovie: MovieType = {
    Digests: [],
    Speechs: [],
    OPTalk: [],
}
