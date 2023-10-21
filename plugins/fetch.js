const fs = require('fs')
const axios = require('axios')
const decode = require('html-entities').decode
neoxr.create(async (m, {
   client,
   args,
   text,
   prefix,
   command,
   env,
   users,
   Func,
   Scraper
}) => {
   try {
      if (/get|fetch/i.test(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, global.db.setting.cover), m)
         client.sendReact(m.chat, '🕒', m.key)
         if (args[0].match('github.com')) {
            let username = args[0].split(`/`)[3]
            let repository = args[0].split(`/`)[4]
            let zipball = 'https://api.github.com/repos/${username.trim()}/${repository.trim()}/zipball'
            client.sendFile(m.chat, zipball, `${repository}.zip`, '', m)
         } else {
            const fetch = await axios.get(args[0], {
               headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Referer": "https://www.google.com/",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
               }
            })
            if (/json/i.test(fetch.headers['content-type'])) return m.reply(Func.jsonFormat(fetch.data))
            if (/text/i.test(fetch.headers['content-type'])) return m.reply(fetch.data)
            client.sendFile(m.chat, args[0], '', '', m)
         }
      } else if (/tt|tik(tok|wm|mp3)?/.test(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://vm.tiktok.com/ZSR7c5G6y/'), m)
         if (!args[0].match('tiktok.com')) return client.reply(m.chat, global.status.invalid, m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.neoxr('/tiktok', {
            url: Func.ttFixed(args[0])
         })
         if (!json.status || !json.data.video) return client.reply(m.chat, Func.texted('bold', `🚩 Error! private videos or videos not available.`), m)
         let caption = `乂  *T I K T O K*\n\n`
         caption += `	◦  *Author* : ${json.data.author.nickname} (@${json.data.author.username})\n`
         caption += `	◦  *Views* : ${Func.formatter(json.data.stats.play_count)}\n`
         caption += `	◦  *Likes* : ${Func.formatter(json.data.stats.digg_count)}\n`
         caption += `	◦  *Shares* : ${Func.formatter(json.data.stats.share_count)}\n`
         caption += `	◦  *Comments* : ${Func.formatter(json.data.stats.comment_count)}\n`
         caption += `	◦  *Duration* : ${Func.toTime(json.data.duration)}\n`
         caption += `	◦  *Sound* : ${json.data.music.title} - ${json.data.music.author}\n`
         caption += `	◦  *Caption* : ${json.data.caption || '-'}\n`
         caption += `	◦  *Fetching* : ${((new Date - old) * 1)} ms\n\n`
         caption += global.footer
         if (command == 'tiktok' || command == 'tt') {
            if (json.data.video) return client.sendFile(m.chat, json.data.video, 'video.mp4', caption, m)
            if (json.data.photo) {
               for (let p of json.data.photo) {
                  client.sendFile(m.chat, p, 'image.jpg', caption, m)
                  await Func.delay(1500)
               }
            }
         }
         if (command == 'tikwm') return client.sendFile(m.chat, json.data.videoWM, 'video.mp4', caption, m)
         if (command == 'tikmp3') return !json.data.audio ? client.reply(m.chat, global.status.fail, m) : client.sendFile(m.chat, json.data.audio, 'audio.mp3', '', m)
      } else if (command == 'ss') {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://api.neoxr.my.id'), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/ss', {
         	url: args[0]
         })
         client.sendFile(m.chat, json.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
      } else if (['fb', 'fbdl'].includes(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://www.facebook.com/reel/555862413147730?mibextid=sgpPy7WDqP7Hc8ec'), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/fb', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
         if (result) {
            client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : HD`, m)
         } else {
            let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
            if (!result) return client.reply(m.chat, global.status.fail, m)
            client.sendFile(m.chat, result.url, Func.filename('mp4'), `◦ *Quality* : SD`, m)
         }
      } else if (['ig', 'igh', 'igs'].includes(command)) {
         const example = (command == 'igh') ? 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3OTYwNTY1ODYzMjQ5NjQ3?story_media_id=2818869611937037999&igshid=NTc4MTIwNjQ2YQ==' : (command == 'igs') ? 'https://instagram.com/stories/lydiaaas__/3111950798109221827?utm_source=ig_story_item_share&igshid=NjZiM2M3MzIxNA==' : 'https://www.instagram.com/reel/CsvboFyorsS/?igshid=NTc4MTIwNjQ2YQ=='
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, example), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/ig-fetch', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         for (let v of json.data) {
            client.sendFile(m.chat, v.url, v.type == 'mp4' ? Func.filename('mp4') : Func.filename('jpg'), `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(1500)
         }
      } else if (['twitter', 'tw'].includes(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://twitter.com/SitiosVirales/status/1661597541379522560?t=TKetrsOXtIsROyqQWLmiSQ&s=19'), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/twitter', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         for (let v of json.data) {
            client.sendFile(m.chat, v.url, Func.filename(v.type), `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(1500)
         }
      } else if (['mediafire', 'mf'].includes(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://www.mediafire.com/file/a8cermi1xtwwnk7/GBWA_MiNi_v2.0_SamMods.apk/file'), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/mediafire', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let text = `乂  *M E D I A F I R E*\n\n`
         text += '	◦  *Name* : ' + unescape(decode(json.data.filename)) + '\n'
         text += '	◦  *Size* : ' + json.data.size + '\n'
         text += '	◦  *Extension* : ' + json.data.extension + '\n'
         text += '	◦  *Mime* : ' + json.data.mime + '\n'
         text += '	◦  *Uploaded* : ' + json.data.uploaded + '\n\n'
         text += global.footer
         const chSize = Func.sizeLimit(json.data.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.data.link)).data.url}` : `⚠️ File size (${json.data.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         client.sendMessageModify(m.chat, text, m, {
            largeThumb: true,
            thumbnail: 'https://telegra.ph/file/fcf56d646aa059af84126.jpg'
         }).then(async () => {
            client.sendFile(m.chat, json.data.link, unescape(decode(json.data.filename)), '', m)
         })
      } else if (['threads'].includes(command)) {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://www.threads.net/@httpnald_/post/CwWvCFvJr_N/?igshid=NTc4MTIwNjQ2YQ=='), m)
         let old = new Date()
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/threads', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         for (let v of json.data) {
            client.sendFile(m.chat, v.url, Func.filename(v.type), `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(1500)
         }
      } 
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, e.message, m)
   }
}, {
   usage: ['ss', 'threads', 'fetch', 'tiktok', 'tikmp3', 'tikwm', 'fb', 'ig', 'igs', 'igh', 'twitter', 'mediafire'],
   hidden: ['get', 'tt', 'fbdl', 'tw', 'mf'],
   use: 'link',
   category: 'features',
   limit: true
}, __filename)