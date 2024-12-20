import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SpeechType, initialSpeech } from './__type.search'

export interface SpeechPropsInterface {
    Speech? : SpeechType
    dispatch?   : Dispatch
}
export type SpeechInterface = SpeechType
export const initialState: SpeechInterface = initialSpeech

const slice = createSlice({
    name: 'Speech',
    initialState,
    reducers: {
        set: (
            state: SpeechInterface,
            action: PayloadAction<Partial<SpeechInterface>>
        ) => {
            return Object.assign({}, state, {
                
            })
        },
        addManuscripts: (
            state: SpeechInterface,
            action: PayloadAction<SpeechType['Digests']>
        ) => {
            const _state = Object.assign({}, state)
            if (_state.Digests.length == 0) {
                return Object.assign({}, state, {
                    Manuscripts: [action.payload]
                })
            }
            return Object.assign({}, state, {
                Manuscripts: [..._state.Digests, action.payload]
            })
        },
        addSpeechs: (
            state: SpeechInterface,
            action: PayloadAction<SpeechType['Speechs']>
        ) => {
            const _state = Object.assign({}, state)
            if (_state.Speechs.length == 0) {
                return Object.assign({}, state, {
                    Speechs: [action.payload]
                })
            }
            return Object.assign({}, state, {
                Speechs: [..._state.Speechs, action.payload]
            })
        },
        addStorys: (
            state: SpeechInterface,
            action: PayloadAction<SpeechType['Storys']>
        ) => {
            const _state = Object.assign({}, state)
            if (_state.Storys.length == 0) {
                return Object.assign({}, state, {
                    Storys: [action.payload]
                })
            }
            return Object.assign({}, state, {
                Storys: [..._state.Storys, action.payload]
            })
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
