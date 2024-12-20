import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'redux-saga/effects'
import { ReturnSuccess, ReturnError } from '../../definisions'

// reducer
import {
    SlackFormPropsInterface,
} from '@/src/domain/Slack/reducers/SlackForm'

// import helper
import {
    getLatestHistory, extractText
} from './helper/slack.client.helper'

import { SlackFormType, SlackHistoryType } from './reducers/__type.slack'

const sf = (state: SlackFormPropsInterface) => state.SlackForm

// Root Saga登録配列
export const RootSlackAction = [
    takeEvery('SlackAction/callSlackAPI', callSlackAPI),

    // テスト用アクション
    takeEvery('SlackAction/callSlackAPITest', callSlackAPITest),
    takeEvery('SlackAction/digestTest', digestTest)
]

/**
 * SlackAPIをコールする
 */
function* callSlackAPI() {

    yield put({
        type: 'LoadScreen/on',
        payload: {
            slack: true
        }
    })

    const historys: ReturnSuccess<SlackHistoryType[]> | ReturnError
            = yield getLatestHistory()
    
    
    console.log('Start Catch Slack History')
    yield put({
        type: 'SlackForm/setHistorys',
        payload: {
            historys: historys.message
        }
    })


    yield put({
        type: 'DigestAction/sendChat',
        payload: historys.message
    })

}

/**
 * SlackAPIをコールする
 * @returns 
 */
function* callSlackAPITest() {

    const historys: ReturnSuccess<SlackHistoryType[]> | ReturnError
            = yield getLatestHistory()
    
    console.log('Slack History', historys.message)

    if (historys.status === false) {
        console.error('Error :: ', historys.message)
        return
    }
    
    yield put({
        type: 'SlackForm/setHistorys',
        payload: {
            historys: historys.message
        }
    })
}

/**
 * DigestActionテスト用SlackAPIコール
 * @returns 
 */
function* digestTest() {
    const historys: ReturnSuccess<any> | ReturnError
            = yield getLatestHistory()
    
    console.log('Slack History', historys.message)

    if (historys.status === false) {
        console.error('Error :: ', historys.message)
        return
    }
    
    yield put({
        type: 'SlackForm/setHistorys',
        payload: {
            historys: historys.message
        }
    })


    yield put({
        type: 'DigestAction/sendChatTest',
        payload: {
            historys: historys.message,
            testMode: true
        }
    })

}