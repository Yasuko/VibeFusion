import {
    ReturnSuccess, ReturnError
} from '@/src/definisions'
import { SlackHistoryType } from '../reducers/__type.slack'

export const getLatestHistory = async (
    limit: number = 8
): Promise<ReturnSuccess<SlackHistoryType[]> | ReturnError> => {
    const r = await fetch('http://localhost:3000/api/slack', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    
    const json = await r.json()
    console.log('json', json)
    if (r.status === 200) {
        return {
            status: true,
            message: extractText(json, limit)
        }
    }

    return {
        status: false,
        message: 'error'
    }
}

/**
 * SlackAPIの戻りデータから、テキストのみを抽出する
 */
export const extractText = (
    historys: any,
    limit: number
): {
    suggest: string,
    url: string,
    title: string,
    text: string,
}[] => {
    const _historys: any[] = []
    let counter = 0
    for (const history of historys['message']) {
        if (history['htmls'].length === 0) {
            continue
        }
        _historys.push({
            suggest: history['text'],
            url: history['htmls'][0].url,
            title   : history['htmls'][0].title,
            text: history['htmls'][0].text,
        })

        if (counter > limit) break
        counter++
    }
    return _historys
}