const { writeFileSync: create, readFileSync: read }= require('fs')
const { MongoDB } = new(require('@neoxr/wb'))
const stable = require('json-stable-stringify')
neoxr.create(async (m, {
   client,
   env,
   Func
}) => {
   try {
      const machine = process.env.DATABASE_URL ? MongoDB : new(require('lib/system/localdb'))(env.database)
      await machine.save(global.db)
      create('./' + env.database + '.json', stable(global.db), 'utf-8')
      client.sendReact(m.chat, '🕒', m.key)
      await client.sendFile(m.chat, read('./' + env.database + '.json'), env.database + '.json', '', m)
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['backup'],
   category: 'owner',
   owner: true
}, __filename)