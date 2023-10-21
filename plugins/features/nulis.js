const BigBossGenerator = require('lib/generator/BigBoss')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      const input = m.quoted ? m.quoted.text : text
      if (!input) return client.reply(m.chat, Func.example(prefix, command, 'ur are beautiful'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let old = new Date()
      let Generator = new BigBossGenerator({
         font: 'arch',
         color: 'black',
         size: 19
      })
      Generator.image = 'book'
      await Generator.loadImage()
      await Generator.write(input)
      const image = await Generator.buffers[0]
      client.sendFile(m.chat, image, 'book.jpg', `🍟 *Processed* : ${((new Date - old) * 1)} ms`, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['nulis'],
   use: 'text',
   category: 'features',
   limit: true
}, __filename)