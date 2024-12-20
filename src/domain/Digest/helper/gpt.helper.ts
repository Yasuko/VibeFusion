import { ReturnSuccess, ReturnError } from '@/src/definisions'

import {
    ChatModel
} from '@/src/domain/_model/chat.model'

export const callGPTAPI = async (
    message: string
): Promise<ReturnSuccess<string> | ReturnError> => {
    const API = (process.env.OPENAI_API_KEY) ? process.env.OPENAI_API_KEY : ''
    const r = await ChatModel.call(API)
                .buildSendContents(message, [])
                .callDocumentSummary({
                    max_tokens: 5000,
                })
    
    if (!r.choices) {
        return {
            status: false,
            message: 'error'
        }
    }

    return {     
        status: true,
        message: r.choices[0].message.content
    }
}

export const parseGPTJson = <T>(message: string): T => {
    const correctJsonString = message
    .replace(/`\n?'?\s*\+\s*'?/g, '') // 連結のための文字列を削除
    .replace(/,\s+\]/g, ']') // 不要なカンマを削除
    .slice(7, -3)
    return JSON.parse(correctJsonString) as T
}

export const sleep = (sec: number) => new Promise(resolve => setTimeout(resolve, sec * 1000))