neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   groupSet,
   Func
}) => {
   try {
      let opt = [0, 1]
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return client.reply(m.chat, `🚩 *Current status* : [ ${groupSet.mute ? 'True' : 'False'} ] (Enter *1* or *0*)`, m)
      if (parseInt(args[0]) == 1) {
         if (groupSet.mute) return client.reply(m.chat, Func.texted('bold', `🚩 Previously muted.`), m)
         groupSet.mute = true
         client.reply(m.chat, Func.texted('bold', `🚩 Successfully muted.`), m)
      } else if (parseInt(args[0]) == 0) {
         if (!groupSet.mute) return client.reply(m.chat, Func.texted('bold', `🚩 Previously unmuted.`), m)
         groupSet.mute = false
         client.reply(m.chat, Func.texted('bold', `🚩 Successfully unmuted.`), m)
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['mute'],
   use: '0 / 1',
   category: 'admin tools',
   admin: true,
   group: true
}, __filename)