const os = require('os')
const axios = require('axios')
neoxr.create(async (m, {
   client,
   command,
   setting,
   env,
   Func,
   Scraper
}) => {
   try {
      if (command == 'runtime' || command == 'run') return m.reply(`*Running for : [ ${Func.toTime(process.uptime() * 1000)} ]*`)
      if (command == 'server') {
         const json = await Func.fetchJson('http://ip-api.com/json')
         delete json.status
         delete json.query
         let caption = `乂  *S E R V E R*\n\n`
         caption += `┌  ◦  OS : ${os.type()} (${os.arch()} / ${os.release()})\n`
         caption += `│  ◦  Ram : ${Func.formatSize(process.memoryUsage().rss)} / ${Func.formatSize(os.totalmem())}\n`
         for (let key in json) caption += `│  ◦  ${Func.ucword(key)} : ${json[key]}\n`
         caption += `│  ◦  Uptime : ${Func.toTime(os.uptime * 1000)}\n`
         caption += `└  ◦  Processor : ${os.cpus()[0].model}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
            ads: false,
            largeThumb: true,
            thumbnail: setting.cover
         })
      }
      if (/check(api)?/.test(command)) {
         let json = await Api.neoxr('/check')
         await client.reply(m.chat, Func.jsonFormat(json), m)
      }
      if (command == 'owner') return client.sendContact(m.chat, [{
         name: env.owner_name,
         number: env.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'Neoxr Network',
         website: 'https://api.neoxr.my.id',
         email: 'contact@neoxr.my.id'
      })
      if (command == 'tourl') {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 File not found!`), m)
         client.sendReact(m.chat, '🕒', m.key)
         const file = await q.download()
         const json = await Scraper.uploadImageV2(file)
         m.reply(Func.jsonFormat(json))
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['checkapi', 'runtime', 'server'],
   hidden: ['owner', 'api', 'run', 'tourl'],
   category: 'miscs'
}, __filename)