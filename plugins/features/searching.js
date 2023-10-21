const moment = require('moment-timezone')
moment.locale('en')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      if (command == 'chord') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/chord', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         client.reply(m.chat, json.data.chord, m)
      } else if (command == 'pinterest') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.neoxr('/pinterest', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(2000)
         }
      } else if (command == 'art') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'evil cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         const json = await Api.neoxr('/diffusion', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, json.data[rand].filename, `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(2000)
         }
      } else if (command == 'google') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/google', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let teks = `乂  *G O O G L E - S E A R C H*\n\n`
         json.data.map((v, i) => {
            teks += '*' + (i + 1) + '. ' + v.title + '*\n'
            teks += '	◦  *Snippet* : ' + v.description + '\n'
            teks += '	◦  *Link* : ' + v.url + '\n\n'
         })
         client.sendMessageModify(m.chat, teks + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d7b761ea856b5ba7b0713.jpg')
         })
      } else if (command == 'goimg') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         const json = await Api.neoxr('/goimg', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            let caption = `乂  *G O O G L E - I M A G E*\n\n`
            caption += `	◦ *Title* : ${json.data[i].origin.title}\n`
            caption += `	◦ *Dimensions* : ${json.data[i].width} × ${json.data[i].height}\n\n`
            caption += global.footer
            client.sendFile(m.chat, json.data[rand].url, '', caption, m)
            await Func.delay(2500)
         }
      } else if (command == 'npm') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'queue'), m)
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.neoxr('/npm', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let teks = `乂  *N P M J S*\n\n`
         json.data.map((v, i) => {
            teks += '*' + (i + 1) + '. ' + v.name + '*\n'
            teks += '	◦  *Version* : ' + v.version + '\n'
            teks += '	◦  *Description* : ' + v.description + '\n'
            teks += '	◦  *Author* : @' + v.publisher.username + '\n'
            teks += '	◦  *Published* : ' + moment(v.date).format('dddd, DD/MM/YYYY hh:mm') + '\n'
            teks += '	◦  *Link* : ' + v.links.npm + '\n\n'
         })
         client.sendMessageModify(m.chat, teks + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/c416638747ec63d97d20b.jpg')
         })
      } else if (['wp', 'wallpaper'].includes(command)) {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'sea'), m)
         const json = await Api.neoxr('/wallpaper2', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, json.msg, m)
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, '', json.data[rand].title, m)
            await Func.delay(2500)
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['art', 'npm', 'chord', 'pinterest', 'google', 'goimg', 'wallpaper'],
   hidden: ['wp'],
   use: 'query',
   category: 'features',
   limit: true
}, __filename)