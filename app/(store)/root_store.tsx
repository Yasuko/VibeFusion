'use client'

import { Provider } from 'react-redux'
import { createStore }  from "@/src/_store/configureStore";

const store = createStore()

export default function RootStore({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <Provider store={store}>{children}</Provider>
    )
}