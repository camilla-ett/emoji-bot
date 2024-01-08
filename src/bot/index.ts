import * as fs from 'fs'
import api, { ApiInstance } from "../misskey/api/$api";
import { CreateNote } from "../service/CreateNote";
import { GetRecentModerationLogs } from "../service/GetRecentModerationLogs";
import { UpdateEmoji } from "../service/UpdateEmoji";
import { EmojiBotOptions, loadEmojiBotOptions } from "./options"
import aspida from "@aspida/axios";
import { ModerationLog } from '../misskey/model/ModerationLog';
import { Notification } from './Notification';

// TODO: 設定で変更できるようにする？
const dbfilename = "moderation.json"

export class EmojiBot {
    protected options: EmojiBotOptions
    protected apiClient: ApiInstance

    // TODO: この辺りは後でDIする
    protected getRecentModerationLogs
    protected updateEmoji
    protected createNote

    protected notification

    // 使う奴
    protected lastModified: Date

    constructor(options?: EmojiBotOptions) {
        // オプションの読み込み
        if(options) {
            this.options = options
        } else {
            this.options = loadEmojiBotOptions()
        }

        // APIクライアントへの接続 （asを付けなあかんのですか…？）
        this.apiClient = api(aspida(undefined, {baseURL: `https://${this.options.host}/api/`})) as ApiInstance

        // TODO: DIコンテナでやりましょうね～
        this.getRecentModerationLogs = new GetRecentModerationLogs(this.apiClient, this.options.token)
        this.updateEmoji = new UpdateEmoji(this.apiClient, this.options.token)
        this.createNote = new CreateNote(this.apiClient, this.options.token)

        // TODO: これもDIで
        this.notification = new Notification(this.createNote, this.options)

        // 起動時に最後のモデレーションログを読み込み。
        // 存在しなければ、現在時刻を返す
        this.lastModified = new Date()
        if (fs.existsSync(dbfilename)) {
            let lastModetationLog: ModerationLog
            lastModetationLog = JSON.parse(fs.readFileSync(dbfilename, 'utf8')) as ModerationLog
            this.lastModified= new Date(lastModetationLog.createdAt)
        }
    }

    run() {
        // TODO: Promise を使って、もっとちゃんと綺麗に実装して、どうぞ
        setInterval( this.pullModerationLogs,  this.options.intervals * 1000)
    }

    protected async pullModerationLogs() {
        // 最終更新日時より新しいモデレーションログを取得する
        const moderationLogs = await this.getRecentModerationLogs.execute(this.lastModified, this.options.limit)
    
        // モデレーションログを元に処理を割り振る
        moderationLogs.forEach( moderationLog => this.notification.notify(moderationLog))
    
        // 最終更新日を記録して、ローカルのjsonファイルに書き出し
        const latestModerationLog = moderationLogs.at(-1)
        if(latestModerationLog) {
            fs.writeFileSync(dbfilename, JSON.stringify(latestModerationLog))
            this.lastModified = new Date(latestModerationLog.createdAt)
        }
    }
}
