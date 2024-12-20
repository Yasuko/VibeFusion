import {
    LocalStrageService
} from '@/src/_lib/strage/localstrage.service'


export const saveTestData = async (data: any) => {
    await LocalStrageService.call().saveToJson('testData', data)
    return
}

export const getTestData = async () => {
    return await LocalStrageService.call().loadToJson('testData')
}