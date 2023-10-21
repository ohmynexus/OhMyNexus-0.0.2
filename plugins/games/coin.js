neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   users,
   env,
   Func
}) => {
   try {
      if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'A'), m)
      if (users.point == 0) return client.reply(m.chat, Func.texted('bold', `🚩 You have no points to play this game.`), m)
      if (users.point < 300000) return client.reply(m.chat, Func.texted('bold', `🚩 To play this game you must have at least 300K points.`), m)
      let x = Func.ucword(args[0])
      if (x == 'A' || x == 'B') {
         var type = Func.random(['A', 'B'])
         if (Func.ucword(args[0]) == type) {
            let percent = Func.randomInt(5, 10)
            let reward = ((percent / 100) * users.point)
            users.point += reward
            let last = users.point
            let teks = `乂  *W I N*\n\n`
            teks += `	*System* : ${type}, *You* : ${Func.ucword(args[0])}!\n`
            teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
            teks += `• *Total* : ${Func.formatNumber(last)} Point\n\n`
            teks += `*NB : “Wait ${env.cooldown} seconds for next execution.”*`
            client.reply(m.chat, teks, m)
         } else if (Func.ucword(args[0]) != type) {
            let percent = Func.randomInt(5, 15)
            let reward = ((percent / 100) * users.point)
            users.point -= reward
            let last = users.point
            let teks = `乂  *L O S E*\n\n`
            teks += `	*System* : ${type}, *You* : ${Func.ucword(args[0])}!\n`
            teks += `	*- ${Func.formatNumber(reward)}*\n\n`
            teks += `• *Total* : ${Func.formatNumber(last)} Point\n\n`
            teks += `*NB : “Wait ${env.cooldown} seconds for next execution.”*`
            client.reply(m.chat, teks, m)
         }
      } else {
         return client.reply(m.chat, Func.texted('bold', `🚩 There are only arguments A and B.`), m)
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['coin'],
   use: 'A / B',
   category: 'games',
   limit: true,
   game: true,
   group: true
}, __filename)