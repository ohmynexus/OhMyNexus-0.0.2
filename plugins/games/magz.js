neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      if (global.db.users.find(v => v.jid == m.sender).point < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 Points you have are not enough to play magz games.`), m)
      client.magz = client.magz ? client.magz : {}
      let timeout = 120000,
         id = m.chat
      if (command == 'magz') return client.reply(m.chat, info(prefix), m)
      if (command == 'create') {
         let check = Object.values(client.magz).find(room => room.id == m.chat)
         if (check) return client.reply(m.chat, Func.texted('bold', `🚩 Session is already available with a code : "${check.code}"`), m)
         let code = Func.makeId(4)
         let teks = `Magz game session created successfully with code : *${code}*\n\n`
         teks += `🚩 If you want to single player, send *${prefix}start*, you can also invite your friend to join the session to play together by asking your friend to send *${prefix}in*`
         client.magz[id] = {
            m: await client.reply(m.chat, teks, m),
            player: [m.sender],
            leaderboard: {
               [m.sender]: {
                  score: 0,
                  correctAns: 0,
                  wrongAns: 0
               }
            },
            code,
            creator: m.sender,
            id,
            playing: false,
            playTimes: 0,
            words: [],
            answer: '',
            wrongs: 0,
            startTime: setTimeout(() => {
               if (client.magz[id]) return client.reply(m.chat, Func.texted('bold', `🚩 Game does not start within 2 minutes, room "${code}" has been removed.`), m).then(() => {
                  delete client.magz[id]
               })
            }, timeout),
            timeout
         }
      } else if (command == 'in') {
         let room1 = Object.values(client.magz).find(room => room.id == m.chat)
         let room2 = Object.values(client.magz).find(room => room.id == m.chat && room.playing)
         let room3 = Object.values(client.magz).find(room => room.id == m.chat && room.player.includes(m.sender))
         let room4 = Object.values(client.magz).find(room => room.id == m.chat && !room.player.includes(m.sender) && !room.playing)
         if (!room1) return client.reply(m.chat, Func.texted('bold', `🚩 Session not found, create a session first by sending ${prefix}create`), m)
         if (room2) return client.reply(m.chat, Func.texted('bold', `🚩 Unable to join because the game is in progress.`), m)
         if (room3) return client.reply(m.chat, Func.texted('bold', `🚩 You are already in session.`), m)
         if (room4) {
            room4.player.push(m.sender)
            room4.leaderboard[m.sender] = {
               score: 0,
               correctAns: 0,
               wrongAns: 0
            }
            client.reply(m.chat, Func.texted('bold', `🚩 Successfully logged into the session.`), m)
         } else client.reply(m.chat, Func.texted('bold', `🚩 Error!`), m)
      } else if (command == 'out') {
         let playing = Object.values(client.magz).find(room => room.id && room.playing)
         if (playing) return client.reply(m.chat, Func.texted('bold', `🚩 Cannot exit session because game is in progress.`), m)
         let creator = Object.values(client.magz).find(room => room.id && room.creator == m.sender)
         if (creator) return client.reply(m.chat, Func.texted('bold', `🚩 Because you are the session creator, the session you created with code "${creator.code}" is deleted.`), m).then(() => {
            delete client.magz[creator.id]
         })
         let room = Object.values(client.magz).find(room => room.id && room.player.includes(m.sender))
         if (room) return client.reply(m.chat, Func.texted('bold', `🚩 Exit of Magz game session successfully.`), m).then(() => Func.removeItem(room.player, m.sender))
         client.reply(m.chat, Func.texted('bold', `🚩 You are not in a Magz game session.`), m)
      } else if (command == 'start') {
         let creator = Object.values(client.magz).find(room => room.id == m.chat && room.creator != m.sender)
         if (creator) return client.reply(m.chat, Func.texted('bold', `🚩 Games can only be started by @${creator.creator.split('@')[0]} as session creator.`), m)
         let check = Object.values(client.magz).find(room => room.id == m.chat)
         if (!check) return client.reply(m.chat, Func.texted('bold', `🚩 Session not found, please create a session first by sending ${prefix}create`), m)
         let playing = Object.values(client.magz).find(room => room.id == m.chat && room.playing)
         if (playing) return client.reply(m.chat, Func.texted('bold', `🚩 The game is in progress.`), m)
         let room = Object.values(client.magz).find(room => room.id == m.chat)
         if (room) {
            clearTimeout(room.startTime)
            room.playing = true
            let people = Object.entries(room.leaderboard).sort((a, b) => b[1].score - a[1].score)
            var kata = Func.random(["love", "patient", "kind", "never", "jealous", "envious", "boastful", "proud", "haughty", "selfish", "does", "demand", "keep", "score", "wrongs", "rejoices", "truth", "gives", "loses", "faith", "always", "hopeful", "endures", "through", "every", "circumstance"])
            room.answer = kata.toUpperCase()
            room.playTimes += 1
            let teks = `乂  *M A G Z*\n\n`
            teks += `Start : ${(kata).toUpperCase()}\n`
            teks += `${Func.filter(kata).toUpperCase()}... ?\n\n`
            teks += `Player :\n\n`
            teks += people.map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
            teks += `\n\n`
            teks += `Question : [ ${room.playTimes} / 10 ]\n`
            teks += `Answer this question without reply to messages.`
            room.chat = await client.reply(m.chat, teks, m)
            room.time = setTimeout(() => {
                  if (client.magz[id]) return client.reply(m.chat, Func.texted('bold', `🚩 There is no answer for the first question, room "${room.code}" has been removed.`), m).then(() => delete client.magz[id])
               }, timeout),
               timeout
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['magz'],
   hidden: ['create', 'in', 'out', 'start'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)

const info = (prefix) => {
   return `乂  *M A G Z*
   
Game Magz is a *"Connecting Words"* game, the concept of this game is just looking for words in English, here are the rules of the game :

➠ To play this game, you need 1,000 points. 
➠ There is at least 1 player in 1 session. 
➠ The game lasts 2 minutes with 10 questions.

Command :
➠ *${prefix}create* -- Creates a session. 
➠ *${prefix}in* -- Enter the session. 
➠ *${prefix}out* -- Exit session. 
➠ *${prefix}start* -- Starts the game.

${global.footer}`
}