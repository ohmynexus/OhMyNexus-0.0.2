// Set Cover
neoxr.create(async (m, {
   client,
   Func,
   Scraper
}) => {
   try {
      let setting = global.db.setting
      let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (!/image/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Image not found.`), m)
      client.sendReact(m.chat, '🕒', m.key)
      let img = await q.download()
      if (!img) return client.reply(m.chat, global.status.wrong, m)
      let json = await Scraper.uploadImage(img)
      if (!json.status) return m.reply(Func.jsonFormat(json))
      setting.cover = json.data.url
      client.reply(m.chat, Func.texted('bold', `🚩 Cover successfully set.`), m)
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setcover'],
   hidden: ['cover'],
   use: 'reply foto',
   category: 'owner',
   owner: true
}, __filename)

// Set Watermark (Sticker)
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      let setting = global.db.setting
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'Sticker by | @neoxrs'), m)
      let [packname, ...author] = text.split`|`
      author = (author || []).join`|`
      setting.sk_pack = packname || ''
      setting.sk_author = author || ''
      client.reply(m.chat, Func.texted('bold', `🚩 Sticker Watermark successfully set.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setwm'],
   use: 'packname | author',
   category: 'owner',
   owner: true
}, __filename)

// Set Menu
neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   setting,
   Func
}) => {
   try {
      if (!args || !args[0]) return m.reply(Func.example(prefix, command, '2'))
      if (!['1', '2', '3', '4'].includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 Style not available.`), m)
      client.reply(m.chat, `🚩 Bot menu successfully set using style *${args[0]}*.`, m).then(() => setting.menuStyle = parseInt(args[0]))
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, global.status.error, m)
   }
}, {
   usage: ['setmenu'],
   use: '(option)',
   category: 'owner',
   owner: true
}, __filename)

// Set Link
neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      let setting = global.db.setting
      if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, setting.link), m)
      setting.link = args[0]
      client.reply(m.chat, Func.texted('bold', `🚩 Link successfully set.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setlink'],
   use: 'link',
   category: 'owner',
   owner: true
}, __filename)


// Set Header Message
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      let setting = global.db.setting
      if (!text) return client.reply(m.chat, explain(prefix, command), m)
      setting.msg = text
      client.reply(m.chat, Func.texted('bold', `🚩 Menu Message successfully set.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setmsg'],
   use: 'text',
   category: 'owner',
   owner: true
}, __filename)

const explain = (prefix, command) => {
   return `Sorry, can't return without text, and this explanation and how to use :

*1.* +tag : for mention sender.
*2.* +name : to getting sender name.
*3.* +greeting : to display greetings by time.
*4.* +db : to display the database in use.
*5.* +version : to get baileys version in use.

• *Example* : ${prefix + command} Hi +tag +greeting, i'm an automation system`
}

// Set PP
neoxr.create(async (m, {
   client,
   Func,
   Scraper
}) => {
   try {
      let q = m.quoted ? m.quoted : m
      let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
      if (/image\/(jpe?g|png)/.test(mime)) {
         client.sendReact(m.chat, '🕒', m.key)
         const buffer = await q.download()
         const json = await Scraper.uploadImage(buffer)
         if (!json.status) return m.reply(Func.jsonFormat(json))
         await client.updateProfilePicture(client.user.id, {
            url: json.data.url
         })
         await Func.delay(3000).then(() => client.reply(m.chat, Func.texted('bold', `🚩 Profile photo has been successfully changed.`), m))
      } else return client.reply(m.chat, Func.texted('bold', `🚩 Reply to the photo that will be made into the bot's profile photo.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setpp'],
   hidden: ['pp'],
   use: 'reply foto',
   category: 'owner',
   owner: true
}, __filename)