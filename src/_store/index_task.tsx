import { all } from 'redux-saga/effects'

import { RootSlackAction } from '@/src/domain/Slack/slack.action'
import { RootDigestAction } from '@/src/domain/Digest/digest.action'
import { RootSpeechAction } from '@/src/domain/Speech/speech.action'
import { RootMovieAction } from '../domain/Movie/movie.action'

export default function* rootSaga() {
    yield all([
        ...RootSlackAction,
        ...RootDigestAction,
        ...RootSpeechAction,
        ...RootMovieAction,
    ]);
}
