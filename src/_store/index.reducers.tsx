import { SlackReducer } from "@/src/domain/Slack/index.reducers"
import { DigestReducer } from "@/src/domain/Digest/index.reducers"
import { SpeechReducer } from "@/src/domain/Speech/index.reducers"
import { MovieReducer } from "../domain/Movie/index.reducers"

export const reducer = {
    ...SlackReducer,
    ...DigestReducer,
    ...SpeechReducer,
    ...MovieReducer,
}
