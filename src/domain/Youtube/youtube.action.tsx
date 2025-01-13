import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'redux-saga/effects'

// import type
import { ReturnError, ReturnSuccess  } from '@/src/definisions'

// import helper
import {
    callFileUpload,
    callFileUploadTest
} from './helper/youtube.helper'


// reducer


// Root Saga登録配列
export const RootYoutubeAction = [
    takeEvery('YoutubeAction/uploadMove', uploadMove),

    // テスト用アクション
    takeEvery('YoutubeAction/uploadTest', uploadTest),
]


function* uploadMove(
    val: PayloadAction<Uint8Array>
): any {

    const digests = []

    yield put({
        type: 'SpeechAction/callVoicevox',
        payload: {
            Digests: digests
        }
    })
}

function* uploadTest(): any {
    const r = yield callFileUploadTest()
    if (r.status) {
        yield put({
            type: 'YoutubeAction/uploadTestSuccess',
            payload: r.message
        })
    }

}