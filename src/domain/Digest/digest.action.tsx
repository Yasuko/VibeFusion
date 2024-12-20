import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'redux-saga/effects'

// import type
import { ReturnError, ReturnSuccess, DigestType } from '@/src/definisions'
import { SlackHistoryType } from '@/src/domain/Slack/reducers/__type.slack'

// import helper
import {
    callDigestAPI,
} from './helper/digest.helper'
import {
    callScreenShotTestAPI
} from './helper/screen_shot.helper'

// reducer


// Root Saga登録配列
export const RootDigestAction = [
    takeEvery('DigestAction/sendChat', sendChat),

    // テスト用アクション
    takeEvery('DigestAction/ScreenShotTest', ScreenShotTest),
    takeEvery('DigestAction/sendChatTest', sendChatTest),
]

function* ScreenShotTest() {
    console.log('ScreenShotTest')
    const url = 'https://akerun.hateblo.jp/entry/2024/12/03/000000'
    const r: ReturnSuccess<string> | ReturnError = yield callScreenShotTestAPI(url)
    console.log('ScreenShotTest Result :: ', r)
}

/**
 * Chatを送信する
 */
function* sendChat(
    val: PayloadAction<SlackHistoryType[]>
): any {

    console.log('Start Generate Digests')

    const digests = []
    for (const v of val.payload) {
        const r: ReturnSuccess<DigestType> | ReturnError = yield callDigestAPI(v.text, v.url)
        console.log('Digests API Result :: ', r)

        if (r.status === false) {
            console.error('Error :: ', r.message)
            continue
        }

        const push = {
            url: v.url,
            title: v.title,
            suggest: v.suggest,
            screenShot: r.message.screenShot,
            chatMessages: r.message.chatMessages,
            summary: r.message.summary,
            terms: r.message.terms
        }

        yield put({
            type: 'DigestForm/add',
            payload: push
        })
        digests.push(push)
        break
    }

    console.log('Digests', digests)

    yield put({
        type: 'SpeechAction/callVoicevox',
        payload: {
            Digests: digests
        }
    })
}

function* sendChatTest(
    val: PayloadAction<{
        testMode: boolean,
        historys: SlackHistoryType[]
    }>
): any {

    console.log('Slack API Payload :: ', val.payload)

    if (val.payload.testMode === undefined || !val.payload.testMode) {
        console.log('Test Mode is not set')
        return
    }

    const digests = []
    for (const v of val.payload.historys) {
        const r: ReturnSuccess<DigestType> | ReturnError
                    = yield callDigestAPI(v.text, v.url)

        console.log('Digests API Result :: ', r.message)

        if (r.status === false) {
            console.error('Error :: ', r.message)
            continue
        }

        const push = {
            url: v.url,
            title: v.title,
            suggest: v.suggest,
            screenShot: r.message.screenShot,
            chatMessages: r.message.chatMessages,
            summary: r.message.summary,
            terms: r.message.terms
        }

        yield put({
            type: 'DigestForm/add',
            payload: push
        })
        digests.push(push)
        break
    }

    console.log('Digests :: ', digests)

}