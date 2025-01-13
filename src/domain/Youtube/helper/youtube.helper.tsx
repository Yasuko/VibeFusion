import { ReturnSuccess, ReturnError } from "@/src/definisions"
import {
    DigestType
} from "@/src/definisions"
import { YoutubeDescriptionType } from "../../../_lib/youtube/_description"
import { uint8ArrayToUrlBase64 } from "../../../_lib/_helper/convert.helper"

/**
 * 
 * @param message string
 * @returns 
 */
export const callFileUpload = async (
    moveProperty: YoutubeDescriptionType,
    file: Uint8Array
): Promise<ReturnSuccess<DigestType> | ReturnError> => {
    const r = await fetch('http://localhost:3000/api/youtube', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            moveProperty,
            file: uint8ArrayToUrlBase64(file)
        })
    })

    if (r.status === 200) {
        const json = await r.json()
        const digests = JSON.parse(json.message.digests)
        console.log('digests :: ', digests)
        return {
            status: true,
            message: digests
        }
    }

    return {
        status: false,
        message: 'error'
    }
}

export const callFileUploadTest = async (

): Promise<ReturnSuccess<string> | ReturnError> => {
    const r = await fetch('http://localhost:3000/api/youtube', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (r.status === 200) {
        const json = await r.json()
        console.log('json :: ', json)
        return {
            status: true,
            message: json.message
        }
    }

    return {
        status: false,
        message: 'error'
    }
}

