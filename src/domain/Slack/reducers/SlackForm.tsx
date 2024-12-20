import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { SlackFormType, initialSlackForm } from './__type.slack'

export interface SlackFormPropsInterface {
    SlackForm? : SlackFormType
    dispatch?   : Dispatch
}
export type SlackFormInterface = SlackFormType
export const initialState: SlackFormInterface = initialSlackForm

const slice = createSlice({
    name: 'SlackForm',
    initialState,
    reducers: {
        set: (
            state: SlackFormInterface,
            action: PayloadAction<Partial<SlackFormInterface>>
        ) => {
            return Object.assign({}, state, {
                text: action.payload.text || state.text,
            })
        },
        setHistorys: (
            state: SlackFormInterface,
            action: PayloadAction<Partial<SlackFormInterface>>
        ) => {
            return Object.assign({}, state, {
                historys: action.payload.historys || state.historys,
            })
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
