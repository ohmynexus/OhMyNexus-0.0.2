neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      const prop = (command == '+limit') ? 'limit' : (command == '+limitg') ? 'limitGame' : (command == '+balance') ? 'balance' : (command == '+pocket') ? 'pocket' : 'point'
      if (m.quoted) {
         if (m.quoted.isBot) return client.reply(m.chat, Func.texted('bold', `🚩 Cannot make topup to bot.`), m)
         if (!args || !args[0]) return client.reply(m.chat, Func.texted('bold', `🚩 Provide the nominal to be topup.`), m)
         if (isNaN(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 The Nominal must be a number.`), m)
         let nominal = parseInt(args[0])
         let target = client.decodeJid(m.quoted.sender)
         global.db.users.find(v => v.jid == target)[prop] += nominal
         let teks = `乂  *T O P U P*\n\n`
         teks += `“Topup ${(command == '+limit') ? 'limit' : (command == '+limitg') ? 'limit game' : (command == '+balance') ? 'balance' : (command == '+pocket') ? 'pocket' : 'point'} successfully to *@${target.replace(/@.+/g, '')}*”\n\n`
         teks += `➠ *Nominal* : ${Func.formatNumber(nominal)}\n`
         teks += `➠ *Total* : ${Func.formatNumber(global.db.users.find(v => v.jid == target)[prop])}`
         client.reply(m.chat, teks, m)
      } else if (m.mentionedJid.length != 0) {
         if (!args || !args[1]) return client.reply(m.chat, Func.texted('bold', `🚩 Provide the nominal balance to be transferred.`), m)
         if (isNaN(args[1])) return client.reply(m.chat, Func.texted('bold', `🚩 The balance must be a number.`), m)
         let nominal = parseInt(args[1])
         let target = client.decodeJid(m.mentionedJid[0])
         global.db.users.find(v => v.jid == target)[prop] += nominal
         let teks = `乂  *T O P U P*\n\n`
         teks += `“Topup ${(command == '+limit') ? 'limit' : (command == '+limitg') ? 'limit game' : (command == '+balance') ? 'balance' : (command == '+pocket') ? 'pocket' : 'point'} successfully to *@${target.replace(/@.+/g, '')}*”\n\n`
         teks += `➠ *Nominal* : ${Func.formatNumber(nominal)}\n`
         teks += `➠ *Total* : ${Func.formatNumber(global.db.users.find(v => v.jid == target)[prop])}`
         client.reply(m.chat, teks, m)
      } else {
         let teks = `• *Example* :\n\n`
         teks += `${prefix + command} @0 10000\n`
         teks += `${prefix + command} 10000 (reply chat target)`
         client.reply(m.chat, teks, m)
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['+balance', '+pocket', '+limit', '+limitg', '+point'],
   use: '@tag amount',
   category: 'owner',
   owner: true
}, __filename) 