import {
    getNullFlips as _getNullFlips,
    getTitleFlips as _getTitleFlips,
    getOpeningFlips as _getOpeningFlips,
    generateBlowout as _generateBlowout,
    textToImageTag
} from '@/src/_lib/encoder/flip.service'
import { extensionToDataURIHeader } from '@/src/_lib/_helper/convert.helper'

const FPS = 2

export type BlowOutType = {
    text: string,
    flip: string[],
    speaker: string
}

export const getNullFlips = async (
    time: number
): Promise<BlowOutType[]> => _getNullFlips(time)

export const getTitleFlips = async (
    title: string,
    time: number
): Promise<BlowOutType[]> => _getTitleFlips(title, time)

export const getOpeningFlips = async (
    talks: any,
    titles: string[],
    timeSchedule: string[] = ['0秒', '0秒', '0秒', '0秒', '0秒','0秒', '0秒', '0秒', '0秒', '0秒']
//): Promise<BlowOutType> => {
): Promise<BlowOutType[]> => _getOpeningFlips(talks, titles, timeSchedule)

/**
 * テキストを20文字分割して、吹き出しを生成する
 * @param param0 
 */
export const generateBlowout = async (
    speechs: {
        message: string,
        talker: string
    }[],
    screenShot: string,
    url: string,
    title: string,
    talks: any
): Promise<BlowOutType[]> => _generateBlowout(speechs, screenShot, url, title, talks)

export const toImageTag = async (
    text: string
): Promise<HTMLImageElement> => {
    return await textToImageTag(extensionToDataURIHeader('png') + text)
}