require('events').EventEmitter.defaultMaxListeners = 100
const { Baileys, MongoDB, PostgreSQL, Scandir, Function: Func } = new(require('@neoxr/wb'))
const spinnies = new(require('spinnies'))(),
   fs = require('fs'),
   colors = require('@colors/colors'),
   stable = require('json-stable-stringify'),
   env = require('./config.json')
const cache = new(require('node-cache'))({
   stdTTL: env.cooldown
})
if (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) MongoDB.db = env.database
const machine = (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) ? MongoDB : (process.env.DATABASE_URL && /postgres/.test(process.env.DATABASE_URL)) ? PostgreSQL : new(require('./lib/system/localdb'))(env.database)
const client = new Baileys({
   type: '--neoxr-v2',
   plugsdir: 'plugins',
   sf: 'session',
   online: true,
   version: [2, 2318, 11]
})

/* starting to connect */
client.on('connect', async conn => {
   delete btoa
   delete atob
   delete fetch
   delete performance
     
   /* load database */
   global.db = {users:[], chats:[], groups:[], bots:[], files:[], statistic:{}, sticker:{}, menfess:{}, captcha:{}, setting:{}, ...(await machine.fetch() ||{})}
 
   /* disconnect all bot (additional feature) */
   if (global.db.bots.length > 0) global.db.bots.map(v => v.is_connected = false)
 
   /* save database */
   await machine.save(global.db)

   /* connection logs */
   if (conn && typeof conn === 'object' && conn.message) Func.logFile(conn.message)
})

/* print error */
client.on('error', async error => {
   console.log(colors.red(error.message))
   if (error && typeof error === 'object' && error.message) Func.logFile(error.message)
})

/* bot is connected */
client.on('ready', async () => {
   /* auto restart if ram usage is over */
   const ramCheck = setInterval(() => {
      var ramUsage = process.memoryUsage().rss
      if (ramUsage >= require('bytes')(env.ram_limit)) {
         clearInterval(ramCheck)
         process.send('reset')
      }
   }, 60 * 1000)
   
   /* create temp directory if doesn't exists */
   if (!fs.existsSync('./temp')) fs.mkdirSync('./temp')
   
   /* require all additional functions */
   require('./lib/system/config'), require('./lib/system/baileys')(client.sock), require('./lib/system/functions'), require('./lib/system/scraper')

   /* clear temp folder every 3 minutes */
   setInterval(() => {
      const tmpFiles = fs.readdirSync('./temp')
      if (tmpFiles.length > 0) {
         tmpFiles.filter(v => !v.endsWith('.file')).map(v => fs.unlinkSync('./temp/' + v))
      }
   }, 60 * 1000 * 3)
   
   /* clear session cache every 3 minutes */
   setInterval(() => {
      if (!fs.existsSync('./session')) return
      const sessFiles = fs.readdirSync('./session')
      if (sessFiles.length > 0) {
         sessFiles.filter(v => v != 'creds.json').map(v => fs.unlinkSync('./session/' + v))
      }
   }, 60 * 1000 * 3)

   /* save database every 30 seconds */
   setInterval(async () => {
      if (global.db) await machine.save(global.db)
   }, 30_000)
})

/* print all message object */
client.on('message', ctx => require('./handler')(client.sock, ctx))

/* print deleted message object */
client.on('message.delete', ctx => {
   const sock = client.sock  
   if (!ctx || ctx.origin.fromMe || ctx.origin.isBot || !ctx.origin.sender) return
   if (cache.has(ctx.origin.sender) && cache.get(ctx.origin.sender) === 1) return
   cache.set(ctx.origin.sender, 1)
   if (ctx.origin.isGroup && global.db.groups.some(v => v.jid == ctx.chat) && global.db.groups.find(v => v.jid == ctx.origin.chat).antidelete) return sock.copyNForward(ctx.origin.chat, ctx.delete)
})

