const cron = require('node-cron')
neoxr.create(async (m, {
   client,
   prefix,
   command,
   participants,
   Func
}) => {
   try {
      let user = global.db.users.find(v => v.jid == m.sender)
      client.barbar = client.barbar ? client.barbar : []
      if (user.point == 0) return client.reply(m.chat, Func.texted('bold', `🚩 You have no point playing Barbarian games.`), m)
      if (user.point < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 To play at least you must have 1K points.`), m)
      if (command == 'barbar') return client.sendMessageModify(m.chat, help(prefix), m, {
         thumbnail: await Func.fetchBuffer('https://telegra.ph/file/79f51bd5baab11eacf92e.jpg'),
         largeThumb: true
      })
      let data = global.db.users
      const percent = Func.randomInt(1, 10)
      const member = participants.map(v => v.id)
      const player = member.filter(v => data.find(x => x.jid == v) && data.find(x => x.jid == v).point != 0 && v != m.sender)
      const select = Func.random(player)
      const act = Func.random(['stick the opponent\'s eye with a toothpick until the opponent dies', 'burn opponents so they become black people', 'eats the opponent until the opponent becomes a bone over and over again', 'bury opponents alive like corpses', 'cut opponent\'s dick', 'aaaaaaaaaaaaaaaaaaaa', 'move the opponent\'s dimension into the anime world so that the opponent becomes flattened', 'kick opponent all the way to chalk world'])
      const denda = parseInt(((50 / 100) * data.find(v => v.jid == m.sender).point).toFixed(0))
      // const keys = Func.random([0, 1])
      // const dock = Func.random([0, 1])
      let turned = client.barbar.find(player => player.id == m.sender)
      if (!turned) return client.reply(m.chat, `🚩 Successfully entered into the session, send *${prefix}act* to play.`, m).then(() => client.barbar.push({
         id: m.sender,
         win: 0,
         cooldown: 0
      }))
      const cooldown = new Date(turned.cooldown + 5000)
      if (new Date - turned.cooldown < 5000) return client.reply(m.chat, `💀 Cooldown 5 seconds, *- ${Func.formatNumber(denda)}* (50%)`, m).then(() => data.find(v => v.jid == m.sender).point -= denda)
      // const LevelE = Func.level(data.find(v => v.jid == select).point)[0]
      // const LevelS = Func.level(data.find(v => v.jid == m.sender).point)[0]
      if (client.barbar.length != 0) {
         cron.schedule('*/5 * * * * *', async () => client.barbar.map(v => v.win == 0))
      }
      turned.cooldown = new Date() * 1
      if (turned.win >= 5) {
         if (data.find(v => v.jid == m.sender).guard >= 10) {
            data.find(v => v.jid == m.sender).guard = 0
            if (turned.win > 0) turned.win -= 1
            let teks = `乂  *F I G H T*\n\n`
            teks += `➠ Opponent : @0 – Level : [ ∞ ]\n\n`
            teks += `*Draw!*, the guard you have runs out completely and becomes a Nigga for fighting WhatsApp with the Infinity level`
            client.reply(m.chat, teks, m)
         } else {
            const restrict = Func.randomInt(5, 50)
            const point = parseInt(((restrict / 100) * data.find(v => v.jid == m.sender).point).toFixed(0))
            data.find(v => v.jid == m.sender).point -= point
            data.find(v => v.jid == m.sender).guard = 0
            if (turned.win > 0) turned.win -= 1
            let teks = `乂  *F I G H T*\n\n`
            teks += `➠ Opponent : @0 – Level : [ ∞ ]\n\n`
            teks += `*Lose!*, your opponent is the WhatsApp party with the infinity level, your guard is completely depleted & your points are reduced *- ${Func.formatNumber(point)}* points. (${restrict}%)`
            client.reply(m.chat, teks, m)
         }
      } else {
         if (Func.level(data.find(v => v.jid == select).point)[0] > Func.level(data.find(v => v.jid == m.sender).point)[0]) {
            if (data.find(v => v.jid == m.sender).guard >= 10) {
               if (data.find(v => v.jid == select).premium && data.find(v => v.jid == m.sender).premium) {
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Draw!*, you and your opponents are both global elites.`
                  client.reply(m.chat, teks, m)
               } else if (data.find(v => v.jid == select).premium) {
                  const point = parseInt(((percent / 100) * data.find(v => v.jid == m.sender).point).toFixed(0))
                  data.find(v => v.jid == m.sender).point -= point
                  data.find(v => v.jid == select).point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Lose!*, your opponent is part of the global elite, the guard you have is useless your points are reduced by as much *- ${Func.formatNumber(point)}* points. (${percent}%)`
                  client.reply(m.chat, teks, m)
               } else {
                  data.find(v => v.jid == m.sender).guard -= 10
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Draw!*, your level is lower than your opponent's level & because you have your guard point.`
                  client.reply(m.chat, teks, m)
               }
            } else {
               if (data.find(v => v.jid == select).premium && data.find(v => v.jid == m.sender).premium) {
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Draw!*, you and your opponents are both global elites.`
                  client.reply(m.chat, teks, m)
               } else if (data.find(v => v.jid == select).premium) {
                  const point = parseInt(((percent / 100) * data.find(v => v.jid == m.sender).point).toFixed(0))
                  data.find(v => v.jid == m.sender).point -= point
                  data.find(v => v.jid == select).point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Lose!*, your opponent is part of the global elite, your points decrease by as much *- ${Func.formatNumber(point)}* points. (${percent}%)`
                  client.reply(m.chat, teks, m)
               } else {
                  const restrict = data.find(v => v.jid == m.sender).point > 500000000 ? 50 : percent
                  const point = parseInt(((restrict / 100) * data.find(v => v.jid == m.sender).point).toFixed(0))
                  data.find(v => v.jid == m.sender).point -= point
                  data.find(v => v.jid == select).point += point
                  if (turned.win > 0) turned.win -= 1
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Lose!*, your level is lower than the opponent's level, your points are reduced by as much *- ${Func.formatNumber(point)}* points. (${percent}%)`
                  client.reply(m.chat, teks, m)
               }
            }
         } else {
            if (data.find(v => v.jid == select).guard >= 10) {
               if (data.find(v => v.jid == select).premium && data.find(v => v.jid == m.sender).premium) {
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Draw!*, you and your opponents are both global elites.`
                  client.reply(m.chat, teks, m)
               } else if (data.find(v => v.jid == m.sender).premium) {
                  const point = parseInt(((percent / 100) * data.find(v => v.jid == select).point).toFixed(0))
                  data.find(v => v.jid == select).point -= point
                  data.find(v => v.jid == m.sender).point += point
                  turned.win += 1
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Win!*, because you are part of the global elite, the guard that the opponent has is useless & you get *+ ${Func.formatNumber(point)}* points. (${percent}%)`
                  client.reply(m.chat, teks, m)
               } else {
                  data.find(v => v.jid == select).guard -= 10
                  let teks = `乂  *F I G H T*\n\n`
                  teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
                  teks += `*Draw!*, the opponent is protected by the guard.`
                  client.reply(m.chat, teks, m)
               }
            } else {
               const point = parseInt(((percent / 100) * data.find(v => v.jid == select).point).toFixed(0))
               data.find(v => v.jid == select).point -= point
               data.find(v => v.jid == m.sender).point += point
               turned.win += 1
               let teks = `乂  *F I G H T*\n\n`
               teks += `➠ Opponent : @${select.replace(/@.+/g, '')} – Level : [ ${Func.level(data.find(v => v.jid == select).point)[0]} ]\n\n`
               teks += `*Win!*, you succeeded ${act}, and got *+ ${Func.formatNumber(point)}* points. (${percent}%)`
               client.reply(m.chat, teks, m)
            }
         }
      }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['barbar'],
   hidden: ['act'],
   category: 'games',
   limit: true,
   game: true,
   group: true
}, __filename)

const help = prefix => {
   return `乂  *B A R B A R*

This game is a fighting game between group members, here is the gameplay :
 
➠ The points of each group member have the potential to be taken by other members with this feature. 
➠ Players who win will get points for players who lose.
➠ Points added and subtracted by 1 - 10 percent. 
➠ Points will be protected if the player has a *Guard*, send *${prefix}buyguard* to buy a guard. 
➠ 10 guards are needed once protection, buy as many guards as possible so that the point remains safe. 
➠ Players with Global Elite status (Premium) can bypass the opponent's guard. 
➠ To play, please send the command *${prefix}act*. 
➠ 5 seconds / execution, if spam will be subject to a fine of 50%.

${global.footer}`
}