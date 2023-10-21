neoxr.create(async (m, {
   client,
   Func
}) => {
   try {
      client.bomb = client.bomb ? client.bomb : {}
      let id = m.chat,
         timeout = 180000
      if (id in client.bomb) return client.reply(m.chat, '*^ This session isn\'t over yet!*', client.bomb[id][0])
      const bom = ['💥', '✅', '✅', '✅', '✅', '✅', '✅', '✅', '✅'].sort(() => Math.random() - 0.5)
      const number = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
      const array = []
      bom.map((v, i) => array.push({
         emot: v,
         number: number[i],
         position: i + 1,
         state: false
      }))
      let teks = `乂  *B O M B*\n\n`
      teks += `Send numbers *1* - *9* to open the *9* number box below :\n\n`
      teks += array.slice(0, 3).map(v => v.state ? v.emot : v.number).join('') + '\n'
      teks += array.slice(3, 6).map(v => v.state ? v.emot : v.number).join('') + '\n'
      teks += array.slice(6).map(v => v.state ? v.emot : v.number).join('') + '\n\n'
      teks += `Timeout : [ *${((timeout / 1000) / 60)} minutes* ]\n`
      teks += `If you get a box containing a bomb, points will be deducted.`
      client.bomb[id] = [
         await client.reply(m.chat, teks, m),
         array,
         setTimeout(() => {
            let v = array.find(v => v.emot == '💥')
            if (client.bomb[id]) client.reply(m.chat, `*Time is up!*, The bomb is in the number box ${v.number}.`, client.bomb[id][0])
            delete client.bomb[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['bomb'],
   hidden: ['bom'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)