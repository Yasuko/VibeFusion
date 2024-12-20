import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import {
    generateScreenplay,
    generateDigest,
    generateTerm,
    generateScreenshot
} from "@/src/domain/Digest/server.action"


export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url)
    const m: any = Object.fromEntries(searchParams.entries())
    if (m['test'] == 'digests') {
        const result = await generateDigest(m['message'])
        return returnResponce({
            message: result
        })
    }

    if (m['test'] == 'term') {
        const result = await generateTerm(m['message'])
        return returnResponce({
            message: result
        })
    }

    if (m['test'] == 'screenshot') {
        const ss = await generateScreenshot(m['url'])
        return returnResponce({
            message: ss.message
        })
    }

    return returnResponce({ message: "Hello" })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const m: any = await request.json()

    const result = await generateScreenplay(m['message'])
    const ss = await generateScreenshot(m['url'])
    console.log('GPT DIGEST RETURN ',result)
    return returnResponce({
        message: {
            digests: result.message,
            screenshot: ss.message
            //screenshot: "none"
        }
    }, 200)
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
    return returnResponce({ message: "Hello" })
}

const returnResponce = (
    message: {[key: string]: any},
    status: number = 200,
): NextResponse => {
    
    return NextResponse.json({ ...message }, {
        status,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, UZA-TOKEN",
            "Access-Control-Expose-Headers": "UZA-TOKEN",
        }
    })
}

