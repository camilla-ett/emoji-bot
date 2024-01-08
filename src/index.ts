import { EmojiBot } from './bot'

// 絵文字BOTくんのインスタンスを初期化して実行するだけの簡単なお仕事
const emojiBot = new EmojiBot()
emojiBot.run()


// TODO: ココから下は全部壊れているので後で治す
/*
const tmp_directory = "tmp"
async function createDriveFile(name: string,buffer: Buffer): Promise<string>{
    const file = new Blob([buffer.buffer], { type: "image/webp" });

    const formData = new FormData();
    formData.append('i', emojiBot.options.token!);
    formData.append('force', 'true');
    formData.append('file', file);
    formData.append('name', name);
    return api.post('/drive/files/create', formData).then (response => {
        if(response.status == 200) {
            Logger.success(response.data.id + ": " + name)
            return response.data.id
        }
    }).catch( error => {
        console.log(error)
    })
    return Promise.resolve("")
}


// カスタム絵文字をローカルにダウンロードしてきて
// (webpじゃなければwebpに変換して)
// 再度カスタム絵文字を更新する処理
async function resendToAssets(emoji: CustomEmoji){

    // ドライブにアップロードして絵文字を更新
    if(emojiBot.options.isDryRun) {
        Logger.info("isDryRun=true のためドライブにアップしません")
        Logger.info(emoji.name)
    } else if(emojiBot.options.isReUpload) {

        // webp に変換済みのデータ
        const buffer = await convert(emoji.publicUrl)
        const filename = `${emoji.name}.webp`

        const id = await createDriveFile(filename, buffer)
        await sleep(5000);
        await updateEmoji.execute(emoji, id)
    }
}

const convert = async (url: string): Promise<Buffer> => {
    const res = await axios.get(url, {responseType: 'arraybuffer'})
    const buf = Buffer.from(res.data)

    return sharp(buf).resize({height:128}).webp().toBuffer()
}

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
*/