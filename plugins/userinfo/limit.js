neoxr.create(async (m, {
   client,
   users,
   prefix,
   Func
}) => {
   try {
      let teks = `➠ Limit : *${Func.formatter(users.limit)}*\n`
      teks += `➠ Game Limit : *${Func.formatter(users.limitGame)}*`
      teks += `${!users.premium ? `\n\nTo get more limits, upgrade to a premium plan send *${prefix}premium*` : ''}`
      client.reply(m.chat, teks, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['limit'],
   category: 'user info'
}, __filename)