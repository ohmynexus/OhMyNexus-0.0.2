neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   setting,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'how to create an api'), m)
      client.sendReact(m.chat, '🕒', m.key)
      const json = await Api.neoxr('/bard', {
         q: text
      })
      if (!json.status) return client.reply(m.chat, global.status.fail, m)
      client.reply(m.chat, json.data.message, m)
   } catch (e) {
      console.log(e)
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['bard'],
   use: 'query',
   category: 'features',
   limit: true
}, __filename)