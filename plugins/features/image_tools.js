const toJpg = require('lib/toJpg')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   users,
   Func,
   Scraper
}) => {
   try {
      if (command == 'snobg') {
         if (!users.premium) return m.reply(global.status.premium)
         let exif = global.db.setting
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let img = await client.downloadMediaMessage(q)
               let url = await Scraper.uploadImageV2(img)
               let remove = await Api.neoxr('/nobg3', {
                  image: url.data.url
               })
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (/image\/(jpe?g|png)/.test(mime)) {
               client.sendReact(m.chat, '🕒', m.key)
               let img = await q.download()
               let url = await Scraper.uploadImageV2(img)
               let remove = await Api.neoxr('/nobg3', {
                  image: url.data.url
               })
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image\/webp/.test(mime)) {
               client.sendReact(m.chat, '🕒', m.key)
               let json = await toJpg(await (await Scraper.uploadImageV2(await q.download())).data.url)
               if (!json.status) return m.reply(Func.jsonFormat(json))
               let remove = await Api.neoxr('/nobg3', {
                  image: json.data.url
               })
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         }
      } else if (command == 'nobg') {
         if (!users.premium) return m.reply(global.status.premium)
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let old = new Date()
               client.sendReact(m.chat, '🕒', m.key)
               let img = await client.downloadMediaMessage(q)
               let url = await Scraper.uploadImageV2(img)
               let remove = await Api.neoxr('/nobg3', {
                  image: url.data.url
               })
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               client.sendFile(m.chat, remove.data.no_background, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            let old = new Date()
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let url = await Scraper.uploadImageV2(img)
            let remove = await Api.neoxr('/nobg3', {
               image: url.data.url
            })
            if (!remove.status) return m.reply(Func.jsonFormat(remove))
            client.sendFile(m.chat, remove.data.no_background, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } else if (command == 'smeme') {
         let exif = global.db.setting
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'Hi | Dude'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let [top, bottom] = text.split`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await client.downloadMediaMessage(q)
               let json = await Scraper.uploadImageV2(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               let json = await Scraper.uploadImageV2(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image\/webp/.test(mime)) {
               client.sendReact(m.chat, '🕒', m.key)
               let json = await toJpg(await (await Scraper.uploadImageV2(await q.download())).data.url)
               if (!json.status) return m.reply(Func.jsonFormat(json))
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         }
      } else if (command == 'ocr') {
         if (!users.premium) return m.reply(global.status.premium)
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (!/image/.test(type)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Scraper.uploadImageV2(img)
            const result = await Api.neoxr('/ocr', {
               image: json.data.url
            })
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.reply(m.chat, result.data.text, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Scraper.uploadImageV2(img)
            const result = await Api.neoxr('/ocr', {
               image: json.data.url
            })
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.reply(m.chat, result.data.text, m)
         }
      } else if (command == 'remini') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImage(img)
               let result = await Api.neoxr('/remini2', {
                  image: image.data.url
               })
               if (!result.status) return m.reply(Func.jsonFormat(result))
               client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            let img = await q.download()
            let image = await Scraper.uploadImage(img)
            let result = await Api.neoxr('/remini2', {
               image: image.data.url
            })
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } else if (command == 'face') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImageV2(img)
               const json = await Api.neoxr('/age', {
                  image: image.data.url
               })
               if (!json.status) return m.reply(Func.jsonFormat(json))
               m.reply(`✅ *Result* : ${Func.ucword(json.data.gender)} (${json.data.age} y.o)`)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let image = await Scraper.uploadImageV2(img)
            const json = await Api.neoxr('/age', {
               image: image.data.url
            })
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(`✅ *Result* : ${Func.ucword(json.data.gender)} (${json.data.age} y.o)`)
         }
      } else if (command == 'recolor') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (!/image/.test(type)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            const json = await Scraper.uploadImageV2(img)
            const result = await Api.neoxr('/recolor', {
               image: json.data.url
            })
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let old = new Date()
            const json = await Scraper.uploadImageV2(img)
            const result = await Api.neoxr('/recolor', {
               image: json.data.url
            })
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      }
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['face', 'snobg', 'nobg', 'smeme', 'ocr', 'remini', 'recolor'],
   use: 'reply photo',
   category: 'features',
   limit: true
}, __filename)