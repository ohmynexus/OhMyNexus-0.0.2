neoxr.create(async (m, {
   client,
   args,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      client.spotify = client.spotify ? client.spotify : []
      const check = client.spotify.find(v => v.jid == m.sender)
      if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'https://open.spotify.com/track/6cHCixTkEFATjcu5ig8a7I'), m)
      client.sendReact(m.chat, '🕒', m.key)
      if (args[0].match('open.spotify.com') && /track/.test(args[0])) {
         const json = await Api.neoxr('/spotify', {
            url: args[0]
         })
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `乂  *S P O T I F Y*\n\n`
         caption += `	◦  *Title* : ${json.data.title}\n`
         caption += `	◦  *Artist* : ${json.data.artist.name}\n`
         caption += `	◦  *Duration* : ${json.data.duration}\n`
         caption += `	◦  *Source* : ${args[0]}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: await Func.fetchBuffer(json.data.thumbnail)
         }).then(async () => {
            client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
               document: true,
               APIC: await Func.fetchBuffer(json.data.thumbnail)
            })
         })
      } else if (args[0].match('open.spotify.com') && /playlist/.test(args[0])) {
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.neoxr('/spotify', {
               url: check.results[Number(text) - 1]
            })
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let caption = `乂  *S P O T I F Y*\n\n`
            caption += `	◦  *Title* : ${json.data.title}\n`
            caption += `	◦  *Artist* : ${json.data.artist.name}\n`
            caption += `	◦  *Duration* : ${json.data.duration}\n`
            caption += `	◦  *Source* : ${check.results[Number(text) - 1]}\n\n`
            caption += global.footer
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.data.thumbnail)
            }).then(async () => {
               client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
                  document: true,
                  APIC: await Func.fetchBuffer(json.data.thumbnail)
               })
            })
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.neoxr('/spotify', {
               url: args[0]
            })
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               client.spotify.push({
                  jid: m.sender,
                  results: json.tracks.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To get song use this command *${prefix + command} number*\n`
            p += `*Example* : ${prefix + command} 1\n\n`
            json.tracks.map((v, i) => {
               p += `*${i+1}*. ${v.title}\n`
               p += `◦ *Artists* : ${v.artists}\n`
               p += `◦ *Album* : ${v.album}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
      } else {
         if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
         if (check && !isNaN(text)) {
            if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.neoxr('/spotify', {
               url: check.results[Number(text) - 1]
            })
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            let caption = `乂  *S P O T I F Y*\n\n`
            caption += `	◦  *Title* : ${json.data.title}\n`
            caption += `	◦  *Artist* : ${json.data.artist.name}\n`
            caption += `	◦  *Duration* : ${json.data.duration}\n`
            caption += `	◦  *Source* : ${check.results[Number(text) - 1]}\n\n`
            caption += global.footer
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json.data.thumbnail)
            }).then(async () => {
               client.sendFile(m.chat, json.data.url, json.data.title + '.mp3', '', m, {
                  document: true,
                  APIC: await Func.fetchBuffer(json.data.thumbnail)
               })
            })
         } else {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.neoxr('/spotify-search', {
               q: text
            })
            if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
            if (!check) {
               client.spotify.push({
                  jid: m.sender,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            let p = `To get information use this command *${prefix + command} number*\n`
            p += `*Example* : ${prefix + command} 1\n\n`
            json.data.map((v, i) => {
               p += `*${i+1}*. ${v.title}\n`
               p += `◦ *Duration* : ${v.duration}\n`
               p += `◦ *Popularity* : ${v.popularity}\n\n`
            }).join('\n\n')
            p += global.footer
            client.reply(m.chat, p, m)
         }
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['spotify'],
   use: 'query / link',
   category: 'features',
   limit: true,
   premium: true
}, __filename)