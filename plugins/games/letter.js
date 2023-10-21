neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.letter = client.letter ? client.letter : {}
      let id = m.chat,
         timeout = 60000,
         object = Func.random([{
            q: 'O',
            a: 'Q'
         }, {
            q: 'N',
            a: 'M'
         }, {
            q: 'V',
            a: 'U'
         }, {
            q: 'E',
            a: 'F'
         }, {
            q: 'S',
            a: '5'
         }, {
            q: 'l',
            a: '1'
         }, {
            q: 'B',
            a: 'R'
         }, {
            q: 'T',
            a: '7'
         }, {
            q: 'I',
            a: 'H'
         }])
      if (id in client.letter) return client.reply(m.chat, '*^ This session isn\'t over yet!*', client.letter[id][0])
      let q = Func.randomInt(1, 7)
      let a = Func.randomInt(50, 200)
      let _q = object.q.repeat(q).split('')
      let _a = object.a.repeat(a).split('')
      const shuffleArray = arr => {
         let currentIndex = arr.length
         let tempVal, randomIndex
         // While there are still elements to shuffle
         while (currentIndex !== 0) {
            // Pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1
            // Swap it with the current element
            tempVal = arr[currentIndex]
            arr[currentIndex] = arr[randomIndex]
            arr[randomIndex] = tempVal
         }
         return arr
      }
      const json = {
         prefix: object.q,
         question: shuffleArray(_q.concat(_a)).join(''),
         answer: q
      }
      let teks = `乂  *L E T T E R*\n\n`
      teks += `How many letters "${json.prefix}" can you find ??\n\n`
      teks += `${json.question}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply this message to answer, send *${prefix}letskip* to delete the session.`
      client.letter[id] = [
         await client.reply(m.chat, teks, m),
         json, 3,
         setTimeout(() => {
            if (client.letter[id]) client.reply(m.chat, `*Time's up!*, the answer is : *${client.letter[id][1].answer}*`, client.letter[id][0])
            delete client.letter[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['letter'],
   hidden: ['let'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)