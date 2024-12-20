import { ReturnSuccess, ReturnError } from "@/src/definisions"
import {
    DigestType
} from "@/src/definisions"

/**
 * 
 * @param message string
 * @returns 
 */
export const callDigestAPI = async (
    message: string,
    url: string
): Promise<ReturnSuccess<DigestType> | ReturnError> => {
    const r = await fetch('http://localhost:3000/api/digest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            url
        })
    })

    if (r.status === 200) {
        const json = await r.json()
        const digests = JSON.parse(json.message.digests)
        console.log('digests :: ', digests)
        return {
            status: true,
            message: {
                chatMessages: digests.digests,
                summary: digests.summary,
                terms: digests.terms,
                screenShot: json.message.screenshot,
                title: '',
                suggest: '',
                url: ''
            }
        }
    }

    return {
        status: false,
        message: 'error'
    }
}

