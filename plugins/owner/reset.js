neoxr.create(async (m, {
   client,
   args,
   setting,
   env,
   Func
}) => {
   try {
      global.db.users.filter(v => v.limit < env.limit && !v.premium).map(v => v.limit = args[0] ? args[0] : env.limit)
      global.db.users.filter(v => v.limitGame < env.limit_game && !v.premium).map(v => v.limitGame = env.limit_game)
      setting.lastReset = new Date * 1
      client.reply(m.chat, Func.texted('bold', `🚩 Successfully reset limit for user free to default.`), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['reset'],
   category: 'owner',
   owner: true
}, __filename)