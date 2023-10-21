const { Function: Func, Logs, Scraper } = new(require('@neoxr/wb'))
const env = require('./config.json')
const cron = require('node-cron')
const cache = new(require('node-cache'))({
   stdTTL: env.cooldown
})
module.exports = async (client, ctx) => {
   const { store, m, body, prefix, plugins, commands, args, command, text, prefixes } = ctx
   try {
      require('./lib/system/schema')(m, env) /* input database */
      const isOwner = [client.decodeJid(client.user.id).split`@`[0], env.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (global.db.users.some(v => v.jid == m.sender) && global.db.users.find(v => v.jid == m.sender).premium)
      const isAuth = (global.db.users.some(v => v.jid == m.sender) && global.db.users.find(v => v.jid == m.sender).authentication) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups.find(v => v.jid == m.chat),
         chats = global.db.chats.find(v => v.jid == m.chat),
         users = global.db.users.find(v => v.jid == m.sender),
         setting = global.db.setting
      if (!users) global.db.users.push({
         jid: m.sender,
         banned: false,
         limit: env.limit,
         hit: 0,
         spam: 0
      })
      Logs(client, m, false)
      if (!setting.online) client.sendPresenceUpdate('unavailable', m.chat)
      if (setting.online) {
         client.sendPresenceUpdate('available', m.chat)
         client.readMessages([m.key])
      }
      if (setting.debug && !m.fromMe && isOwner) client.reply(m.chat, Func.jsonFormat(m), m)
      if (m.isGroup && !isBotAdmin) {
         groupSet.localonly = false
         groupSet.captcha = false
      }
      if (m.isGroup) groupSet.activity = new Date() * 1
      if (users) users.lastseen = new Date() * 1
      if (chats) {
         chats.chat += 1
         chats.lastseen = new Date * 1
      }
      if (m.isGroup && !m.isBot && users && users.afk > -1) {
         client.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n• ${Func.texted('bold', 'Reason')}: ${users.afkReason ? users.afkReason : '-'}`, m)
         users.afk = -1
         users.afkReason = ''
         users.afkObj = {}
      }
      cron.schedule('00 00 * * *', () => {
         setting.lastReset = new Date * 1
         global.db.users.filter(v => v.limit < env.limit && !v.premium).map(v => v.limit = env.limit)
         global.db.users.filter(v => v.limitGame < env.limit_game && !v.premium).map(v => v.limitGame = env.limit_game)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }, {
         scheduled: true,
         timezone: process.env.TZ
      })
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0,
               chat: 0
            }
         } else {
            groupSet.member[m.sender].lastseen = now
            groupSet.member[m.sender].chat += 1
         }
      }
      if (m.isGroup && !groupSet.stay && (new Date * 1) >= groupSet.expired && groupSet.expired != 0) {
         return client.reply(m.chat, Func.texted('italic', '🚩 Bot time has expired and will leave from this group, thank you.', null, {
            mentions: participants.map(v => v.id)
         })).then(async () => {
            groupSet.expired = 0
            await Func.delay(2000).then(() => client.groupLeave(m.chat))
         })
      }
      if (users && (new Date * 1) >= users.expired && users.expired != 0) {
         return client.reply(users.jid, Func.texted('italic', '🚩 Your premium package has expired, thank you for buying and using our service.')).then(async () => {
            users.premium = false
            users.expired = 0
            users.limit = env.limit
            users.limitGame = env.limit_game
         })
      }
      if (!m.fromMe && m.isGroup && groupSet.antibot && m.isBot && isBotAdmin && !isOwner) return m.reply(Func.texted('bold', `🚩 No other bots are allowed here.`)).then(async () => await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      if (m.isBot || m.chat.endsWith('broadcast') || /edit/.test(m.mtype)) return
      const matcher = Func.matcher(command, commands).filter(v => v.accuracy >= 60)
      if (prefix && !commands.includes(command) && matcher.length > 0 && !setting.self) {
         if (!m.isGroup || (m.isGroup && !groupSet.mute)) return client.reply(m.chat, `🚩 Command you are using is wrong, try the following recommendations :\n\n${matcher.map(v => '➠ *' + (prefix ? prefix : '') + v.string + '* (' + v.accuracy + '%)').join('\n')}`, m)
      }
      if (body && prefix && commands.includes(command) || body && !prefix && commands.includes(command) && setting.noprefix || body && !prefix && commands.includes(command) && env.evaluate_chars.includes(command)) {
     	if (setting.error.includes(command)) return client.reply(m.chat, Func.texted('bold', `🚩 Command _${(prefix ? prefix : '') + command}_ disabled.`), m)
         if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
         if (cache.has(m.sender) && cache.get(m.sender) === 1 && !isOwner) return
         cache.set(m.sender, 1)
         if (commands.includes(command)) {
            users.hit += 1
            users.usebot = new Date() * 1
            Func.hitstat(command, m.sender)
         }
         for (let cmd of plugins.filter(v => v.usage || v.hidden)) {
            const turn = cmd.usage instanceof Array ? cmd.usage.includes(command) : cmd.usage instanceof String ? cmd.usage == command : false
            const turn_hidden = cmd.hidden instanceof Array ? cmd.hidden.includes(command) : cmd.hidden instanceof String ? cmd.hidden == command : false
            const name = cmd.pluginName
            if (!turn && !turn_hidden) continue
            if (setting.self && !isOwner && !m.fromMe) continue
            if (m.isGroup && !['activation', 'groupinfo'].includes(name) && groupSet.mute) continue
            if (!m.isGroup && !['owner'].includes(name) && chats && !isPrem && !users.banned && new Date() * 1 - chats.lastchat < env.timer) continue
            if (!m.isGroup && !['owner', 'menfess', 'scan', 'verify', 'payment', 'sewa', 'buyprem', 'premium'].includes(name) && chats && !isPrem && !users.banned && setting.groupmode) {
               client.sendMessageModify(m.chat, `⚠️ Using bot in private chat only for premium user, want to upgrade to premium plan ? send *${prefixes[0]}premium* to see benefit and prices.`, m, {
                  largeThumb: true,
                  thumbnail: 'https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg',
                  url: setting.link
               }).then(() => chats.lastchat = new Date() * 1)
               continue
            }
            if (!['verify', 'exec', 'payment', 'me', 'profile'].includes(name) && m.isGroup && users && !users.banned && !users.verified && setting.verify) {
               client.reply(m.chat, `⚠️ Nomor kamu belum terverifikasi, untuk melakukan verifikasi gunakan perintah *${prefixes[0]}reg email*\n\n*Contoh* : ${prefixes[0]}reg neoxrbot@gmail.com`, m)
               continue
            }
            if (!['verify', 'exec', 'payment', 'me'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) users.attempt += 1
            let teks = `⚠️ *[ ${users.attempt} / 5 ]* Verifikasi nomor dengan menggunakan email, 1 email untuk memverifikasi 1 nomor WhatsApp. Silahkan ikuti step by step berikut :\n\n– *STEP 1*\nGunakan perintah *${prefix ? prefix : ''}reg <email>* untuk mendapatkan kode verifikasi melalui email.\nContoh : *${prefix ? prefix : ''}reg neoxrbot@gmail.com*\n\n– *STEP 2*\nBuka email dan cek pesan masuk atau di folder spam, setelah kamu mendapat kode verifikasi silahkan kirim kode tersebut kepada bot.\n\n*Note* :\nMengabaikan pesan ini sebanyak *5x* kamu akan di banned dan di blokir, untuk membuka banned dan blokir dikenai biaya sebesar Rp. 10,000`
            if (users && !users.banned && !users.verified && users.attempt >= 5 && setting.verify) {
               client.reply(m.isGroup ? m.sender : m.chat, Func.texted('bold', `🚩 [ ${users.attempt} / 5 ] : Kamu mengabaikan pesan verifikasi tapi tenang masih ada bot lain kok, banned thanks. (^_^)`), m).then(() => {
                  users.banned = true
                  users.attempt = 0
                  users.code = ''
                  users.codeExpire = 0
                  users.email = ''
                  client.updateBlockStatus(m.sender, 'block')
               })
               continue
            }
            if (!['verify', 'exec', 'payment'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) {
               client.sendMessageModify(m.isGroup ? m.sender : m.chat, teks, m, {
                  largeThumb: true,
                  thumbnail: await Func.fetchBuffer('https://telegra.ph/file/31601aee3fdf941bebbc4.jpg')
               })
               continue
            }
            if (cmd.owner && !isOwner) {
               client.reply(m.chat, global.status.owner, m)
               continue
            }
            if (cmd.restrict && !isPrem && !isOwner && text && new RegExp('\\b' + setting.toxic.join('\\b|\\b') + '\\b').test(text.toLowerCase())) {
               client.reply(m.chat, `⚠️ You violated the *Terms & Conditions* of using bots by using blacklisted keywords, as a penalty for your violation being blocked and banned.`, m).then(() => {
                  users.banned = true
                  client.updateBlockStatus(m.sender, 'block')
               })
               continue
            }
            if (cmd.auth && !isAuth) {
               client.reply(m.chat, global.status.auth, m)
               continue
            }
            if (cmd.premium && !isPrem) {
               client.reply(m.chat, global.status.premium, m)
               continue
            }
            if (cmd.limit && !cmd.game && users.limit < 1) {
               client.reply(m.chat, `⚠️ You reached the limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plan.`, m).then(() => users.premium = false)
               continue
            }
            if (cmd.limit && !cmd.game && users.limit > 0) {
               const limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else {
                  client.reply(m.chat, Func.texted('bold', `⚠️ Your limit is not enough to use this feature.`), m)
                  continue
               }
            }
            if (cmd.limit && cmd.game && users.limitGame < 1) {
               client.reply(m.chat, `⚠️ You reached the game limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plan.`, m).then(() => users.premium = false)
               continue
            }
            if (cmd.limit && cmd.game && users.limitGame > 0) {
               const limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limitGame >= limit) {
                  users.limitGame -= limit
               } else {
                  client.reply(m.chat, Func.texted('bold', `⚠️ Your game limit is not enough to use this feature.`), m)
                  continue
               }
            }
            if (cmd.group && !m.isGroup) {
               client.reply(m.chat, global.status.group, m)
               continue
            } else if (cmd.botAdmin && !isBotAdmin) {
               client.reply(m.chat, global.status.botAdmin, m)
               continue
            } else if (cmd.admin && !isAdmin) {
               client.reply(m.chat, global.status.admin, m)
               continue
            }
            if (cmd.private && m.isGroup) {
               client.reply(m.chat, global.status.private, m)
               continue
            }
            if (cmd.game && !setting.games) {
               client.reply(m.chat, global.status.gameSystem, m)
               continue
            }
            if (cmd.game && Func.level(users.point, global.multiplier)[0] >= 50) {
               client.reply(m.chat, global.status.gameLevel, m)
               continue
            }
            if (cmd.game && m.isGroup && !groupSet.game) {
               client.reply(m.chat, global.status.gameInGroup, m)
               continue
            }
            cmd.async(m, { client, args, text, prefix, prefixes, command, groupMetadata, participants, users, chats, groupSet, setting, isOwner, isAdmin, isBotAdmin, plugins, blockList, env, ctx, store, Func, Scraper })
            break
         }
      } else {
         for (let event of plugins.filter(v => !v.usage && !v.hidden)) {
            const name = event.eventName
            if (!m.isGroup && env.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
            if (!['system_ev', 'restrict'].includes(name) && users && (users.banned || new Date - users.banTemp < env.timer)) continue
            if (setting.self && !isOwner && !m.fromMe) continue
            if (!m.isGroup && !['system_ev', 'menfess_ev', 'chatbot', 'auto_download'].includes(name) && chats && !isPrem && !users.banned && new Date() * 1 - chats.lastchat < env.timer) continue
            if (!m.isGroup && ['chatbot'].includes(event.pluginName) && body && Func.socmed(body)) continue
            if (!m.isGroup && setting.groupmode && !['system_ev', 'menfess_ev', 'chatbot', 'auto_download'].includes(name) && !isPrem) return client.sendMessageModify(m.chat, `⚠️ Using bot in private chat only for premium user, want to upgrade to premium plan ? send *${prefixes[0]}premium* to see benefit and prices.`, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg'),
               url: setting.link
            }).then(() => chats.lastchat = new Date() * 1)
            if (event.cache && event.location) {
               let file = require.resolve(event.location)
               Func.reload(file)
            }
            if (event.error) continue
            if (event.owner && !isOwner) continue
            if (event.group && !m.isGroup) continue
            if (event.limit && !event.game && users.limit < 1 && body && Func.generateLink(body) && Func.generateLink(body).some(v => Func.socmed(v))) return client.reply(m.chat, `⚠️ You reached the limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plan.`, m).then(() => {
               users.premium = false
               users.expired = 0
            })
            if (event.download && users && !users.verified && body && Func.socmed(body) && setting.verify) return client.reply(m.chat, `⚠️ Nomor kamu belum terverifikasi, untuk melakukan verifikasi gunakan perintah *${prefixes[0]}reg email*\n\n*Contoh* : ${prefixes[0]}reg neoxrbot@gmail.com`, m)
            if (event.limit && event.game && users.limitGame < 1 && body) return client.reply(m.chat, `⚠️ You reached the game limit and will be reset at 00.00\n\nTo get more limits upgrade to premium plan or buy it with points use *${prefixes[0]}buygl* command.`, m)
            if (event.botAdmin && !isBotAdmin) continue
            if (event.admin && !isAdmin) continue
            if (event.private && m.isGroup) continue
            if (event.download && (!setting.autodownload || (body && env.evaluate_chars.some(v => body.startsWith(v))))) continue
            if (event.game && !setting.games) continue
            if (event.game && Func.level(users.point, global.multiplier)[0] >= 50) continue
            if (event.game && m.isGroup && !groupSet.game) continue
            event.async(m, { client, body, prefixes, groupMetadata, participants, users, chats, groupSet, setting, isOwner, isAdmin, isBotAdmin, plugins, blockList, env, ctx, store, Func, Scraper })
         }
      }
   } catch (e) {
      require('./lib/system/schema')(m, env)
      if (/(item|overlimit|timed|timeout|users)/ig.test(e.message)) return
      // console.log(e)
      // if (!m.fromMe) return m.reply(Func.jsonFormat(new Error('neoxr-bot encountered an error :' + e)))
   }
   Func.reload(require.resolve(__filename))
}