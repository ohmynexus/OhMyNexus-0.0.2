neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.deret = client.deret ? client.deret : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.deret) return client.reply(m.chat, '*^ This session isn\'t over yet!*', client.deret[id][0])
      const isO = Func.random(['+', '*'])
      const isX = Func.randomInt(1, isO == '*' ? 3 : 25)
      const isY = Func.randomInt(isO == '*' ? 4 : 26, isO == '*' ? 7 : 50)
      const isF = Func.randomInt(1, isO == '*' ? 5 : 7)
      const isR = Func.randomInt(1, isF)
      const isD = Func.fibonacci(isX, isY, isF, isO)
      const isS = isD[isR]
      let teks = `乂  *F I B O N A C C I*\n\n`
      teks += `Complete the number sequence below :\n`
      teks += `➠ ${isD.map(v => v).join(' ').replace(RegExp(isS, 'i'), '_')}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply this message to answer, send *${prefix}fiboskip* to delete the session.`
      client.deret[id] = [
         await client.reply(m.chat, teks, m),
         isS, 3,
         setTimeout(() => {
            if (client.deret[id]) client.reply(m.chat, `*Time's up!*, the answer is : *${client.deret[id][1]}*`, client.deret[id][0])
            delete client.deret[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['fibonacci'],
   hidden: ['fibo'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)