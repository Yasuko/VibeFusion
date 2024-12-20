'use client'

import SlackHistory from "@/app/(components)/slack_history"
import DigestList from "@/app/(components)/digest_list"
import Debug from "@/app/(components)/debug"

export default function Home() {

    return (
        <div
        className="
            grid grid-cols-3
            w-svw h-svh
            items-center justify-items-center
            p-8 pb-20 gap-16 sm:p-20
            font-[family-name:var(--font-geist-sans)]
        ">
            <div className="col-span-1"></div>
            <div
                className="col-span-2">
                <h2>Slack History</h2>
                <SlackHistory />
                <h2>Digest List</h2>
                <DigestList />
            </div>


            { /**
            <div
                id='svg-test'
                className="absolute w-lvw h-lvh">
                <canvas
                    id="canvas"
                    width={1980}
                    height={1020}
                    className="absolute top-0 left-0"
                ></canvas>

                <button
                    className="absolute x-[100] y-[100]"
                    onClick={() => dispatch({type: 'MovieAction/svgTest'})}>
                    GO
                </button>
            </div>
            */ }
            <div
                id="movie-test"
                className="col-span-4 grid grid-cols-3">
            </div>
            <div
                id="digest-test"
                className="col-span-4 grid grid-cols-3">
            </div>

            <Debug />
        </div>
    )
}
