
/**********************************
 * Digest
 *********************************/
export type YoutubeFormType = {
    title: string
    description: string
    tags: string[]
    categoryId: string
    privacyStatus: string
    selfDeclaredMadeForKids: boolean
}

export const initialYoutubeForm: YoutubeFormType = {
    title: '',
    description: '',
    tags: [],
    categoryId: '',
    privacyStatus: '',
    selfDeclaredMadeForKids: false
}
