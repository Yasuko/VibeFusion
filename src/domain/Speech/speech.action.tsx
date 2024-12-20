import { PayloadAction } from '@reduxjs/toolkit'
import { put, select, takeEvery } from 'redux-saga/effects'

// import helper
import {
    convertTextToVoice,
    generateStory,
    addDictionaryData,
    getDictionaryData,
    SpeakerType
} from '@/src/domain/Speech/helper/voicevox.helper'
import {
    getToday
} from '@/src/domain/Speech/helper/tools.helper'

// reducer
import Speech, {
    SpeechPropsInterface,
} from '@/src/domain/Speech/reducers/Speech'
import {
    TitleCall
} from '@/src/domain/Speech/reducers/SpeechTemplate'

import { SpeechType } from './reducers/__type.search'
import { DigestFormType } from '../Digest/reducers/__type.search'

// Root Saga登録配列
export const RootSpeechAction = [
    takeEvery('SpeechAction/callVoicevox', callVoicevox),

]

function* callVoicevox(
    val: PayloadAction<{Digests: DigestFormType['Digests']}>
) {

    console.log('Start Generate Speechs')
    const SpeechList: SpeechType['Speechs'] = []

    // オープニングトークのスピーチを生成
    const op_talk: SpeakerType<Uint8Array>[] = yield convertTextToVoice(TitleCall(getToday()))

    for (const v of val.payload.Digests) {
        yield addDictionaryData(v.terms)
        yield getDictionaryData()
        const speeches: SpeakerType<Uint8Array>[] = yield convertTextToVoice(v.chatMessages)
        console.log('Speech List :: ', speeches)

        SpeechList.push({
            url: v.url,
            speechMessages: speeches
        })
        // break
    }

    yield put({
        type: 'MovieAction/generateMovie',
        payload: {
            Digests: val.payload.Digests,
            Speeches: SpeechList,
            OPTalk: op_talk
        }
    })
}
