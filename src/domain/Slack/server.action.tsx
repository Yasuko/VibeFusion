// import helper
import { getLatestHistory } from './helper/slack.api.helper'

export type SucessResponse = {
    status: true
    message: any
}

export type ErrorResponse = {
    status: false
    message: string
}

export const get_history = async (
    val: any
): Promise<SucessResponse | ErrorResponse> => {
    const r = await getLatestHistory()
    if (r.status === false) {
        return {
            status: false,
            message: 'Faild to get history'
        }
    } else {
        return {
            status: true,
            message: r.message
        }
    }
}
