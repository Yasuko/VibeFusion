import { TextToSpeechService } from '../../_lib/gpt/text_to_speech.service'

export class SpeechModel {
    private static instance: SpeechModel

    private Speech: TextToSpeechService | undefined = undefined

    public static call(key: string): SpeechModel
    {
        if (!SpeechModel.instance) {
            SpeechModel.instance = new SpeechModel(key)
        }
        return SpeechModel.instance
    }

    public constructor(key: string)
    {
        this.Speech = TextToSpeechService.call().setAPIKey(key)
    }

    public async callSpeech(
        text: string,
        options: any,
    ): Promise<ArrayBuffer | false> {
        console.log(options)

        if (!this.Speech) {
            return false
        }
        this.Speech
                .setOptions(
                    options.voice,
                    options.response_format,
                    options.speed
                )
                .setText(text)
        await this.Speech.do()
        return this.Speech.getResult()
    }
}