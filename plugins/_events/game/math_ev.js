neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   env,
   Func
}) => {
   try {
      let id = m.chat
      client.math = client.math ? client.math : {}
      if (m.quoted && m.quoted.sender != client.user.id.split(':')[0] + '@s.whatsapp.net') return
      if (m.quoted && /Answer the math questions below/i.test(m.quoted.text)) {
         if (!(id in client.math) && /Answer the math questions below/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Question has ended, send _${prefixes[0]}math_ to get a new question.`), m)
         let math = JSON.parse(JSON.stringify(client.math[id][1]))
         if (m.text == math.result) {
            users.point += math.bonus
            clearTimeout(client.math[id][3])
            delete client.math[id]
            await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
               packname: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }).then(() => {
               client.reply(m.chat, Func.texted('bold', `+ ${math.bonus} Point`), m)
            })
         } else {
            if (--client.math[id][2] == 0) {
               clearTimeout(client.math[id][3])
               delete client.math[id]
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `🚩 _Game over because you have answered wrong 3 times, the answer is_ : *${math.result}*`, m)
               })
            } else await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
               packname: global.db.setting.sk_pack,
               author: global.db.setting.sk_author
            }) // client.reply(m.chat, Func.texted('bold', `${client.math[id][2]} chances to answer.`), m)}
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