/* AFK detector */
client.on('presence.update', update => {
   if (!update) return
   const sock = client.sock
   const { id, presences } = update
   if (id.endsWith('g.us')) {
      for (let jid in presences) {
         if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
         if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db.users.find(v => v.jid == jid) && global.db.users.find(v => v.jid == jid).afk > -1) {
            sock.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - global.db.users.find(v => v.jid == jid).afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${global.db.users.find(v => v.jid == jid).afkReason ? global.db.users.find(v => v.jid == jid).afkReason : '-'}`, global.db.users.find(v => v.jid == jid).afkObj)
            global.db.users.find(v => v.jid == jid).afk = -1
            global.db.users.find(v => v.jid == jid).afkReason = ''
            global.db.users.find(v => v.jid == jid).afkObj = {}
         }
      }
   } else {}
})

client.on('group.add', async ctx => {
   const sock = client.sock
   const text = `Thanks +tag for joining into +grup group.`
   const groupSet = global.db.groups.find(v => v.jid == ctx.jid)
   var pic
   try {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'))
   } catch {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'))
   }

   /* localonly to remove new member when the number not from indonesia */
   if (groupSet && groupSet.localonly) {
      if (global.db.users.some(v => v.jid == ctx.member) && !global.db.users.find(v => v.jid == ctx.member).whitelist && !ctx.member.startsWith('62') || !ctx.member.startsWith('62')) {
         sock.reply(ctx.jid, Func.texted('bold', `Sorry @${ctx.member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`))
         sock.updateBlockStatus(member, 'block')
         return await Func.delay(2000).then(() => sock.groupParticipantsUpdate(ctx.jid, [ctx.member], 'remove'))
      }
   }

   /* captcha verification */
   if (groupSet && groupSet.captcha) {
      const captcha = require('@neoxr/captcha')
      let newCaptcha = captcha()
      let image = Buffer.from(newCaptcha.image.split(',')[1], 'base64')
      let caption = `Hai @${ctx.member.split('@')[0]} 👋🏻\n`
      caption += `Selamat datang di grup *${ctx.subject}* sebelum melakukan aktifitas didalam grup lakukan *VERIFIKASI* dengan mengirimkan *KODE CAPTCHA* pada gambar diatas.\n\n`
      caption += `*Timeout* : [ 1 menit ]`
      global.db.captcha = global.db.captcha ? global.db.captcha : {}
      global.db.captcha[ctx.member] = {
         chat: await client.sendMessageModify(ctx.jid, caption, null, {
            largeThumb: true,
            thumbnail: image,
            url: global.db.setting.link
         }),
         to: ctx.member,
         groupId: ctx.jid,
         code: newCaptcha.value,
         wrong: 0,
         timeout: setTimeout(() => {
            if (global.db.captcha[ctx.member]) return client.reply(ctx.jid, Func.texted('bold', `🚩 Member : [ @${ctx.member.split`@`[0]} ] did not verify.`)).then(async () => {
               client.groupParticipantsUpdate(ctx.jid, [ctx.member], 'remove')
               delete global.db.captcha[ctx.member]
            })
         }, 60_000)
      }
   }

   const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
   if (groupSet && groupSet.welcome) sock.sendMessageModify(ctx.jid, txt, null, {
      largeThumb: true,
      thumbnail: pic,
      url: global.db.setting.link
   })
})

client.on('group.remove', async ctx => {
   const sock = client.sock
   const text = `Good bye +tag :)`
   const groupSet = global.db.groups.find(v => v.jid == ctx.jid)
   var pic
   try {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.member, 'image'))
   } catch {
      var pic = await Func.fetchBuffer(await sock.profilePictureUrl(ctx.jid, 'image'))
   }
   const txt = (groupSet && groupSet.text_left ? groupSet.text_left : text).replace('+tag', `@${ctx.member.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
   if (groupSet && groupSet.left) sock.sendMessageModify(ctx.jid, txt, null, {
      largeThumb: true,
      thumbnail: pic,
      url: global.db.setting.link
   })
})

// client.on('group.promote', ctx => console.log(ctx))
// client.on('group.demote', ctx => console.log(ctx))
// client.on('caller', ctx => console.log(ctx))