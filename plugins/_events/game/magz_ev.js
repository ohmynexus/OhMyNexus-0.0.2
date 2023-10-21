neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   env,
   Scraper,
   Func
}) => {
   try {
      var reward = Func.randomInt(env.min_reward, env.max_reward)
      client.magz = client.magz ? client.magz : {}
      let room = Object.values(client.magz).find(room => room.player.includes(m.sender) && room.id == m.chat && room.playing)
      if (room && body && !prefixes.includes(body.charAt(0))) {
         let scores = room.leaderboard[m.sender]
         let people = Object.entries(room.leaderboard).sort((a, b) => b[1].score - a[1].score)
         let show = Math.min(5, people.length)
         let answer = (body.toUpperCase().split` ` [0]).trim()
         clearTimeout(room.time)
         clearTimeout(room.timer)
         if (room.words.includes(answer)) return client.reply(m.chat, Func.texted('bold', `🚩 The word "${answer}" is already used, please find another word.`), m)
         if (!answer.startsWith(Func.filter(room.answer))) {
            room.wrongs += 1
            scores.wrongAns += 1
            if (room.wrongs >= 3) {
               let teks = `乂  *S C O R E (5)*\n\n`
               teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
               teks += `\n\n`
               teks += `Question : [ ${room.playTimes} / 10 ]\n`
               teks += `Game is over for 3x wrong answers, here is the final score.`
               return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                  people.map(([user, data]) => users.point += room.leaderboard[user].score)
                  delete client.magz[room.id]
               })
            } else {
               room.timer = setTimeout(() => {
                  if (room.playTimes == 1) {
                     return client.reply(m.chat, Func.texted('bold', `🚩 There is no activity within 2 minutes, the game is cancelled.`), room.chat).then(() => delete client.magz[room.id])
                  } else {
                     let teks = `乂  *S C O R E (5)*\n\n`
                     teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '??' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                     teks += `\n\n`
                     teks += `Question : [ ${room.playTimes} / 10 ]\n`
                     teks += `Game over and this is the final score.`
                     return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                        people.map(([user, data]) => users.point += room.leaderboard[user].score)
                        delete client.magz[room.id]
                     })
                  }
               }, room.timeout)
               return client.reply(m.chat, `🚩 Word must start with prefix "${Func.filter(room.answer)}".`, m)
            }
         }
         let json = await Scraper.grammar(answer.toLowerCase())
         if (!json.status) {
            room.wrongs += 1
            scores.wrongAns += 1
            if (room.wrongs >= 3) {
               let teks = `乂  *S C O R E (5)*\n\n`
               teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
               teks += `\n\n`
               teks += `Question : [ ${room.playTimes} / 10 ]\n`
               teks += `Game is over for 3x wrong answers, here is the final score.`
               return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                  people.map(([user, data]) => users.point += room.leaderboard[user].score)
                  delete client.magz[room.id]
               })
            } else {
               room.timer = setTimeout(() => {
                  if (room.playTimes == 1) {
                     return client.reply(m.chat, Func.texted('bold', `🚩 There is no activity within 2 minutes, the game is cancelled.`), room.chat).then(() => delete client.magz[room.id])
                  } else {
                     let teks = `乂  *S C O R E (5)*\n\n`
                     teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                     teks += `\n\n`
                     teks += `Question : [ ${room.playTimes} / 10 ]\n`
                     teks += `Game over and this is the final score.`
                     return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                        people.map(([user, data]) => users.point += room.leaderboard[user].score)
                        delete client.magz[room.id]
                     })
                  }
               }, room.timeout)
               return client.reply(m.chat, `🚩 The word *"${answer}"* does not exist in English.`, m)
            }
         } else {
            delete room.m
            room.playTimes += 1
            room.words.push(answer)
            room.answer = answer
            scores.score += reward
            scores.correctAns += 1
            if (room.playTimes >= 10) {
               let teks = `乂  *S C O R E (5)*\n\n`
               teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '🥈' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
               teks += `\n\n`
               teks += `Question : [ ${room.playTimes} / 10 ]\n`
               teks += `Game over and this is the final score.`
               return client.reply(m.chat, teks, room.msg).then(() => {
                  people.map(([user, data]) => users.point += room.leaderboard[user].score)
                  delete client.magz[room.id]
               })
            } else {
               let teks = `乂  *M A G Z*\n\n`
               teks += `Next : ${answer}\n`
               teks += `${Func.filter(answer)}... ?\n\n`
               teks += `Question : [ ${room.playTimes} / 10 ]\n`
               teks += `Continue the words above without reply to the message.`
               room.msg = await client.reply(m.chat, teks, m)
               room.timer = setTimeout(() => {
                  if (room.playTimes == 1) {
                     return client.reply(m.chat, Func.texted('bold', `🚩 There is no activity within 2 minutes, the game is cancelled.`), room.chat).then(() => delete client.magz[room.id])
                  } else {
                     let teks = `乂  *S C O R E (5)*\n\n`
                     teks += people.slice(0, show).map(([user, data], i) => (i + 1) + '. @' + user.split`@` [0] + ' ' + (i == 0 ? '🥇' : i == 1 ? '??' : i == 2 ? '🥉' : '') + '\n    *( × )* : ' + data.wrongAns + '  –  *( √ )* : ' + data.correctAns + '  –  *Score* : ' + Func.formatNumber(data.score)).join('\n')
                     teks += `\n\n`
                     teks += `Question : [ ${room.playTimes} / 10 ]\n`
                     teks += `Game over and this is the final score.`
                     return client.reply(m.chat, teks, room.playTimes == 1 ? room.chat : room.msg).then(() => {
                        people.map(([user, data]) => users.point += room.leaderboard[user].score)
                        delete client.magz[room.id]
                     })
                  }
               }, room.timeout)
            }
         }
      } else {}
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   error: false,
   group: true,
   game: true
}, __filename)