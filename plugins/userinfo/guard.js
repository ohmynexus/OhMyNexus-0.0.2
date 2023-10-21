neoxr.create(async (m, {
   client,
   users,
   prefix,
   Func
}) => {
   try {
      if (users.point < 1) return client.reply(m.chat, `🚩 You don't have guards`, m)
      client.reply(m.chat, Func.texted('bold', `🚩 You have ${Func.formatNumber(users.guard)} guards.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['guard'],
   category: 'user info'
}, __filename)