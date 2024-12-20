import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'

export interface LoadScreenPropsInterface {
    Loading? : LoadScreenInterface
    dispatch?   : Dispatch
}
export type LoadScreenInterface = {
    slack: boolean
    digest: boolean
    flip: boolean
    movie: boolean
    speech: boolean
    fusion: boolean
}
export const initialState: LoadScreenInterface = {
    slack: false,
    digest: false,
    flip: false,
    movie: false,
    speech: false,
    fusion: false
}

const slice = createSlice({
    name: 'LoadScreen',
    initialState,
    reducers: {
        set: (
            state: LoadScreenInterface,
            action: PayloadAction<LoadScreenInterface>
        ) => {
            return action.payload
        },
        on: (
            state: LoadScreenInterface,
            action: PayloadAction<Partial<LoadScreenInterface>>
        ) => {
            return { ...initialState, ...action.payload }
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
