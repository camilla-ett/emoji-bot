import { User } from "./User"

export type ModerationLog = {
    id: string,
    createdAt: string, // Dateでいけたっけ
    type: string,
    info: any,
    userId: string, // なんでuserとuseridがあるんですかねぇ
    user: User
}
