import BaseCommand from '../../libs/BaseCommand.js'
import { getRank } from '../../libs/Ranks.js'

export default class Command extends BaseCommand {
    constructor(client, handler) {
        super(client, handler, {
            command: 'profile',
            aliases: ['p'],
            category: 'core',
            description: {
                content: 'View your profile.'
            },
            exp: 7
        })
    }

    exec = async (M) => {
        let bio = ''
        try {
            bio = (await this.client.fetchStatus(M.sender.jid))?.status || ''
        } catch (error) {
            bio = ''
        }
        const { exp, status } = await this.client.DB.getUserInfo(M.sender.jid)
        const { name, data } = getRank(exp)
        const url =
            (await this.client.profilePictureUrl(M.sender.jid, 'image').catch(() => null)) ??
            'https://telegra.ph/file/6377addc7e12eab81c301.jpg'
        return void (await M.replyRaw({
            caption: `
🍥 *Username: $hikari*

📑 *Bio: $anything goes*

🌟 *Experience: $4000*

🏅 *Rank: $ace ${data.emoji}*

👑 *Admin: _${M.group?.admins.includes(M.sender.jid) ? 'Yes' : 'Not'}_ of ${M.group?.title}*

🟥 *Ban: ${status.isBan}*
    `,
            image: await this.client.util.fetchBuffer(url)
        }))
    }
}
