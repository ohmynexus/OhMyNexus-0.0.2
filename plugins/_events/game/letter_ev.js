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
      client.letter = client.letter ? client.letter : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (m.quoted && /letskip/i.test(m.quoted.text)) {
         if (!(id in client.letter) && /letskip/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Question has ended, send _${prefixes[0]}letter_ to get a new question.`), m)
         if (body == client.letter[id][1].answer) {
            users.point += reward
            clearTimeout(client.letter[id][3])
            delete client.letter[id]
            await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
               packname: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, Func.texted('bold', `+ ${Func.formatNumber(reward)} Point`), m)
            })
         } else {
            if (--client.letter[id][2] == 0) {
               clearTimeout(client.letter[id][3])
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `🚩 _Game over because you have answered incorrectly 3 times, the answer is_ : *${client.letter[id][1].answer}*`, m).then(() => delete client.letter[id])
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