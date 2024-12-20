import * as cheerio from 'cheerio'
import {
    fetchChannelHistory,
    SlackHistoryType,
} from "@/src/_lib/slack/slack.service"
import {
    crawler
} from "@/src/_lib/crawler/crawler.service"
import { ReturnError, ReturnSuccess } from '../../../definisions'

export type ConfigType = {
    LIMIT: number
}

export type SlackResultType = {
    user: string,
    text: string,
    ts: number,
    htmls: {
        url: string,
        title: string,
        text: string,
    }[]
}

const config: ConfigType = {
    LIMIT: 24
}
const unMatchURLS = [
    'slack.com',
    'github.com',
    'x.com',
    'twitter.com',
    'youtube.com',
    'facebook.com',
    'instagram.com',
    'google.com',
    'yahoo.co.jp',
    'amazon.co.jp',
]


export const setConfig = (config: Partial<ConfigType>) => Object.assign(config, config)
export const getConfig = () => config

export const addFilterURL = (url: string) => unMatchURLS.push(url)
export const getFilterURL = () => unMatchURLS

/**
 * SlackAPIから最新のメッセージを取得する
 * @returns 
 */
export const getLatestHistory = async () => {

    // SlackAPIからメッセージを取得
    const res = await callSlackAPI()

    if (res.status === false) {
        console.error('Failed to fetch channel history')
        return res
    }

    // 24時間より前のデータを削除
    const _filterdHistorys: SlackHistoryType[] = filterHistorys(res.message)

    // URLを含まないメッセージを削除
    const _filterdURL = filterUrls(_filterdHistorys)

    // URLからリンク先のテキストを取得
    const _fetchURL = await fetchURL(_filterdURL)
    console.log('Fetch URL', _fetchURL)

    return _fetchURL
}

const callSlackAPI = async (
): Promise<ReturnSuccess<SlackHistoryType[]> | ReturnError> => {
    let res: ReturnSuccess<SlackHistoryType[]> | ReturnError = {
        status: false,
        message: 'Slack API Call Error'
    }

    // 失敗することがあるので、最大3回リトライ
    for (let i = 0; i < 3; i++) {
        res = await fetchChannelHistory()

        if (res.status === false) {
            console.error(res.message)
            await sleep(5)
        } else {
            return res
        }
    }

    console.error('Failed to fetch channel history')
    return res
}

/**
 * historysから、24時間より前のデータを削除する
 * @param historys any[]
 * @returns any[]
 */
const filterHistorys = (
    historys: SlackHistoryType[]
): SlackHistoryType[] => {
    const now = new Date().getTime()
    const r =  historys.filter((history: SlackHistoryType) => {
        return (now - (Number(history.ts) * 1000) < config.LIMIT * 60 * 60 * 1000) ? true : false
    })
    return r
}

/**
 * URLを含まないメッセージを削除する
 * @param historys any[]
 * @returns any[]
 */
const filterUrls = (
    historys: SlackHistoryType[]
): SlackHistoryType[] => {
    const r = historys.filter((history: SlackHistoryType) => {
        const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g
        const urls = history.text?.match(urlRegex)
        return urls ? true : false
    })

    return r
}

/**
 * テキストからURLを抽出する
 */
const extractUrls = (text: string): string[] => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g
    const urls = text.match(urlRegex)
    if (!urls) return []

    // unMatchURLSに含まれるURLを削除
    const _extractedUrls = urls.filter((url: string) => {
        return unMatchURLS.every((unMatchURL) => {
            return url.indexOf(unMatchURL) === -1
        })
    })

    // |でURLが連結されている場合があるので分割
    const _splitUrls = _extractedUrls.map((url: string) => {
        if (url.indexOf('|') === -1) return url
        return url.split('|')[0]
    })

    // URLの最後が「>」で終わる場合があるので削除
    const underCatUrls = _splitUrls.map((url: string) => {
        if (url.endsWith('>')) {
            return url.slice(0, -1)
        }
    }) as string[]

    return underCatUrls
}
/**
 * URLからリンク先のWebページのタイトルと本文を取得する
 */
export const fetchURL = async (
    historys: any[]
): Promise<ReturnSuccess<SlackResultType[]> | ReturnError> => {

    const _historys: SlackResultType[] = []

    for (const history of historys) {

        // url を含むメッセージのみ処理
        const urls = extractUrls(history['text'])
        if (urls.length === 0) continue

        const _htmls = []
        for (const url of urls) {
            const response = await crawler(url)

            if (response.status === true) _htmls.push(response.message)
            else console.error('Failed to fetch URL', url)
        }
        _historys.push({
            user: history['user'],
            text: history['text'],
            ts: history['ts'],
            htmls: _htmls
        })
    }

    if (_historys.length === 0) {
        return {
            status: false,
            message: 'No URL'
        }
    }
    return {
        status: true,
        message: _historys
    }
}


/**
 * 指定秒間待機する
 */
export const sleep = (sec: number) => {
    return new Promise(resolve => setTimeout(resolve, sec * 1000))
}
