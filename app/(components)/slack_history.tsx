'use client'
import { useAppDispatch, useAppSelector } from "@/src/_store/configureStore"

export default function SlackHistory() {
    const  {historys} = useAppSelector((state) => state.SlackForm)
    
    return (
        <div className="
            
            ">
            {buildHistory(historys)}
        </div>
    )
}


const buildHistory = (historys: string[]) => {
    const history = historys.map((history: any, index: number) => {
        return (
            <div
                key={index}
                className="
                    w-[90%] m-2
                    border border-gray-500 rounded-md
                ">
                <div>
                    <p>{history['suggest']}</p>
                    <p>{history['url']}</p>
                    <p>{history['title']}</p>
                </div>
            </div>
        )
    })
    return (
        <div className="
        w-[100%] h-[400px] p-4 m-2 ms-[10%]
        overflow-y-auto
        ">
            {history}
        </div>
    )
}