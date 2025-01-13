import { ReturnSuccess, ReturnError } from '@/src/definisions'
import {
    setMoveProperties,
    uploadVideo
} from '@/src/_lib/youtube/uploader.service'
import { YoutubeDescriptionType } from '../../_lib/youtube/_description'
import { urlBase64ToUint8Array } from '../../_lib/_helper/convert.helper'


export const uploadMoveFile = async (
    moveProperty: YoutubeDescriptionType,
    file: string
): Promise<ReturnSuccess<string> | ReturnError> => {
    await setMoveProperties(moveProperty)
    const r = await uploadVideo(urlBase64ToUint8Array(file))
    return {
        status: true,
        message: r
    }
}

export const uploadTest = async (): Promise<ReturnSuccess<string> | ReturnError> => {
    const r = await uploadVideo('E01_04.mp4')
    return r
}
