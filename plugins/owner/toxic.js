neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   setting,
   Func
}) => {
   try {
      if (command == '+toxic') {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'fuck'), m)
         if (setting.toxic.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' already in the database.`), m)
         setting.toxic.push(args[0])
         setting.toxic.sort(function(a, b) {
            if (a < b) {
               return -1;
            }
            if (a > b) {
               return 1;
            }
            return 0
         })
         client.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' added successfully!`), m)
      } else if (command == '-toxic') {
         if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'fuck'), m)
         if (setting.toxic.length < 2) return client.reply(m.chat, Func.texted('bold', `🚩 Sorry, you can't remove more.`), m)
         if (!setting.toxic.includes(args[0])) return client.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' not in database.`), m)
         setting.toxic.forEach((data, index) => {
            if (data === args[0]) setting.toxic.splice(index, 1)
         })
         client.reply(m.chat, Func.texted('bold', `🚩 '${args[0]}' has been removed.`), m)
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['+toxic', '-toxic'],
   use: 'word',
   category: 'owner',
   owner: true
}, __filename)