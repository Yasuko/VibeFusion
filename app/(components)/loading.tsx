'use client'
import { useAppDispatch, useAppSelector } from "@/src/_store/configureStore"

import SlackHistory from "@/app/(components)/slack_history"
import DigestList from "@/app/(components)/digest_list"

export default function Debug() {
    const dispatch = useAppDispatch()

    return (
        <div
        className="
            absolute top-0 left-0
            grid grid-cols-1
            w-[250px] h-svh
            items-center
            gap-2 sm:p-4
            font-[family-name:var(--font-geist-sans)]
            shadow-md
        ">
            <div 
                className="
                col-span-1 h-[50px]
                ">
                <button
                    className="bg-blue-700 p-2 rounded-lg hover:bg-blue-800"
                    onClick={() => dispatch({type: 'SlackAction/callSlackAPI'})}>
                    Main Process
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-green-700 p-2 rounded-lg hover:bg-green-800"
                    onClick={() => dispatch({type: 'MovieAction/createTest'})}>
                    Movie Making
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-green-700 p-2 rounded-lg hover:bg-green-800"
                    onClick={() => dispatch({type: 'MovieAction/generateTitle'})}>
                    Opening Movie
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-green-700 p-2 rounded-lg hover:bg-green-800"
                    onClick={() => dispatch({type: 'MovieAction/generateNull'})}>
                    Middle Movie
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-purple-700 p-2 rounded-lg hover:bg-purple-800"
                    onClick={() => dispatch({type: 'DigestAction/ScreenShotTest'})}>
                    ScreenShot
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-yellow-700 p-2 rounded-lg hover:bg-yellow-800"
                    onClick={() => dispatch({type: 'MovieAction/openingImageTest'})}>
                    OpeningImage
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-yellow-700 p-2 rounded-lg hover:bg-yellow-800"
                    onClick={() => dispatch({type: 'MovieAction/titleImageTest'})}>
                    TitleImage
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-pink-700 p-2 rounded-lg hover:bg-pink-800"
                    onClick={() => dispatch({type: 'SlackAction/callSlackAPITest'})}>
                    SlackAPI
                </button>
            </div>
            <div
                className="
                col-span-1
                ">
                <button
                    className="bg-pink-700 p-2 rounded-lg hover:bg-pink-800"
                    onClick={() => dispatch({type: 'SlackAction/digestTest'})}>
                    DigestHistory
                </button>
            </div>
        </div>
    )
}
