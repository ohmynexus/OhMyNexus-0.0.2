const { readFileSync: read, unlinkSync: remove } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')
neoxr.create(async (m, {
   client,
   command,
   Func,
   Scraper
}) => {
   try {
      if (command == 'toimg') {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`), m)
         if (m.quoted.mimetype != 'image/webp') return client.reply(m.chat, Func.texted('bold', `🚩 Reply to sticker you want to convert to an image/photo (not supported for sticker animation).`), m)
         let media = await client.saveMediaMessage(m.quoted)
         let file = Func.filename('png')
         let isFile = path.join(tmpdir(), file)
         exec(`ffmpeg -i ${media} ${isFile}`, (err, stderr, stdout) => {
            remove(media)
            if (err) return client.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
            let buffer = read(isFile)
            client.sendFile(m.chat, buffer, '', '', m)
            remove(isFile)
         })
      } else if (['flip', 'flop'].includes(command)) {
         let exif = global.db.setting
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `🚩 Reply sticker you want to rotate.`), m)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Reply sticker you want to rotate.`), m)
         let file = await q.download()
         if (!file) return client.reply(m.chat, Func.texted('bold', `🚩 Sticker not found.`), m)
         client.sendReact(m.chat, '🕒', m.key)
         let json = await Scraper.uploadImageV2(file)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let result = await Scraper.rotate(json.data.url, command == 'flip' ? 'flop' : 'flip')
         if (!result.status) return client.reply(m.chat, Func.texted('bold', `🚩 Failed to rotate.`), m)
         client.sendSticker(m.chat, result.data.url, m, {
            packname: exif.sk_pack,
            author: exif.sk_author
         })
      } else if (['tovideo', 'tovid'].includes(command)) {
         if (!m.quoted) return client.reply(m.chat, Func.texted('bold', `🚩 Reply sticker animation you want to convert.`), m)
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!/webp/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Reply sticker animation you want to convert.`), m)
         let file = await q.download()
         if (!file) return client.reply(m.chat, Func.texted('bold', `🚩 Sticker not found.`), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         let json = await Scraper.toVideo(file)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         client.sendFile(m.chat, json.data.url, 'video.mp4', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['toimg', 'flip', 'flop', 'tovideo'],
   hidden: ['tovid'],
   use: 'reply sticker',
   category: 'features',
   limit: true
}, __filename)