import { ApiInstance } from "../misskey/api/$api"
import { CustomEmoji } from "../misskey/model/CustomEmoji"
import { Logger } from "../utils/logger"

export class UpdateEmoji {
    api: ApiInstance
    token: string

    constructor(api: ApiInstance, token: string) {
        this.api = api
        this.token = token
    }

    async execute(emoji: CustomEmoji, fileId: string) {
        const params = {
            i: this.token,
            aliases: emoji.aliases,
            category: emoji.category,
            fileId: fileId,
            id: emoji.id,
            isSensitive: emoji.isSensitive,
            lisence: emoji.license,
            localOnly: emoji.localOnly,
            name: emoji.name,
            roleIdsThatCanBeUsedThisEmojiAsReaction: emoji.roleIdsThatCanBeUsedThisEmojiAsReaction
        }
        return this.api.admin.emoji.update.post({body: params}).then(response => {
            if(response.status == 204) {
                Logger.success(params.name)
            }
        }).catch( error => {
            console.log(error)
        })
    }
}