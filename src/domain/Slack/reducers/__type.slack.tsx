

export type SlackHistoryType = {
    suggest: string
    url: string
    title: string
    text: string
}


export type SlackFormType = {
    text: string
    historys: SlackHistoryType[]
}

export const initialSlackForm: SlackFormType = {
    text: '',
    historys: []
}


