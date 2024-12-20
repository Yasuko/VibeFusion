'use client'
import { useAppDispatch, useAppSelector } from "@/src/_store/configureStore"

export default function DigestList() {
    const  {Digests} = useAppSelector((state) => state.DigestForm)
    if (Digests.length == 0)
        return (
            <div className="
                w-[70%] h-[400px] p-4 m-2 ms-[10%]
                overflow-y-auto
                ">
                <p>データがありません</p>
            </div>
        )
    
    return (
        <div className="
            w-[70%] h-[400px] p-4 m-2 ms-[10%]
            overflow-y-auto
            ">
            {buildList(Digests)}
        </div>
    )
}


const buildList = (digests: any[]) => {
    return digests.map((digest: any, index: number) => {
        return (
            <div
                key={index}
                className="
                    w-[90%] m-2
                    border border-gray-500 rounded-md
                    grid grid-cols-5

                ">
                <div className="col-span-5">
                    <p>Suggest : { digest['suggest'] }</p>
                </div>
                <div className="col-span-5">
                    <p>URL : { digest['url'] }</p>
                </div>
                <div className="col-span-5">
                    <p>Title : { digest['title'] }</p>
                </div>
                { buildTalk(digest['chatMessages']) }
            </div>
        )
    })
}

/**
 * トークを表示するコンポーネントを作成します。
 */
const buildTalk = (talks: any[]) => {
    const r =  talks.map((talk: any, index: number) => {
        return (
            <div
                className="
                
                grid grid-cols-5
                m-2 border border-gray-500 rounded-md
                "
                key={index}>
                <div
                    className="
                        text-center
                        col-span-1
                    ">
                    <p>{ talk['talker'] }</p>
                </div>
                <div
                    className="
                        col-span-4
                    ">
                    {/*<p>{ talk['message'].join('') }</p>*/}
                    <p>{ talk['message'] }</p>
                </div>
            </div>
        )
    })
    return (
        <div className="w-full m-0 p-0 col-span-5">
            {r}
        </div>
    )
}
