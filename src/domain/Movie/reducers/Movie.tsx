import { Dispatch, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { MovieType, initialMovie } from './__type.search'

export interface MoviePropsInterface {
    Movie? : MovieType
    dispatch?   : Dispatch
}
export type MovieInterface = MovieType
export const initialState: MovieInterface = initialMovie

const slice = createSlice({
    name: 'Movie',
    initialState,
    reducers: {
        set: (
            state: MovieInterface,
            action: PayloadAction<MovieInterface>
        ) => {
            return action.payload
        },
        reset: () => {
            return initialState
        }
    }
})

export default slice.reducer
