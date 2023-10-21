neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   env,
   Func
}) => {
   try {
      var id = m.chat
      var reward = Func.randomInt(env.min_reward, env.max_reward)
      client.listening = client.listening ? client.listening : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (m.quoted && /listenclue/i.test(m.quoted.text)) {
         if (!(id in client.listening) && /listenclue/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}whatsong_ untuk mendapatkan soal baru.`), m)
         if (m.quoted.id == client.listening[id][0].id) {
            if (['Timeout', ''].includes(body)) return !0
            if (body.toLowerCase() == client.listening[id][1].toLowerCase()) {
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*+ ${Func.formatNumber(reward)} Point*`, m)
                  users.point += reward
                  clearTimeout(client.listening[id][2])
                  delete client.listening[id]
               })
            } else {
               if (users.point == 0) return client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               })
               users.point < reward ? users.point = 0 : users.point -= reward
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*- ${Func.formatNumber(reward)} Point*`, m)
               })
            }
         }
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   error: false,
   group: true,
   game: true
}, __filename)