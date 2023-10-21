neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   users,
   Func
}) => {
   try {
      if (!args || !args[0] || args[0].startsWith('0')) return client.reply(m.chat, Func.texted('bold', `🚩 Give the number of points you want to spin.`), m)
      if (isNaN(args[0])) return client.reply(m.chat, Func.example(prefix, command, '10000'), m)
      if (args[0] > users.point) return client.reply(m.chat, Func.texted('bold', `🚩 Your points are not enough to spin ${Func.formatNumber(args[0])} points.`), m)
      if (args[0] < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 Cannot spin with a nominal value below 1000 points.`), m)
      users.point -= args[0]
      let reward = Func.randomInt(100, args[0] * 3)
      users.point += reward
      let last = users.point
      let teks = `乂  *S P I N - R E S U L T*\n\n`
      teks += `	*- ${Func.formatNumber(args[0])}*\n`
      teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
      teks += `• *Total* : ${Func.formatNumber(last)} Point\n\n`
      teks += `*NB : “Wait ${global.cooldown} seconds for next execution.”*`
      client.reply(m.chat, teks, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['spin'],
   category: 'games',
   limit: true,
   game: true,
   group: true
}, __filename)