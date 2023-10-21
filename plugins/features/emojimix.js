neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   setting,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, '😳+😩'), m)
      let [emo1, emo2] = text.split`+`
      if (!emo1 || !emo2) return client.reply(m.chat, Func.texted('bold', `🚩 Give 2 emoticons to mix.`), m)
      const json = await Api.neoxr('/emoji', {
         q: emo1 + '_' + emo2
      })
      if (!json.status) return client.reply(m.chat, Func.texted('bold', `🚩 Emoticons can't be mixed.`), m)
      await client.sendSticker(m.chat, await Func.fetchBuffer(json.data.url), m, {
         packname: setting.sk_pack,
         author: setting.sk_author,
         categories: [emo1, emo2]
      })
   } catch (e) {
      console.log(e)
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['emojimix'],
   hidden: ['mix', 'emomix'],
   use: 'emoji + emoji',
   category: 'features',
   limit: true
}, __filename)