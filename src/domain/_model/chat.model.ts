import {
    ChatContentType,
    ChatReturnType
} from '../../_lib/gpt/_helper/chat.helper'
import { ChatService } from '../../_lib/gpt/chat.service'

export class ChatModel {
    private static instance: ChatModel

    private BuildedContent: ChatContentType[] = []

    public static call(key: string): ChatModel {
        if (!ChatModel.instance) {
            ChatModel.instance = new ChatModel(key)
        }
        return ChatModel.instance
    }

    public constructor(key: string) {
        ChatService.call().setAPIKey(key)
    }

    public buildSendContents(
        message: string,
        images: string[]
    ): ChatModel {
        this.BuildedContent = [
            ChatService.call().convertContent(message),
            ...images.map((image: string) => {
                return ChatService.call().convertContent(image)
            })
        ]
        return this
    }

    public async callDocumentSummary(
        options: any
    ): Promise<ChatReturnType> {
        ChatService.call()
            .setOptions(options)
            .setMessage(this.BuildedContent)
        await ChatService.call().do()
        return ChatService.call().getResult()
    }

    public getBuildedContent(): ChatContentType[] {
        return this.BuildedContent
    }
}