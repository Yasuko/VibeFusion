import { ReturnSuccess, ReturnError } from "@/src/definisions"


export const callScreenShotTestAPI = async (
    url: string
): Promise<ReturnSuccess<string> | ReturnError> => {
    const param = '?url=' + url + '&test=screenshot'
    const r = await fetch('http://localhost:3000/api/digest' + param, {
        method: 'GET'
    })
    const json = await r.json()
    console.log(json.message)
    if (r.status === 200) {
        const img = new Image()
        img.src = json.message
        img.onload = () => {
            console.log('load')
            const dom = document.getElementById('digest-test') as HTMLDivElement
            dom.appendChild(img)
        }
    }

    return {
        status: false,
        message: 'error'
    }
}
