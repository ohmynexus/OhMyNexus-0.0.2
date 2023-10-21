neoxr.create(async (m, {
   client,
   command,
   Func
}) => {
   try {
      var id = m.chat
      if (command == 'listenclue') {
         client.listening = client.listening ? client.listening : {}
         if ((id in client.listening)) {
            const clue = client.listening[id][1].replace(/[bcdfghjklmnpqrstvwxyz]/g, '_')
            client.reply(m.chat, '🚩 Clue : ' + clue, m)
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['listenclue'],
   limit: true,
   group: true,
   game: true
}, __filename)