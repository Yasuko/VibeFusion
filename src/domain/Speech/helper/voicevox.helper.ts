import {
    setPushOptions,
    callAudioQuery, callSynthesisQuery,
    setQueryOptions
} from '@/src/_lib/voicebox/voicebox.service'

import {
    addDictionary,
    getDictionary
} from '@/src/_lib/voicebox/dictionary.service'

import {
    EncoderService
} from '@/src/_lib/encoder/encoder.service'

import {
    blobToUint8Array
} from '@/src/_lib/_helper/convert.helper'
import { DigestFormType } from '../../Digest/reducers/__type.search'

/**
 * 3 ずんだもん
 * 68　ふなっしー？
 * 音声モデル対応表
 * https://github.com/VOICEVOX/voicevox_fat_resource/blob/main/core/model/README.md#%E9%9F%B3%E5%A3%B0%E3%83%A2%E3%83%87%E3%83%ABvvm%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%81%A8%E5%A3%B0%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E5%90%8D%E3%81%A8%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB-id-%E3%81%AE%E5%AF%BE%E5%BF%9C%E8%A1%A8
 */ 


let ffmpegLog = true

export type SpeakerType<T> = {
    name: string,
    audio: T,
    time: number,
    time_list?: number[]
}

const silence: {[key:string]: null | Uint8Array} = {
    sec02: null,
    sec05: null,
    sec1: null,
    sec2: null,
}

/**
 * 
 * @param digest 
 * @returns 
 * 
 * VoiceBoxの戻りデータはBlob、Uint8Arrayにその場で変換すると
 * 後ffmpegの処理でアクセス失敗で止まる。
 * どの段階でUint8Arrayに変換しても失敗し、ffmpeg内で変換した場合のみ成功する。
 * 原因不明、メモリ関係なのは確定。
 */
export const convertTextToVoice = async (
    chatMessages: {
        talker: string,
        message: string
    }[]
): Promise<SpeakerType<Uint8Array>[]> => {

    const audios: SpeakerType<Uint8Array>[] = []

    const loaded = Object.keys(silence).every((key) => silence[key] !== null)
    if (!loaded) await generateSilenceAudio()

    for (const messages of chatMessages) {

        const chunk_audios: SpeakerType<Blob | Uint8Array>[] = []

        //for (const _t of messages.message) {
        const _t = messages.message
            // 空文字の場合はスキップ
            if (_t === '') continue

            setPushOptions({
                // すんだもんが含まれる場合は 3 　それ以外は 68
                speaker: (messages.talker === 'ずんだもん') ? 3 : 68,
                text: _t
            })
            // voicevoxAPIをコールし 音声合成用クエリを作成
            await callAudioQuery()
            // console.log('Return VoiceVox API1 :: ', r)

            setQueryOptions({
                speedScale: 1.3,        // 話す速度
                volumeScale: 4.0,       // 音量
                prePhonemeLength: 0.4,  // 音声の前の無音部分
                postPhonemeLength: 0.0, // 音声の後の無音部分
            })

            // voicevoxAPIをコールし、音声合成を開始
            const _r: {
                name: string
                audio: Blob
                time: number
            } | false = await callSynthesisQuery<Blob>('blob')

            if (_r === false) {
                console.log('VoiceVox API Error :: ', _r)
                continue
            }

            console.log('Return VoiceVox API2 :: ', messages.talker, _t)

            chunk_audios.push(_r)
            chunk_audios.push({
                name: 'silence-0.2sec',
                audio: silence.sec02 as Uint8Array,
                time: 0.2
            })
        //}
        console.log('Chunk Audios :: ', chunk_audios)
        chunk_audios.push({
            name: 'silence-0.5sec',
            audio: silence.sec05 as Uint8Array,
            time: 0.5
        })
        console.log('Chunk Audios :: ', chunk_audios)
        // セリフごとの音声チャンクを結合
        audios.push(await concatChunkAudio(chunk_audios))
        
    }
    return audios
}

export const addDictionaryData = async (
    terms: {
        surface: string,
        pronunciation: string,
        accent_type: number
    }[]
): Promise<void> => {
    for (const term of terms) {
        await addDictionary({
            surface: term.surface,
            pronunciation: term.pronunciation,
            accent_type: term.accent_type,
            word_type: "PROPER_NOUN",
            priority: 1
        })
    }
    return
}

export const getDictionaryData = async (): Promise<any> => {
    const dic = await getDictionary()
    console.log('Dictionary :: ', dic)
    return dic
}

/**
 * トークを結合し、サイト単位の音声ファイルを生成
 * @param _audios 
 * @returns 
 */
export const generateStory = async (
    _audios: Uint8Array[]
): Promise<any> => {
    return await encodeAudio(_audios)
}

/**
 * 無音の音声ファイルを生成
 */
const generateSilenceAudio = async (
): Promise<void> => {
    if (silence.sec02 === null) {
        silence.sec02 = await EncoderService.call().getNullAudio(0.2, ffmpegLog)
    }
    if (silence.sec05 === null) {
        silence.sec05 = await EncoderService.call().getNullAudio(0.5, ffmpegLog)
    }
    if (silence.sec1 === null) {
        silence.sec1 = await EncoderService.call().getNullAudio(1, ffmpegLog)
    }
    if (silence.sec2 === null) {
        silence.sec2 = await EncoderService.call().getNullAudio(2, ffmpegLog)
    }
    return
}


/**
 * オーディオファイルの結合
 * @param audios 
 * @param filename 
 * @returns 
 */
const encodeAudio = async (
    _audios: Uint8Array[],
    filename: string = 'result'
): Promise<{
    data: File,
    name: string
}> => {
    await EncoderService.call().concatWav(_audios, ffmpegLog)
    // console.log('Concat Audio :: ', encoder)
    EncoderService.call().downloadResult('wav', filename)
    return EncoderService.call().getResult()
}

/**
 * セリフ単位の音声ファイルを結合し、再生時間を集計する
 * @param chunks {
 *    name: string,
 *    audio: Blob,
 *    playtime: number
 * }[]
 * @returns Promise<any>
 */
const concatChunkAudio = async (
    chunks: {
        name: string,
        audio: Blob | Uint8Array,
        time: number
    }[]
): Promise<SpeakerType<Uint8Array>> => {

    let time = 0
    const time_list: number[] = []
    const audios: Uint8Array[] = []

    for (const chunk of chunks) {
        console.log('Chunk :: ', chunk.audio)
        if (!chunk.name.includes('silence') && chunk.audio instanceof Blob)
            audios.push(await blobToUint8Array(chunk.audio))
        else
            audios.push(chunk.audio as Uint8Array)
        time += chunk.time
        time_list.push(chunk.time)
    }

    const result = await EncoderService.call().concatWav(audios, ffmpegLog)

    return {
        name: 'audio',
        audio: result,
        time: time,
        time_list: time_list
    }
}
