import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'redux-saga/effects'

// import helper
import {
    BlowOutType,
    generateBlowout,
    getNullFlips,
    getOpeningFlips,
    getTitleFlips,
    toImageTag
} from './helper/canvas.helper'
import {
    concatAllMovies,
    extendFadeInFilter,
    generateMovieShot,
    generateMovieShot_test,
    generateNullMovie,
    generateTitleMovie,
    screeningSchedule
} from './helper/movie.helper'

// reducer
import {
    SpeechPropsInterface,
} from '@/src/domain/Speech/reducers/Speech'
import { MovieType } from './reducers/__type.search'
import {
    TestTitleList,
    TestTalks,
    TestData
} from '@/src/domain/Movie/reducers/TestTemplate'


const s = (state: SpeechPropsInterface) => state.Speech

// Root Saga登録配列
export const RootMovieAction = [
    takeEvery('MovieAction/generateMovie', movieAction),

    // Movie生成テスト
    takeEvery('MovieAction/createTest', createTest),
    takeEvery('MovieAction/generateNull', generateNull),
    takeEvery('MovieAction/generateTitle', generateTitle),

    // 画像生成テスト
    takeEvery('MovieAction/openingImageTest', openingImageTest),
    takeEvery('MovieAction/titleImageTest', titleImageTest),
]

function* movieAction(
    val: PayloadAction<{
        Digests: MovieType['Digests'],
        Speeches: MovieType['Speechs'],
        OPTalk: MovieType['OPTalk']
    }>
) {

    console.log(`
        Movie Action Payload :: ${val.payload}
    `)

    const MovieList = []

    // オープニング映像生成開始
    console.log(`
    :: Generate Opening MovieShot ::
    `)
    console.log('OPTalk :: ', val.payload.OPTalk)
    console.log('Speeches :: ', val.payload.Speeches)
    console.log('Digests :: ', val.payload.Digests)


    const timeSchedule = screeningSchedule(val.payload.Speeches)
    const titles = val.payload.Digests.map((v) => v.title)
    const op_flips: BlowOutType[]
            = yield getOpeningFlips(val.payload.OPTalk, titles, timeSchedule)
    const op_movie: Uint8Array = yield generateMovieShot(
        val.payload.OPTalk,
        op_flips
    )
    MovieList.push({
        movie:op_movie,
        name:'Opening'
    })

    // 各映像生成
    for (const key in val.payload.Digests) {
        console.log(`
        :: Generate MovieShot ::  ${key}
        `)

        const blowout: BlowOutType[] = yield generateBlowout(
                            val.payload.Digests[key].chatMessages,
                            val.payload.Digests[key].screenShot,
                            val.payload.Digests[key].url,
                            val.payload.Digests[key].title,
                            val.payload.Speeches[key].speechMessages
                        )

        const _movie: Uint8Array = yield generateMovieShot(
                        val.payload.Speeches[key].speechMessages,
                        blowout
                    )
                    
        console.log(`
        :: Generate NullMovie :: ${key}
        `)

        const _null_blows: BlowOutType[] = yield getTitleFlips(val.payload.Digests[key].title, 3)
        const _null_movie: Uint8Array = yield generateNullMovie(_null_blows[0])
        const _filterd_null_movie: Uint8Array = yield extendFadeInFilter(_null_movie)
        
        MovieList.push({
            movie: _filterd_null_movie,
            name: 'Null' + key
        })
        MovieList.push({
            movie: _movie,
            name: 'Movie' + key
        })
    }

    // 生成した映像を連結
    console.log('MovieList', MovieList)
    yield concatAllMovies(MovieList)
}

/**
 * 試験用ショート映像生成
 * @param val 
 */
function* createTest(
    val: PayloadAction<any>
) {
    console.log('createTest')

    const blowout: BlowOutType[] = yield generateBlowout(
                        TestData,
                        yield testImage(),
                        'https://www.google.com',
                        'Google',
                        TestTalks
                    )
    console.log('blowout', blowout)
    const movie: Uint8Array = yield generateMovieShot_test(TestTalks, blowout)
    console.log('Movie Generate Test Result :: ', movie)
}

/**
 * 試験用映像間の空白映像生成
 * @param val 
 */
function* generateNull(
    val: PayloadAction<{
        time: number
    }>
) {
    console.log('generateNullMovie')
    const _movie: Uint8Array = yield generateNullMovie(3)
    console.log('Null Movie', _movie)
}

/**
 * 試験用タイトル映像生成
 * @param val 
 */
function* generateTitle(
    val: PayloadAction<{
        flips: any,
        audio: Uint8Array,
        time: number
    }>
) {
    console.log('generateTitleMovie')

    const flips: BlowOutType[] = yield getNullFlips(3)
    const _movie: Uint8Array = yield generateTitleMovie(
                    flips,
                    '/pinpon.mp3',
                    3
                )
    console.log('Title Movie', _movie)
    const title_flips: BlowOutType[] = yield getTitleFlips(TestTitleList[0], 5)
    const testIM = new Image()
    testIM.src = title_flips[0]['flip'][0]
    testIM.onload = () => {
        // ImageElementをDataURIに変換して返す
        const canvas = document.createElement('canvas')
        canvas.width = testIM.width
        canvas.height = testIM.height
        const ctx = canvas.getContext('2d')
        if (ctx === null) return

        ctx.drawImage(testIM, 0, 0)
        const dom = document.getElementById('movie-test') as HTMLDivElement
        dom.appendChild(canvas)
    }
}

function* openingImageTest(
    val: PayloadAction<any>
) {
    console.log('openingImageTest')

    console.log(TestTalks, TestTitleList)
    const imgs: BlowOutType[]  = yield getOpeningFlips(TestTalks, TestTitleList)
    console.log('imgs', imgs)

    const dom = document.getElementById('movie-test') as HTMLDivElement
    const img: HTMLImageElement = yield toImageTag(imgs[0]['flip'][0])
    dom.appendChild(img)

}

function* titleImageTest(
    val: PayloadAction<any>
) {
    console.log('titleImageTest')
    const img: BlowOutType[] = yield getTitleFlips(TestTitleList[0], 5)

    const dom = document.getElementById('movie-test') as HTMLDivElement
    const _img: HTMLImageElement = yield toImageTag(img[0]['flip'][0])
    dom.appendChild(_img)

}

const testImage = async () => {
    return new Promise((resolve, reject) => {
        const testIM = new Image()
        testIM.src = '/bg_3.png'
        testIM.onload = () => {
            // ImageElementをDataURIに変換して返す
            const canvas = document.createElement('canvas')
            canvas.width = testIM.width
            canvas.height = testIM.height
            const ctx = canvas.getContext('2d')
            if (ctx === null) return
            ctx.drawImage(testIM, 0, 0)
            resolve(canvas.toDataURL('image/png'))
        }
    })
}

