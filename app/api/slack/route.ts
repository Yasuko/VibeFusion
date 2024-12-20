import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import {
    get_history
} from "@/src/domain/Slack/server.action"

export async function GET(request: NextRequest): Promise<NextResponse> {

    const result = await get_history(request.url)

    if (result.status === false) {
        console.error(result.message)
        return returnResponce({ message: "Oh" }, 401)
    }

    return returnResponce(
        { message   : result.message},
        200,
    )
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
    return returnResponce({ message: "Hello" })
}

const returnResponce = (
    message: {[key: string]: string | number},
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

