import { ReturnSuccess, ReturnError } from "@/src/definisions"
import {
    takeScreenShot
} from '@/src/_lib/pupetter/pupetter.service'

import {
    extensionToDataURIHeader
} from '@/src/_lib/_helper/convert.helper'


export const generateScreenShot = async (
    url: string
): Promise<string> => {
    console.log('URL : ', url)
    const ss = await takeScreenShot(url, 'output.png')
    // console.log('SS : ', ss)
    return (ss === false)
        ? ''
        : extensionToDataURIHeader('png') + ss
}