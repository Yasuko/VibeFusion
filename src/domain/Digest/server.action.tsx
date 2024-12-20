import { ReturnSuccess, ReturnError } from '@/src/definisions'

// import model
import {
    digestPrompt, termPrompt
} from '@/src/domain/Digest/reducers/ServerStore'

// import helper
import {
    generateScreenShot
} from '@/src/domain/Digest/helper/pupetter.helper'
import {
    callGPTAPI, parseGPTJson,
    sleep
} from '@/src/domain/Digest/helper/gpt.helper'


type DigestAPIType = {
    digests: {
        talker: string
        message: string[]
    }[]
    summary: string
}

type DigestTermType = {
    terms: {
        accent_type: string,
        pronunciation: string,
        surface: string
    }[]
}

type DigestType = DigestAPIType & DigestTermType & {
    screenshot: string
}

/**
 * 要約を作成し、台本を生成する
 * @param message string
 * @returns Promise<ReturnSuccess<string> | ReturnError>
 */
export const generateScreenplay = async (
    message: string
): Promise<ReturnSuccess<string> | ReturnError> => {
    // Digestを生成

    const digest = await generateDigest(message)

    if (!digest.status) return {
            status: false,
            message: 'error'
        }
    
    const term = await generateTerm(digest.message.summary)

    if (!term.status) return {
            status: false,
            message: 'error'
        }


    return {
        status: true,
        message: JSON.stringify({
            digests: digest.message.digests,
            terms: term.message,
            summary: digest.message.summary
        })
    }
}

/**
 * 要約を生成する
 * 対話形式で要約を生成
 * ずんだもんとふなっしーのキャラクターを考慮した要約を生成
 * @param message string
 * @returns Promise<ReturnSuccess<{
 *    digests: {
 *       talker: string
 *       message: string[]
 *    }[]
 *    summary: string
 * } | ReturnError>
 */
export const generateDigest = async (
    message: string
): Promise<
    ReturnSuccess<DigestAPIType>
    | ReturnError
> => {
    let loop = true
    let loopCount = 0
    const loopLimit = 5

    while (loop) {
        // ChatAPIをコール
        const r = await callGPTAPI(digestPrompt(message))

        if (!r.status) {
            if (loopCount >= loopLimit) {
                loop = false
                loopCount = 0
                return {
                    status: false,
                    message: 'error'
                }
            }
            loopCount++
            sleep(5)
            continue
        }
    
        // ChatAPIの戻り値のJSONをパース
        const _r: DigestAPIType = parseGPTJson<DigestAPIType>(r.message)
    
        loop = false
        loopCount = 0
        return {
            status: true,
            message: {
                digests: _r['digests'],
                summary: _r['summary']
            }
        }
    }

    return {
        status: false,
        message: 'error'
    }
}

/**
 * 専門用語とよみがなを生成する
 * 対応表をJSON形式で返却
 */
export const generateTerm = async (
    message: string
): Promise<ReturnSuccess<DigestTermType> | ReturnError> => {
    let loop = true
    let loopCount = 0
    const loopLimit = 5

    while (loop) {
    
        // 台本を生成
        const r = await callGPTAPI(termPrompt(message))
        if (!r.status) {
            if (loopCount >= loopLimit) {
                loop = false
                loopCount = 0
                return {
                    status: false,
                    message: 'error'
                }
            }
            loopCount++
            sleep(5)
            continue
        }

        loop = false
        loopCount = 0

        const _r = parseGPTJson<DigestTermType>(r.message)

        return {
            status: true,
            message: _r
        }
    }
    return {
        status: false,
        message: 'error'
    }
}

/**
 * Webページのスクリーンショットを生成する
 * @param url string
 * @returns 
 */
export const generateScreenshot = async (
    url: string
): Promise<ReturnSuccess<string> | ReturnError> => {
    let loop = true
    let loopCount = 0
    const loopLimit = 5

    while (loop) {
        try {
            const r = await generateScreenShot(url)

            loop = false
            loopCount = 0

            return {
                status: true,
                message: r
            }
        } catch (error) {
            console.log('GenerateScreenShot Error :: ', error)

            if (loopCount >= loopLimit) {
                loop = false
                loopCount = 0
                return {
                    status: false,
                    message: 'error'
                }
            }
            loopCount++
            sleep(5)
            continue
        }
    }
    return {
        status: false,
        message: 'error'
    }
}

