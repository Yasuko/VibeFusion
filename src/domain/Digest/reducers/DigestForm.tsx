import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DigestFormType, initialDigest } from './__type.search'

export interface DigestFormPropsInterface {
    DigestForm? : DigestFormType
    dispatch?   : Dispatch
}
export type DigestFormInterface = DigestFormType
export const initialState: DigestFormInterface = initialDigest

const slice = createSlice({
    name: 'DigestForm',
    initialState,
    reducers: {
        set: (
            state: DigestFormInterface,
            action: PayloadAction<DigestFormInterface>
        ) => {
            return action.payload
        },
        add: (
            state: DigestFormInterface,
            action: PayloadAction<DigestFormInterface>
        ) => {
            // state.Digestsを複製し、新しいデータを追加する
            const _state = Object.assign({}, state)

            if (_state.Digests.length == 0) {
                return Object.assign({}, state, {
                    Digests: [action.payload]
                })
            }
            return Object.assign({}, state, {
                Digests: [..._state.Digests, action.payload]
            })
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
