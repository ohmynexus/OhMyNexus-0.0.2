neoxr.create(async (m, {
   client,
   command,
   Func
}) => {
   try {
      var id = m.chat
      if (command == 'fiboskip') {
         client.deret = client.deret ? client.deret : {}
         if ((id in client.deret)) return client.reply(m.chat, Func.texted('bold', `✅ Fibonacci game session successfully deleted.`), m).then(() => delete client.deret[id])
      } else if (command == 'skip') {
         client.math = client.math ? client.math : {}
         if ((id in client.math)) return client.reply(m.chat, Func.texted('bold', `✅ Math game session successfully deleted.`), m).then(() => delete client.math[id])
      } else if (command == 'listenskip') {
         client.listening = client.listening ? client.listening : {}
         if ((id in client.listening)) return client.reply(m.chat, Func.texted('bold', `✅ Listening game session successfully deleted.`), m).then(() => delete client.listening[id])
      } else if (command == 'letskip') {
         client.letter = client.letter ? client.letter : {}
         if ((id in client.letter)) return client.reply(m.chat, Func.texted('bold', `✅ Letter game session successfully deleted.`), m).then(() => delete client.letter[id])
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['fiboskip', 'skip', 'listenskip', 'letskip'],
   limit: true,
   group: true,
   game: true
}, __filename)