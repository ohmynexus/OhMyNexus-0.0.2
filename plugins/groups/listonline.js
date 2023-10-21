neoxr.create(async (m, {
   client,
   store,
   Func
}) => {
   try {
      let online = [...Object.keys(store.presences[m.chat])]
      if (online.length < 1) return m.reply(Func.texted('bold', `🚩 The system does not detect members who are online.`))
      client.reply(m.chat, online.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n'), m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['listonline'],
   hidden: ['here'],
   category: 'group',
   group: true
}, __filename)