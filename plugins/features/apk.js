neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   env,
   users,
   Func,
   Scraper
}) => {
   try {
      client.apk = client.apk ? client.apk : []
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
      const check = client.apk.find(v => v.jid == m.sender)
      if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
      if (check && !isNaN(text)) {
         if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/apk', {
            q: check.query,
            no: Number(text)
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let teks = `乂  *P L A Y S T O R E*\n\n`
         teks += '	◦  *Name* : ' + json.data.name + '\n'
         teks += '	◦  *Version* : ' + json.data.version + '\n'
         teks += '	◦  *Size* : ' + json.file.size + '\n'
         teks += '	◦  *Category* : ' + json.data.category + '\n'
         teks += '	◦  *Developer* : ' + json.data.developer + '\n'
         teks += '	◦  *Requirement* : ' + json.data.requirement + '\n'
         teks += '	◦  *Publish* : ' + json.data.publish + '\n'
         teks += '	◦  *Link* : ' + json.data.playstore + '\n\n'
         teks += global.footer
         const chSize = Func.sizeLimit(json.file.size, users.premium ? env.max_upload : env.max_upload_free)
         const isOver = users.premium ? `💀 File size (${json.file.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.file.url)).data.url}` : `⚠️ File size (${json.file.size}), you can only download files with a maximum size of ${env.max_upload_free} MB and for premium users a maximum of ${env.max_upload} MB.`
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         client.sendFile(m.chat, json.data.thumbnail, '', teks, m).then(() => {
            client.sendFile(m.chat, json.file.url, json.file.filename, '', m)
         })
      } else {
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/apk', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (!check) {
            client.apk.push({
               jid: m.sender,
               query: text,
               results: json.data.map(v => v.url),
               created_at: new Date * 1
            })
         } else check.results = json.data.map(v => v.url)
         let p = `To download apks use this command *${prefix + command} number*\n`
         p += `*Example* : ${prefix + command} 1\n\n`
         json.data.map((v, i) => {
            p += `*${i+1}*. ${v.name}\n`
            p += `◦ *Size* : ${v.size} – Version : ${v.version}\n\n`
         }).join('\n\n')
         p += global.footer
         client.reply(m.chat, p, m)
      }
      setInterval(async () => {
         const session = client.apk.find(v => v.jid == m.sender)
         if (session && new Date - session.created_at > env.timeout) {
            Func.removeItem(client.apk, session)
         }
      }, 60_000)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['apk'],
   hidden: ['getapk'],
   use: 'query',
   category: 'features',
   restrict: true,
   limit: true
}, __filename)