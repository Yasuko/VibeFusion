import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { YoutubeFormType, initialYoutubeForm } from './__type.search'

export interface YoutubeFormPropsInterface {
    YoutubeForm? : YoutubeFormType
    dispatch?   : Dispatch
}
export type YoutubeFormInterface = YoutubeFormType
export const initialState: YoutubeFormInterface = initialYoutubeForm

const slice = createSlice({
    name: 'YoutubeForm',
    initialState,
    reducers: {
        set: (
            state: YoutubeFormInterface,
            action: PayloadAction<YoutubeFormInterface>
        ) => {
            return action.payload
        },
        update: (
            state: YoutubeFormInterface,
            action: PayloadAction<Partial<YoutubeFormInterface>>
        ) => {
            return { ...state, ...action.payload }
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
