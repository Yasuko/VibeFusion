import {
    MovieService
} from '@/src/_lib/encoder/movie.service'
import { MovieType } from '../reducers/__type.search'
import { BlowOutType } from './canvas.helper'

let ffmpegLog = true

/**
 * セリフごとのショート映像生成
 * @param Speeches 
 * @param flips 
 * @returns 
 */
export const generateMovieShot = async (
    Speeches: MovieType['Speechs'][0]['speechMessages'] | MovieType['OPTalk'],
    flips: BlowOutType[]
): Promise<Uint8Array> => {
    
    const result: {
        movie   : Uint8Array,
        name    : string 
    }[] = []

    let MS = new MovieService()
    let play_time = 0

    for (const key in flips) {
        
        const _t = Math.ceil(Speeches[key].time)
        play_time += _t

        result.push(
            await MS.generateMovie(
                flips[key].flip,
                Speeches[key].audio,
                null,
                _t,
                'output' + key,
                ffmpegLog
            )
        )
    }

    //const _trimAudio = await MS.trimAudio('/bgm.mp3', play_time)

    const _movie = await MS.concatMovie(
                result,
                //_trimAudio,
                '/bgm.mp3',
                //null,
                play_time,
                ffmpegLog
            )

    return _movie
}

/**
 * セリフ無しのタイトル映像生成
 * @param flips 
 * @param audio 
 * @returns 
 */
export const generateNullMovie = async (
    flips: any,
    audio: Uint8Array | null = null,
): Promise<Uint8Array> => {

    let MS = new MovieService()

    const r = await MS.generateMovie(
                flips.flip,
                audio,
                null,
                4,
                'output_null',
                ffmpegLog
            )
    return r.movie
}

/**
 * タイトル映像生成
 * @param flips {
 *     text: string     // フリップ化されたテキスト
 *     flip: string[]   // フリップ画像のbase64文字列の配列
 *     speaker: string  // 話者
 * }
 * @param audio string // オーディオファイルのパス
 * @param time number   // 映像の再生時間
 * @returns Promise<Uint8Array>
 */
export const generateTitleMovie = async (
    flips: any,
    audio: string,
    time: number
): Promise<Uint8Array> => {
        
    let MS = new MovieService()

    const r = await MS.generateMovie(
                flips.flip,
                audio,
                //null,
                '/pinpon.mp3',
                time,
                'output_title',
                ffmpegLog
            )
    return r.movie
}

/**
 * 映像ショットの生成テスト
 * @param Speeches {
 *    name: string
 *    audio: Uint8Array
 *    time: number
 * }[]
 * @param flips {
 *   text: string
 *   flip: string[]
 *   speaker: string
 * }
 * @returns Promise<Uint8Array>
 */
export const generateMovieShot_test = async (
    Speeches: MovieType['Speechs'][0]['speechMessages'] | MovieType['OPTalk'],
    flips: BlowOutType[]
): Promise<Uint8Array> => {
    
    const result: {
        movie   : Uint8Array,
        name    : string 
    }[] = []

    let MS = new MovieService()
    let play_time = 0

    for (const key in flips) {
        const _t = Math.ceil(Speeches[key].time)
        play_time += _t
        result.push(
            await MS.generateMovie(
                flips[key].flip,
                null,
                null,
                _t,
                'output' + key,
                ffmpegLog
            )
        )
    }

    return await MS
            .concatMovie(
                result,
                '/bgm.mp3',
                play_time
            )

}

/**
 * 映像データの連結
 * @param movies {
 *    movie: Uint8Array
 *    name: string
 * }[]
 * @returns Promise<Uint8Array>
 */
export const concatAllMovies = async (
    movies: {
        movie: Uint8Array,
        name: string
    }[]
): Promise<Uint8Array> => {
    console.log('concatAllMovies', movies)
    let MS = new MovieService()
    return await MS.concatMovie(movies, null, 1, ffmpegLog)
}

export const extendFadeInFilter = async (
    movie: Uint8Array,
): Promise<Uint8Array> => {
    let MS = new MovieService()
    return await MS.addFadeFilter(movie, {fadeIn: 1}, ffmpegLog)
}

/**
 * 各話が、何分から再生されるかを計算して返す
 * @param speeches 
 */
export const screeningSchedule = (
    speeches: {
        url: string,
        speechMessages: {
            name: string,
            audio: Uint8Array,
            time: number
        }[]
    }[]
): string[] => {
    console.log('screeningSchedule', speeches)
    const result = []
    let time = 18
    for (const key in speeches) {

        // 秒数を「mm分ss秒」表記に変換
        const min = Math.floor(time / 60)
        const sec = Math.floor(time % 60)

        result.push(`${min}分${sec}秒`)

        const _time = speeches[key]
                        .speechMessages
                        .map(s => s.time).reduce((a, b) => a + b)
        time += _time
    }

    console.log('screeningSchedule', result)
    return result
}