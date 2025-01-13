import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"

import {
    uploadMoveFile, uploadTest
} from "@/src/domain/Youtube/server.action"


export async function GET(request: NextRequest): Promise<NextResponse> {
    await uploadTest()
    return returnResponce({ message: "Hello" })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const m: any = await request.json()

    return returnResponce({
        message: {}
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

