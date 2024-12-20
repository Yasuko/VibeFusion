import { LocalStrageService } from '../../_lib/strage/localstrage.service'

export class StrageModel {
    private static instance: StrageModel

    private Strage: LocalStrageService | undefined = undefined

    public static call(): StrageModel
    {
        if (!StrageModel.instance) {
            StrageModel.instance = new StrageModel();
        }
        return StrageModel.instance;
    }

    public constructor()
    {
        this.Strage = LocalStrageService.call()
    }

    public setAPI(value: string): StrageModel
    {
        this.Strage?.save('OEPNAI_API_KEY', value)
        return this
    }

    public async getAPI(): Promise<string | boolean>
    {
        if (!this.Strage) {
            return false
        }
        return await this.Strage.searchKey('OEPNAI_API_KEY')
    }

    public removeAPI(): StrageModel
    {
        this.Strage?.delete('OEPNAI_API_KEY')
        return this
    }
}
